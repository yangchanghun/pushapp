from django.urls import path
from . import views
from .views import VisitorCreateView,VisitorDetailView

urlpatterns = [
    path("create/", VisitorCreateView.as_view(), name="visitor-create"),
    path("check/<str:token>/", views.check_token_valid, name="check-token"),
    path('detail/<uuid:token>/', VisitorDetailView.as_view(), name='visitor-detail'),
    path("accept/<uuid:token>/", views.accept_visit, name="accept-visit"),
    path("reject/<uuid:token>/", views.reject_visit, name="reject-visit"),
]