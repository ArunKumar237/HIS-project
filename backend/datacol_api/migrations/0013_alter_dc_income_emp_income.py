# Generated by Django 4.2.11 on 2024-09-25 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datacol_api', '0012_alter_dc_cases_app_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dc_income',
            name='EMP_INCOME',
            field=models.IntegerField(),
        ),
    ]
