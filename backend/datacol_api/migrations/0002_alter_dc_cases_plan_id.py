# Generated by Django 4.2.11 on 2024-09-16 14:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin_api', '0005_alter_plancategory_created_by_and_more'),
        ('datacol_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dc_cases',
            name='PLAN_ID',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='admin_api.planmaster'),
        ),
    ]
