# Soccer Tournaments

RESTful API built with Django and Django REST Framework for managing soccer/football tournaments, teams, matches, games, players, and in-game events.

## Project Structure

```
soccer-tournaments/
├── .env.example              # Environment variables template
├── .gitignore
├── README.md
└── django_project/           # Backend application
    ├── manage.py
    ├── requirements.txt
    ├── README.md
    ├── django_project/       # Project configuration
    ├── tournaments/          # Tournament management
    ├── teams/                # Team management
    ├── match/                # Match (round/jornada) management
    ├── game/                 # Game (individual fixture with scores)
    ├── player/               # Player management
    └── gameEvents/           # In-game events (goals, cards, etc.)
```

## Quick Start

```bash
cd django_project
pip install -r requirements.txt
cp ../.env.example .env
python manage.py migrate
python manage.py runserver
```

Full setup instructions are available in [django_project/README.md](django_project/README.md).

## Tech Stack

- **Framework:** Django 5.2.13
- **API:** Django REST Framework
- **Database:** SQLite
- **CORS:** django-cors-headers

## Data Models

- **Tournament** - Soccer tournament with name, city, type, status, and date range
- **Team** - Team associated with a tournament
- **Match** - Round/matchday (e.g., "Jornada 1") within a tournament
- **Game** - Individual fixture between two teams with scores
- **Player** - Player associated with a team
- **GameEvent** - In-game events (goals, cards) linked to a game and player

## API Endpoints

| Resource | Base Path |
|----------|-----------|
| Tournaments | `/api/tournaments/` |
| Teams | `/api/teams/` |
| Matches | `/api/matches/` |
| Games | `/api/games/` |
| Players | `/api/players/` |
| Game Events | `/api/gameevents/` |

All endpoints support standard CRUD operations (GET, POST, PUT/PATCH, DELETE).

## Configuration

Environment variables are defined in `.env.example`. Copy to `.env` and adjust as needed.

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | - | Django secret key |
| `DEBUG` | `True` | Debug mode |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Allowed hosts |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:8000` | CORS origins |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost:3000` | CSRF trusted origins |
| `DATABASE_ENGINE` | `django.db.backends.sqlite3` | Database engine |
| `DATABASE_NAME` | `db.sqlite3` | Database name |
| `LANGUAGE_CODE` | `en-us` | Language |
| `TIME_ZONE` | `UTC` | Timezone |

## License

Academic project for Modelos de Computacin - Universidad de Nario.
