# Generated by Django 4.2.11 on 2024-09-23 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibledet_api', '0003_alter_eligibilitydetermination_case_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='eligibilitydetermination',
            name='MAIL_SENT',
            field=models.BooleanField(default=False),
        ),
    ]
