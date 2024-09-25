from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AppReg
from eligibledet_api.models import eligibilityDetermination

@receiver(post_save, sender=AppReg)
def update_child_models(sender, instance, **kwargs):
    # Update all related child models
    child_objects = eligibilityDetermination.objects.filter(EMAIL=instance)
    
    # Update the child model field with the parent's new EMAIL value
    for child in child_objects:
        child.EMAIL = instance  # Set the child EMAIL to the parent instance
        child.save()
