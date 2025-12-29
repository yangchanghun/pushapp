from django.urls import path
from .views import ProfessorListView,LocationImageCreateView,LocationImageListView, ProfessorCreateView,ProfessorExcelUploadView,ProfessorDetailView,ProfessorUpdateView,ProfessorDeleteView

urlpatterns = [
    path('create/', ProfessorCreateView.as_view(), name='professor-create'),
    path('list/', ProfessorListView.as_view(), name='professor-list'),
    path('<int:id>/', ProfessorDetailView.as_view()),
    path('<int:id>/update/', ProfessorUpdateView.as_view()),
    path('<int:id>/delete/', ProfessorDeleteView.as_view()),
    path("upload/excel/", ProfessorExcelUploadView.as_view()),
    path("location-image/create/", LocationImageCreateView.as_view(), name="location-image-create"),
    path("location-image/list/", LocationImageListView.as_view()),
]