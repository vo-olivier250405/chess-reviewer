from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import LogoutView, LoginView, user_view_set


router = DefaultRouter()

router.register(r"users", user_view_set.UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path(r"login/", LoginView.as_view(), name="knox_login"),
    path(r"logout/", LogoutView.as_view(), name="knox_logout"),
]
