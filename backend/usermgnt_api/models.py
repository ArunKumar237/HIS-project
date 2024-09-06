from django.db import models

# Create your models here.
class user_data(models.Model):
    ssn = models.CharField(max_length=9,unique=True)
    state = models.CharField(max_length=255)
    class Meta:
        verbose_name = 'user_data'
        verbose_name_plural = 'user_data'