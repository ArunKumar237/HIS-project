# Generated by Django 4.2.11 on 2024-09-23 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appreg_api', '0008_rename_age_appreg_dob'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appreg',
            name='EMAIL',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
