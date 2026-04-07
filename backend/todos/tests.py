import pytest
from unittest.mock import patch, Mock
import requests
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from todos.models import Task

User = get_user_model()

@pytest.fixture
def auth_client():
    user = User.objects.create_user(username='testuser', password='password123', email='test@example.com')
    client = APIClient()
    client.force_authenticate(user=user)
    return client, user

@pytest.mark.django_db
@patch('todos.views.requests.get')
def test_suggest_task_success(mock_get, auth_client):
    client, user = auth_client
    
    mock_response = Mock()
    mock_response.json.return_value = {
        "slip": {
            "id": 123,
            "advice": "Test advice slip"
        }
    }
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response
    
    # We didn't define a custom URL for the extra action explicitly, DRF Router does it mapping action name
    url = '/api/todos/tasks/suggest/' 
    response = client.post(url)
    
    assert response.status_code == 201
    assert response.data['title'] == "Test advice slip"
    assert response.data['owner'] == user.id
    
    assert Task.objects.filter(title="Test advice slip", owner=user).exists()

@pytest.mark.django_db
@patch('todos.views.requests.get')
def test_suggest_task_api_failure(mock_get, auth_client):
    client, user = auth_client
    
    mock_get.side_effect = requests.RequestException("API is down")
    
    url = '/api/todos/tasks/suggest/'
    response = client.post(url)
    
    assert response.status_code == 503
    assert 'error' in response.data
    assert response.data['error'] == 'Failed to fetch advice from external API.'
    
    assert Task.objects.count() == 0
