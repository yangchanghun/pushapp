from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professors', '0003_alter_professors_location_gif'),
    ]

    operations = [
        migrations.CreateModel(
            name='LocationImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('image', models.ImageField(upload_to='location_images/')),
            ],
        ),
    ]
