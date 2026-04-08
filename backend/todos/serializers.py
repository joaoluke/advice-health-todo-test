from rest_framework import serializers
from .models import Category, Task
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'owner', 'created_at']
        read_only_fields = ['owner', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    category = CategorySerializer(read_only=True)
    shared_with = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_completed', 'status',
            'owner', 'category', 'category_id', 'shared_with',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def validate_category_id(self, value):
        if value and value.owner != self.context['request'].user:
            raise serializers.ValidationError("You can only assign tasks to your own categories.")
        return value
