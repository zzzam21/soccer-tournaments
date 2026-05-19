from django.template.defaultfilters import date
from django.db import models
from match.models import Match
from teams.models import Team

# Create your models here.
class Game(models.Model):
    local_goals = models.IntegerField()
    visitant_goals = models.IntegerField()
    status = models.CharField(max_length=20)
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    local_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='local_games')
    visitant_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='visitant_games')
    
    def __str__(self):
        return f"{self.local_goals} - {self.visitant_goals} ({self.status}) on {date(self.date, 'Y-m-d')}"