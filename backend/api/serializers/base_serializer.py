from rest_framework import serializers
from api.models import User


class BaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = None
        fields = "__all__"

    def __init__(self, *args, **kwargs):

        user_or_id: User | int = kwargs.pop("user_or_id", None)
        self.instances = kwargs.pop("instances", None)
        view = kwargs.pop("view", None)
        self.request = kwargs.pop("request", None)

        fields_to_display = kwargs.pop("fields_to_display", None)
        fields_to_hide = kwargs.pop("fields_to_hide", None)

        super().__init__(*args, **kwargs)

        if fields_to_display is not None:
            final_fields = {}
            for field in fields_to_display:
                if field in self.fields:
                    final_fields[field] = self.fields[field]
            self.fields = final_fields

        if fields_to_hide is not None:
            for field in fields_to_hide:
                self.fields.pop(field, None)

        if self.request is None and view:
            self.request = view.request

        if self.context:
            if "request" in self.context and self.request is None:
                self.request = self.context["request"]
            if "request" in self.context:
                self.user = self.context["request"].user
            if "view" in self.context:
                self.view = self.context["view"]
                self.view_name = self.view.__class__.__name__

        else:
            self.user: User = (
                user_or_id
                if isinstance(user_or_id, User)
                else User.objects.get(pk=user_or_id) if user_or_id else None
            )
            self.view = view
            self.view_name = self.view.__class__.__name__

        if self.request and not hasattr(self, "user"):
            self.user = self.request.user

        self.__propagate_class_properties()

    def __propagate_class_properties(self):
        for field in self.fields.values():
            if (
                field
                and isinstance(field, BaseSerializer)
                and (self.user or self.request)
            ):
                setattr(field, "user", self.user or self.request.user)
                if getattr(self, "request"):
                    setattr(field, "request", self.request)
