from django.db import models

class Professors(models.Model):
    name = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    location_gif = models.ImageField(upload_to='professors/', blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self):
        return self.name
    


# class Location_Images(models.Model):
#     name = models.CharField(max_length=100)
#     image = models.ImageField(upload_to='professors/location_images/')

#     def __str__(self):
#         return self.name

# class Professors(models.Model):
#     name = models.CharField(max_length=100)
#     phonenumber = models.CharField(max_length=20)
#     location = models.CharField(max_length=100)

#     location_image = models.ForeignKey(
#         Location_Images,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='professors'
#     )

#     def __str__(self):
#         return self.name