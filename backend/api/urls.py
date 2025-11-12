from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import LogoutView, LoginView


router = DefaultRouter()

urlpatterns = [
    path("", include(router.urls)),
    path(r"login/", LoginView.as_view(), name="knox_login"),
    path(r"logout/", LogoutView.as_view(), name="knox_logout"),
]
