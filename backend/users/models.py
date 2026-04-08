from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)

    def add_xp(self, amount):
        self.xp += amount
        if self.xp >= self.level * 100:
            self.level += 1
            while self.xp >= self.level * 100:
                self.level += 1
        self.save()

    def __str__(self):
        return f"Profile of {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
