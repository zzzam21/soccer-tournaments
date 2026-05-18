from django.template.defaulttags import url
from rest_framework.routers import DefaultRouter
from match.views import MatchViewSet, MatchDetailView
from django.urls import path

urlpatterns = [
    path('<int:pk>/', MatchDetailView.as_view(), name='match-detail-API'),
    path('', MatchViewSet.as_view(), name='match-API'),
]