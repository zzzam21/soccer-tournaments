from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError


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
