# Generated by Django 4.2.11 on 2024-09-19 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appreg_api', '0005_alter_appreg_case_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='appreg',
            name='AGE',
            field=models.IntegerField(null=True),
        ),
    ]
