from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
from django.db.models import Count, Sum, Q
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from tournaments.models import Tournament
from teams.models import Team
from player.models import Player
from match.models import Match
from game.models import Game

from .serializers import StatsSerializer, ContactSerializer


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


class ContactView(APIView):
    @extend_schema(request=ContactSerializer, responses={201: None})
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        message = (
            f"Nombre: {data['name']}\n"
            f"Email: {data['email']}\n"
            f"Asunto: {data['subject']}\n\n"
            f"Mensaje:\n{data['message']}"
        )

        send_mail(
            subject=f"[Contacto] {data['subject']}",
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.CONTACT_RECIPIENT],
            fail_silently=False,
        )

        return Response({'detail': 'Mensaje enviado correctamente'}, status=status.HTTP_201_CREATED)
