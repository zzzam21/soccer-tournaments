from rest_framework.routers import DefaultRouter
from .views import GameEventViewSet

from django.urls import path

from .views import GameEventDetailView

urlpatterns = [
    path("<int:pk>/", GameEventDetailView.as_view(), name="gameevent-detail-API"),
    path("", GameEventViewSet.as_view(), name="gameevent-API"),
]
