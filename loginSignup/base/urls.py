from django.urls import path, include
from .views import authView, home,custom_logout, pomodoro_timer

urlpatterns = [
path('accounts/logout/', custom_logout, name='logout'),
 path("", home, name="home"),
 path("signup/", authView, name="authView"),
 path("accounts/", include("django.contrib.auth.urls")),
 path("pomodoro/", pomodoro_timer, name="pomodoro_timer"),
]