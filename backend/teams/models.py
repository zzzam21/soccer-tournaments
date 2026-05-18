from django.db import models

from tournaments.models import Tournament

class Team(models.Model):
    name = models.CharField(max_length=255)
    tournaments = models.ManyToManyField(
        Tournament,
        related_name='teams',
        blank=True,
    )

    def __str__(self):
        return self.name