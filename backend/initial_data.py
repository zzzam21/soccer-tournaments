import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
django.setup()

import logging
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.conf import settings
from tournaments.models import Tournament
from teams.models import Team
from player.models import Player
from match.models import Match
from game.models import Game
from gameEvents.models import GameEvent

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

User = get_user_model()


def _ensure_superuser():
    email = getattr(settings, 'DJANGO_SUPERUSER_EMAIL', 'admin@admin.com')
    password = getattr(settings, 'DJANGO_SUPERUSER_PASSWORD', 'admin123')

    if User.objects.filter(is_superuser=True).exists():
        logger.info('Superuser already exists, skipping')
        return

    User.objects.create_superuser(
        username='admin',
        email=email,
        password=password,
    )
    logger.info('Superuser created (admin / %s)', password)


_TOURNAMENTS_SEED = [
    {
        'name': 'Copa Mundial FIFA 2026',
        'city': 'Ciudad de México',
        'type': 'International',
        'status': 'Ongoing',
        'start_date': date(2026, 6, 1),
        'end_date': date(2026, 7, 15),
    },
    {
        'name': 'Liga Colombiana 2026',
        'city': 'Bogotá',
        'type': 'Local',
        'status': 'Ongoing',
        'start_date': date(2026, 2, 1),
        'end_date': date(2026, 11, 30),
    },
    {
        'name': 'Eurocopa 2024',
        'city': 'Berlín',
        'type': 'International',
        'status': 'Completed',
        'start_date': date(2024, 6, 14),
        'end_date': date(2024, 7, 14),
    },
]

_TEAMS_BY_TOURNAMENT = {
    'Copa Mundial FIFA 2026': [
        'Argentina', 'Brasil', 'Colombia', 'Uruguay',
        'Francia', 'España', 'Inglaterra', 'Alemania',
    ],
    'Liga Colombiana 2026': [
        'Atlético Nacional', 'Millonarios', 'América de Cali',
        'Junior', 'Deportivo Cali', 'Independiente Medellín',
    ],
    'Eurocopa 2024': [
        'España', 'Inglaterra', 'Francia', 'Alemania',
        'Portugal', 'Italia', 'Países Bajos', 'Bélgica',
    ],
}

_PLAYERS_BY_TEAM = {
    'Argentina': ['Lionel Messi', 'Ángel Di María', 'Lautaro Martínez', 'Emiliano Martínez'],
    'Brasil': ['Neymar', 'Vinícius Jr.', 'Rodrygo', 'Alisson'],
    'Colombia': ['James Rodríguez', 'Luis Díaz', 'Rafael Santos Borré', 'David Ospina'],
    'Uruguay': ['Federico Valverde', 'Darwin Núñez', 'Ronald Araújo', 'Sergio Rochet'],
    'Francia': ['Kylian Mbappé', 'Antoine Griezmann', 'Eduardo Camavinga', 'Mike Maignan'],
    'España': ['Pedri', 'Lamine Yamal', 'Álvaro Morata', 'Unai Simón'],
    'Inglaterra': ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Jordan Pickford'],
    'Alemania': ['Jamal Musiala', 'Florian Wirtz', 'İlkay Gündoğan', 'Manuel Neuer'],
    'Portugal': ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Diogo Costa'],
    'Italia': ['Gianluigi Donnarumma', 'Nicolò Barella', 'Federico Chiesa', 'Alessandro Bastoni'],
    'Países Bajos': ['Virgil van Dijk', 'Frenkie de Jong', 'Memphis Depay', 'Bart Verbruggen'],
    'Bélgica': ['Kevin De Bruyne', 'Romelu Lukaku', 'Youri Tielemans', 'Thibaut Courtois'],
    'Atlético Nacional': ['Jefferson Duque', 'Jarlan Barrera', 'Dorlan Pabón', 'Kevin Mier'],
    'Millonarios': ['Radamel Falcao', 'Daniel Ruiz', 'Larry Vásquez', 'Álvaro Montero'],
    'América de Cali': ['Adrián Ramos', 'Cristian Barrios', 'Luis Paz', 'Joel Graterol'],
    'Junior': ['Carlos Bacca', 'Luis Díaz', 'Jhon Arias', 'Jefferson Martínez'],
    'Deportivo Cali': ['Teófilo Gutiérrez', 'Kevin Velasco', 'Jhon Vásquez', 'Johan Wallens'],
    'Independiente Medellín': ['Luciano Pons', 'Andrés Ricaurte', 'Felipe Pardo', 'Andrés Mosquera'],
}


def _seed_tournaments():
    for data in _TOURNAMENTS_SEED:
        _, created = Tournament.objects.get_or_create(
            name=data['name'],
            defaults=data,
        )
        if created:
            logger.info('Tournament created: %s', data['name'])


def _seed_teams():
    for tournament_name, team_names in _TEAMS_BY_TOURNAMENT.items():
        try:
            tournament = Tournament.objects.get(name=tournament_name)
        except Tournament.DoesNotExist:
            logger.warning('Tournament "%s" not found, skipping teams', tournament_name)
            continue
        for name in team_names:
            _, created = Team.objects.get_or_create(
                name=name,
                tournament=tournament,
            )
            if created:
                logger.info('Team created: %s (%s)', name, tournament_name)


def _seed_players():
    for team_name, player_names in _PLAYERS_BY_TEAM.items():
        teams = list(Team.objects.filter(name=team_name))
        if not teams:
            logger.warning('Team "%s" not found, skipping players', team_name)
            continue
        team = teams[0]
        if len(teams) > 1:
            logger.warning('Multiple teams named "%s", using first found', team_name)
        for name in player_names:
            _, created = Player.objects.get_or_create(
                name=name,
                team=team,
            )
            if created:
                logger.info('Player created: %s (%s)', name, team_name)


def main():
    logger.info('Creating initial data...')
    _ensure_superuser()
    _seed_tournaments()
    _seed_teams()
    _seed_players()
    logger.info('Initial data created successfully')


if __name__ == '__main__':
    main()
