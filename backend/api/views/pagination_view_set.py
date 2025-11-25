from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


class BaseViewSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 9
    django_paginator_class = Paginator

    def get_page_size(self, request):
        per_page = request.query_params.get("per_page")
        if per_page is not None:
            try:
                per_page = int(per_page)
                if per_page > 0:
                    return min(per_page, self.max_page_size)
            except (TypeError, ValueError):
                pass

        return super().get_page_size(request)

    def get_page_number(self, request, paginator):
        page_number = request.query_params.get("page")
        if page_number is None:
            page_number = request.query_params.get(self.page_query_param, 1)

        if page_number in self.last_page_strings:
            page_number = paginator.num_pages

        try:
            page_number = int(page_number)
        except (TypeError, ValueError):
            page_number = 1

        if page_number <= 0:
            raise ValidationError({"page": "The page number must be greater than 0."})

        if page_number > paginator.num_pages and paginator.num_pages > 0:
            raise ValidationError(
                {
                    "page": f"The page number {page_number} does not exist. The total number of pages is {paginator.num_pages}."
                }
            )

        return page_number

    def get_paginated_response(self, data):
        return Response(
            {
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "count": self.page.paginator.count,
                "pager": {
                    "current": self.page.number,
                    "total": self.page.paginator.num_pages,
                },
                "data": data,
            }
        )
