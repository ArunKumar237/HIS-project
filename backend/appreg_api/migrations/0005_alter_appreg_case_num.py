# Generated by Django 4.2.11 on 2024-09-16 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appreg_api', '0004_alter_appreg_case_num'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appreg',
            name='CASE_NUM',
            field=models.IntegerField(default=0, null=True, unique=True),
        ),
    ]
