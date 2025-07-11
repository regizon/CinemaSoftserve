from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


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
    phone_number = models.CharField(max_length=13, default="", blank=True)
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
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=120)
    original_title = models.CharField(max_length=120)
    slogan = models.CharField(max_length=200)
    description = models.TextField()
    country = models.TextField(     
        default='США',
        max_length=30
    )
    year = models.PositiveIntegerField()
    age_rate = models.PositiveIntegerField(default=0)
    language = models.CharField(max_length=10)
    duration_minutes = models.PositiveIntegerField()
    img_url = models.URLField(max_length=200)
    poster_url = models.URLField(max_length=200, null=True, blank=True)
    trailer_url = models.URLField(max_length=300)
    is_active = models.BooleanField(default=True)
    active_until = models.DateTimeField(null=True, blank=True)

    genres = models.ManyToManyField(Genre, through='MovieGenre')
    actors = models.ManyToManyField(Actor, through='MovieActor')
    directors = models.ManyToManyField(Director, through='MovieDirector')

    def __str__(self):
        return self.title

class MovieActor(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    actor = models.ForeignKey(Actor, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'actor')

class MovieGenre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'genre')


class MovieDirector(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    director = models.ForeignKey(Director, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'director')


class Hall(models.Model):
    hall_number = models.PositiveIntegerField(unique=True)
    capacity = models.PositiveIntegerField()
    vip_rows = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="Список номеров VIP рядов через запятую, например: 1,2,5"
    )

    def get_vip_rows_list(self):
        if self.vip_rows:
            return [int(r.strip()) for r in self.vip_rows.split(',') if r.strip().isdigit()]
        return []

    def __str__(self):
        return f'Hall {self.hall_number}'


class Session(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    expire_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    vip_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True) 

    def __str__(self):
        return f'{self.movie.title} at {self.start_time}'


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)
    row = models.PositiveIntegerField()
    seat_number = models.CharField(max_length=100)
    status    = models.CharField(
        max_length=2,
        choices=StatusChoices.choices,
        default=StatusChoices.BOOKED
    )

    def is_vip(self):
        return self.session.hall.is_vip_row(self.row)

    def __str__(self):
        return f'Booking #{self.id} - {self.user.username} - Seat {self.seat_number}'
