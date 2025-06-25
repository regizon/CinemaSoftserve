from django.contrib.auth.models import AbstractUser
from django.db import models


class RoleChoices(models.TextChoices):
    ADMIN       = 'AD', 'Admin'
    USER        = 'US', 'User'

class StatusChoices(models.TextChoices):
    BOOKED     = 'BK', 'Booked'
    CONFIRMED   = 'CO', 'Confirmed'
    CANCELLED   = 'CA', 'Cancelled'


class User(AbstractUser):
    role = models.CharField(
        max_length=2,
        choices=RoleChoices.choices,
        default=RoleChoices.USER
    )

    def __str__(self):
        return self.username


class Genre(models.Model):
    genre_name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.genre_name

class Actor(models.Model):
    actor_name = models.CharField(max_length=70, unique=True)

    def __str__(self):
        return self.actor_name


class Director(models.Model):
    director_name = models.CharField(max_length=70, unique=True)

    def __str__(self):
        return self.director_name

class Movie(models.Model):
    title = models.CharField(max_length=120)
    original_title = models.CharField(max_length=120)
    slogan = models.CharField(max_length=200)
    description = models.TextField()
    year = models.PositiveIntegerField()
    age_rate = models.PositiveIntegerField(default=0)
    language = models.CharField(max_length=10)
    duration_minutes = models.PositiveIntegerField()
    img_url = models.URLField(max_length=200)
    trailer_url = models.URLField(max_length=300)
    is_active = models.BooleanField(default=True)

    genres = models.ManyToManyField(Genre, through='MovieGenre')
    actors = models.ManyToManyField(Actor, through='MovieActor')
    directors = models.ManyToManyField(Director, through='MovieDirector')

    def __str__(self):
        return self.title

class MovieActor(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
    actor = models.ForeignKey(Actor, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'actor')

class MovieGenre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
    genre = models.ForeignKey(Genre, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'genre')


class MovieDirector(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
    director = models.ForeignKey(Director, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'director')


class Hall(models.Model):
    hall_number = models.PositiveIntegerField(unique=True)
    capacity = models.PositiveIntegerField()

    def __str__(self):
        return f'Hall {self.hall_number}'


class Session(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    expire_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f'{self.movie.title} at {self.start_time}'


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)
    status    = models.CharField(
        max_length=2,
        choices=StatusChoices.choices,
        default=StatusChoices.BOOKED
    )

    def __str__(self):
        return f'Booking #{self.id} - {self.user.username}'
