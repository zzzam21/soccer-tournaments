from django.db import models

from teams.models import Team

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players',  default=None)

    def __str__(self):
        return self.name
    