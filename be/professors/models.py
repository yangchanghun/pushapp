from django.db import models

class Professors(models.Model):
    name = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    location_gif = models.CharField(max_length=255, blank=True, null=True)  # 사진 X

    def __str__(self):
        return self.name