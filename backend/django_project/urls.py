from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', obtain_auth_token, name='api-token-auth'),
    path('api/tournaments/', include('tournaments.urls')),
    path('api/teams/', include('teams.urls')),
    path('api/gameevents/', include('gameEvents.urls')),
    path('api/players/', include('player.urls')),
    path('api/games/', include('game.urls')),
    path('api/matches/', include('match.urls')),
]
