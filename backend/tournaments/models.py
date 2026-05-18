from django.db import models

# Create your models here.
class Tournament(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    
    def __str__(self):
        return self.name

