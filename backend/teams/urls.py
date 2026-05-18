from django.urls import path

from .views import Teams, TeamDetail

urlpatterns = [
    path("<int:pk>/", TeamDetail.as_view(), name="team-detail-API"),
    path("", Teams.as_view(), name="team-API"),
]
