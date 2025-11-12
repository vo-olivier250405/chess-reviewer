from django.contrib.auth import login, logout

from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView

from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer

from api.serializers import UserSerializer


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def get_user_serializer_class(self):
        return UserSerializer

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class LogoutView(KnoxLogoutView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return super(LogoutView, self).post(request)
