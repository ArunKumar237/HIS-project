# Generated by Django 4.2.11 on 2024-09-23 10:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('appreg_api', '0009_alter_appreg_email'),
        ('eligibledet_api', '0004_eligibilitydetermination_mail_sent'),
    ]

    operations = [
        migrations.AddField(
            model_name='eligibilitydetermination',
            name='EMAIL',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='appreg_api.appreg', to_field='EMAIL'),
        ),
    ]
