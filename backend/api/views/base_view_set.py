from knox.auth import TokenAuthentication
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from api.views.pagination_view_set import BaseViewSetPagination


class BaseViewSet(ModelViewSet):
    pagination_class = BaseViewSetPagination
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    @property
    def user(self):
        return self.request.user

    @property
    def model_name(self):
        return self.queryset.model.__name__

    def get_queryset(self):
        queryset = super().get_queryset()

        return queryset
