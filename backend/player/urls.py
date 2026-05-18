from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import PlayerDetailView, PlayerViewSet

urlpatterns = [
    path("<int:pk>/", PlayerDetailView.as_view(), name="player-detail-API"),
    path("", PlayerViewSet.as_view(), name="player-API"),
]
