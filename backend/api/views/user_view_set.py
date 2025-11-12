from knox.auth import TokenAuthentication
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import User
from api.serializers.user_serializer import UserSerializer, UserCreateSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "register"]:
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        return User.objects.all()

    def get_permissions(self):
        if self.action in ["create", "register"]:
            self.permission_classes = []
        return super().get_permissions()

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = self.get_serializer()(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
