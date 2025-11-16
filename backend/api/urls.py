from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    LogoutView,
    LoginView,
    UserViewSet,
    GameViewSet,
    NotificationViewSet,
)


router = DefaultRouter()

router.register(r"users", UserViewSet, basename="user")
router.register(r"games", GameViewSet, basename="game")
router.register(r"notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("", include(router.urls)),
    path(r"login/", LoginView.as_view(), name="knox_login"),
    path(r"logout/", LogoutView.as_view(), name="knox_logout"),
]
