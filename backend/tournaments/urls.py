from django.urls import path

from .views import Tournaments, TournamentDetail

urlpatterns = [
    path("<int:pk>/", TournamentDetail.as_view(), name="tournament-detail-API"),
    path("", Tournaments.as_view(), name="tournament-API"),
]
