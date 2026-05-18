from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
from django.db.models import Count, Sum, Q

from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from tournaments.models import Tournament
from teams.models import Team
from player.models import Player
from match.models import Match
from game.models import Game

from .serializers import StatsSerializer


def health_check(request):
    db_ok = True
    try:
        connections['default'].cursor().execute('SELECT 1')
    except OperationalError:
        db_ok = False

    return JsonResponse({
        'status': 'ok' if db_ok else 'degraded',
        'database': 'connected' if db_ok else 'unreachable',
    })


class StatsView(APIView):
    @extend_schema(responses=StatsSerializer)
    def get(self, request):
        goals_agg = Game.objects.aggregate(
            total=Sum('local_goals') + Sum('visitant_goals')
        )

        data = {
            'total_tournaments': Tournament.objects.count(),
            'total_teams': Team.objects.count(),
            'total_players': Player.objects.count(),
            'total_matches': Match.objects.count(),
            'total_games': Game.objects.count(),
            'total_goals': goals_agg['total'] or 0,
            'ongoing_tournaments': Tournament.objects.filter(status__iexact='Ongoing').count(),
            'completed_tournaments': Tournament.objects.filter(status__iexact='Completed').count(),
        }
        return Response(data)
