from django.urls import path
from .views import RegisterView, LoginView, LogoutView, MyPageView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MyPageView.as_view()),
]
