from django.db import models

from tournaments.models import Tournament

class Team(models.Model):
    name = models.CharField(max_length=255)
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name='teams'
    )

    def __str__(self):
        return self.name