from django.db import models
from tournaments.models import Tournament

# Create your models here.
class Match(models.Model):
    number=models.IntegerField()
    start_date=models.DateField()
    tournament=models.ForeignKey(Tournament,on_delete=models.CASCADE) 
    
    def __str__(self):
        return f"Match {self.number} starting on {self.start_date}"
