import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
django.setup()

import logging
from django.core.cache import cache

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def main():
    try:
        cache.clear()
        logger.info('Cache cleared successfully')
    except Exception as e:
        logger.warning('Cache not available or not configured: %s', e)


if __name__ == '__main__':
    main()
