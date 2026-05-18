# Django Project - Soccer Tournaments API

RESTful API backend for managing soccer/football tournaments, teams, matches, games, players, and in-game events.

## Tech Stack

- **Framework:** Django 5.2.13
- **API:** Django REST Framework
- **Database:** SQLite
- **CORS:** django-cors-headers

## Project Structure

```
django_project/
├── manage.py
├── requirements.txt
├── django_project/          # Main configuration
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── tournaments/             # Tournament management
├── teams/                   # Team management
├── match/                   # Match (round/jornada) management
├── game/                    # Game (individual fixture with scores)
├── player/                  # Player management
└── gameEvents/              # In-game events (goals, cards, etc.)
```

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server:**
   ```bash
   python manage.py runserver
   ```

## Data Models

### Tournament

| Field | Type | Description |
|-------|------|-------------|
| name | CharField(100) | Tournament name |
| city | CharField(100) | Host city |
| type | CharField(50) | Tournament type |
| status | CharField(20) | Current status |
| start_date | DateField | Start date |
| end_date | DateField | End date |

### Team

| Field | Type | Description |
|-------|------|-------------|
| name | CharField(255) | Team name |
| tournament | ForeignKey(Tournament) | Associated tournament (CASCADE) |

### Match

Represents a round or matchday (e.g., "Jornada 1").

| Field | Type | Description |
|-------|------|-------------|
| number | IntegerField | Round number |
| start_date | DateField | Start date |
| tournament | ForeignKey(Tournament) | Associated tournament (CASCADE) |

### Game

Represents an individual fixture between two teams with scores.

| Field | Type | Description |
|-------|------|-------------|
| local_goals | IntegerField | Home team goals |
| visitant_goals | IntegerField | Away team goals |
| status | CharField(20) | Game status |
| date | DateField | Game date |
| match | ForeignKey(Match) | Associated matchday (CASCADE) |
| local_team | ForeignKey(Team) | Home team (CASCADE) |
| visitant_team | ForeignKey(Team) | Away team (CASCADE) |

### Player

| Field | Type | Description |
|-------|------|-------------|
| name | CharField(100) | Player name |
| team | ForeignKey(Team) | Associated team (CASCADE) |

### GameEvent

| Field | Type | Description |
|-------|------|-------------|
| typeEvent | CharField(50) | Event type (goal, card, etc.) |
| minute | IntegerField | Minute of occurrence |
| game | ForeignKey(gameEvents.Game) | Associated game (CASCADE) - **Note:** references `gameEvents.Game`, NOT `game.Game` |
| player | ForeignKey(Player) | Player involved (CASCADE) |

### gameEvents.Game (internal)

| Field | Type | Description |
|-------|------|-------------|
| date | DateTimeField | Game date/time |

## Model Relationships

```
Tournament (1)
    |
    +---< Team (N)
    |        |
    |        +---< Player (N)
    |        |
    |        +---< Game.local_team (N)
    |        +---< Game.visitant_team (N)
    |
    +---< Match (N)
              |
              +---< Game (N)
                       |
                       +---< GameEvent (N)  (via gameEvents.Game, NOT game.Game)
                                |
                                +---< Player (FK)
```

### Relationship Details

| From | To | Type | Notes |
|------|-----|------|-------|
| Team | Tournament | N:1 | `Team.tournament` → `Tournament` |
| Match | Tournament | N:1 | `Match.tournament` → `Tournament` |
| Player | Team | N:1 | `Player.team` → `Team` |
| Game | Match | N:1 | `Game.match` → `Match` |
| Game | Team (local) | N:1 | `Game.local_team` → `Team` |
| Game | Team (visitant) | N:1 | `Game.visitant_team` → `Team` |
| GameEvent | gameEvents.Game | N:1 | `GameEvent.game` → `gameEvents.Game` |
| GameEvent | Player | N:1 | `GameEvent.player` → `Player` |

### Known Relationship Issues

1. **Player was previously standalone** - Now correctly linked to `Team` via `Player.team` (FK, CASCADE).
2. **gameEvents.Game naming collision** - The `gameEvents` app defines its own `Game` model (with only a `date` field) that is **NOT** connected to the `game.Game` model (which has scores, teams, and match). `GameEvent` references `gameEvents.Game` instead of `game.Game`, so events are not linked to actual game fixtures.
3. **gameEvents.Game is redundant** - It only stores a `DateTimeField` and serves no real purpose beyond being a container for `GameEvent` records.

## API Endpoints

All endpoints support standard CRUD operations.

### Tournaments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tournaments/` | List all tournaments |
| POST | `/api/tournaments/` | Create tournament |
| GET | `/api/tournaments/<id>/` | Get tournament details |
| PUT/PATCH | `/api/tournaments/<id>/` | Update tournament |
| DELETE | `/api/tournaments/<id>/` | Delete tournament |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams/` | List all teams |
| POST | `/api/teams/` | Create team |
| GET | `/api/teams/<id>/` | Get team details |
| PUT/PATCH | `/api/teams/<id>/` | Update team |
| DELETE | `/api/teams/<id>/` | Delete team |

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/` | List all matches |
| POST | `/api/matches/` | Create match |
| GET | `/api/matches/<id>/` | Get match details |
| PUT/PATCH | `/api/matches/<id>/` | Update match |
| DELETE | `/api/matches/<id>/` | Delete match |

### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games/` | List all games |
| POST | `/api/games/` | Create game |
| GET | `/api/games/<id>/` | Get game details |
| PUT/PATCH | `/api/games/<id>/` | Update game |
| DELETE | `/api/games/<id>/` | Delete game |

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/` | List all players |
| POST | `/api/players/` | Create player |
| GET | `/api/players/<id>/` | Get player details |
| PUT/PATCH | `/api/players/<id>/` | Update player |
| DELETE | `/api/players/<id>/` | Delete player |

### Game Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gameevents/` | List all game events |
| POST | `/api/gameevents/` | Create game event |
| GET | `/api/gameevents/<id>/` | Get game event details |
| PUT/PATCH | `/api/gameevents/<id>/` | Update game event |
| DELETE | `/api/gameevents/<id>/` | Delete game event |

## Configuration

### CORS

- **Allowed Origins:** `http://localhost:3000`, `http://localhost:8000`
- **CSRF Trusted Origins:** `http://localhost:3000`

### Admin

Only `Tournament` and `Team` models are registered in Django admin. Access at `/admin/`.

## Known Issues

1. **Game model naming collision** - `gameEvents` app has its own `Game` model (with only a `date` DateTimeField) that is disconnected from the `game.Game` model (which has scores, teams, match, and status). Game events reference `gameEvents.Game` instead of `game.Game`.
2. **No authentication** - All endpoints are publicly accessible with no permission restrictions.
