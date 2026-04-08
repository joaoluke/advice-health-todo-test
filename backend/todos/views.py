import requests
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_completed', 'status', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(owner=user) | Task.objects.filter(shared_with=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        old_task = self.get_object()
        new_task = serializer.save()
        
        if hasattr(new_task.owner, 'profile'):
            if not old_task.is_completed and new_task.is_completed:
                new_task.owner.profile.add_xp(10)
                new_task.status = 'DONE'
                new_task.save()
            elif new_task.status == 'DONE' and old_task.status != 'DONE':
                new_task.owner.profile.add_xp(10)
                new_task.is_completed = True
                new_task.save()

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        user = request.user
        tasks = Task.objects.filter(owner=user) | Task.objects.filter(shared_with=user)
        total = tasks.count()
        completed = tasks.filter(is_completed=True).count()
        todo = tasks.filter(status='TODO').count()
        in_progress = tasks.filter(status='IN_PROGRESS').count()
        
        categories = Category.objects.filter(owner=user)
        cat_stats = []
        for cat in categories:
            cat_stats.append({
                'name': cat.name,
                'count': tasks.filter(category=cat).count()
            })
            
        return Response({
            'total': total,
            'completed': completed,
            'todo': todo,
            'in_progress': in_progress,
            'categories': cat_stats
        })

    @action(detail=False, methods=['post'], url_path='suggest')
    def suggest_task(self, request):
        try:
            response = requests.get('https://api.adviceslip.com/advice', timeout=5)
            response.raise_for_status()
            data = response.json()
            advice_text = data.get('slip', {}).get('advice', 'Could not get advice')
            
            task = Task.objects.create(title=advice_text, owner=request.user)
            serializer = self.get_serializer(task)
            return Response(serializer.data, status=201)
        except requests.RequestException as e:
            return Response({'error': 'Failed to fetch advice from external API.', 'details': str(e)}, status=503)
