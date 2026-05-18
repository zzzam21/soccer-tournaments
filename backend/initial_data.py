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


def _get_team(tournament_name, team_name):
    try:
        tournament = Tournament.objects.get(name=tournament_name)
    except Tournament.DoesNotExist:
        logger.warning('Tournament "%s" not found, skipping', tournament_name)
        return None
    teams = list(Team.objects.filter(name=team_name, tournament=tournament))
    if not teams:
        logger.warning('Team "%s" not found in "%s"', team_name, tournament_name)
        return None
    return teams[0]


_MATCHES_SEED = {
    'Copa Mundial FIFA 2026': [
        {
            'number': 1, 'start_date': date(2026, 6, 5), 'name': 'Fase de grupos',
            'games': [
                ('Argentina', 'Brasil', 2, 1, 'Finished'),
                ('Colombia', 'Uruguay', 1, 1, 'Finished'),
                ('Francia', 'España', 3, 0, 'Finished'),
                ('Inglaterra', 'Alemania', 1, 2, 'Finished'),
            ],
        },
        {
            'number': 2, 'start_date': date(2026, 6, 20), 'name': 'Cuartos de final',
            'games': [
                ('Argentina', 'Colombia', 2, 0, 'Finished'),
                ('Alemania', 'Francia', 1, 1, 'Finished'),
            ],
        },
        {
            'number': 3, 'start_date': date(2026, 7, 5), 'name': 'Semifinales',
            'games': [
                ('Argentina', 'Alemania', None, None, 'Scheduled'),
                ('Francia', 'Brasil', None, None, 'Scheduled'),
            ],
        },
    ],
    'Liga Colombiana 2026': [
        {
            'number': 1, 'start_date': date(2026, 2, 10), 'name': 'Jornada 1',
            'games': [
                ('Atlético Nacional', 'Millonarios', 3, 2, 'Finished'),
                ('América de Cali', 'Junior', 1, 0, 'Finished'),
                ('Deportivo Cali', 'Independiente Medellín', 2, 2, 'Finished'),
            ],
        },
        {
            'number': 2, 'start_date': date(2026, 2, 25), 'name': 'Jornada 2',
            'games': [
                ('Millonarios', 'América de Cali', 1, 1, 'Finished'),
                ('Junior', 'Deportivo Cali', 2, 0, 'Finished'),
                ('Independiente Medellín', 'Atlético Nacional', None, None, 'Scheduled'),
            ],
        },
    ],
    'Eurocopa 2024': [
        {
            'number': 1, 'start_date': date(2024, 6, 16), 'name': 'Fase de grupos',
            'games': [
                ('España', 'Portugal', 3, 1, 'Finished'),
                ('Inglaterra', 'Italia', 2, 0, 'Finished'),
                ('Francia', 'Países Bajos', 1, 1, 'Finished'),
                ('Alemania', 'Bélgica', 4, 2, 'Finished'),
            ],
        },
        {
            'number': 2, 'start_date': date(2024, 6, 28), 'name': 'Cuartos de final',
            'games': [
                ('España', 'Inglaterra', 2, 1, 'Finished'),
                ('Francia', 'Alemania', 0, 0, 'Finished'),
            ],
        },
        {
            'number': 3, 'start_date': date(2024, 7, 5), 'name': 'Semifinales',
            'games': [
                ('España', 'Francia', 2, 0, 'Finished'),
                ('Inglaterra', 'Alemania', 1, 1, 'Finished'),
            ],
        },
        {
            'number': 4, 'start_date': date(2024, 7, 14), 'name': 'Final',
            'games': [
                ('España', 'Inglaterra', 3, 2, 'Finished'),
            ],
        },
    ],
}


def _seed_matches_and_games():
    for tournament_name, match_days in _MATCHES_SEED.items():
        try:
            tournament = Tournament.objects.get(name=tournament_name)
        except Tournament.DoesNotExist:
            logger.warning('Tournament "%s" not found, skipping matches', tournament_name)
            continue

        for md in match_days:
            match_obj, created = Match.objects.get_or_create(
                number=md['number'],
                tournament=tournament,
                defaults={'start_date': md['start_date']},
            )
            if created:
                logger.info('Match created: Jornada %s (%s)', md['number'], tournament_name)
            elif match_obj.start_date != md['start_date']:
                match_obj.start_date = md['start_date']
                match_obj.save()

            for local_name, visitant_name, local_goals, visitant_goals, status in md['games']:
                local = _get_team(tournament_name, local_name)
                visitant = _get_team(tournament_name, visitant_name)
                if not local or not visitant:
                    continue

                defaults = {
                    'status': status,
                    'date': md['start_date'],
                    'match': match_obj,
                    'local_team': local,
                    'visitant_team': visitant,
                }
                if local_goals is not None:
                    defaults['local_goals'] = local_goals
                    defaults['visitant_goals'] = visitant_goals
                else:
                    defaults['local_goals'] = 0
                    defaults['visitant_goals'] = 0

                _, created = Game.objects.get_or_create(
                    match=match_obj,
                    local_team=local,
                    visitant_team=visitant,
                    defaults=defaults,
                )
                if created:
                    logger.info('Game created: %s vs %s (%s)', local_name, visitant_name, tournament_name)


def main():
    logger.info('Creating initial data...')
    _ensure_superuser()
    _seed_tournaments()
    _seed_teams()
    _seed_players()
    _seed_matches_and_games()
    logger.info('Initial data created successfully')


if __name__ == '__main__':
    main()
