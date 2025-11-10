from django.urls import path
from .views import ProfessorListView, ProfessorCreateView

urlpatterns = [
    path('create/', ProfessorCreateView.as_view(), name='professor-create'),
    path('list/', ProfessorListView.as_view(), name='professor-list'),
]