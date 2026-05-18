from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .auth_views import RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', obtain_auth_token, name='api-token-auth'),
    path('api/auth/register/', RegisterView.as_view(), name='api-auth-register'),
    path('api/utils/', include('utils.urls')),
    path('api/tournaments/', include('tournaments.urls')),
    path('api/teams/', include('teams.urls')),
    path('api/gameevents/', include('gameEvents.urls')),
    path('api/players/', include('player.urls')),
    path('api/games/', include('game.urls')),
    path('api/matches/', include('match.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
