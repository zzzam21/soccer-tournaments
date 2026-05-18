from django.template.defaulttags import url
from rest_framework.routers import DefaultRouter
from game.views import GameViewSet, GameDetailView
from django.urls import path

urlpatterns = [
    path('<int:pk>/', GameDetailView.as_view(), name='game-detail-API'),
    path('', GameViewSet.as_view(), name='game-API'),
]