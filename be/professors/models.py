from django.db import models

class Professors(models.Model):
    name = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    location_gif = models.ImageField(upload_to='professors/', blank=True, null=True)

    def __str__(self):
        return self.name