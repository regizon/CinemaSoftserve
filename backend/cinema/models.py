from django.db import models

class Role(models.Model):
    role_name = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.role_name


class User(models.Model):
    user_name = models.CharField(max_length=12)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)

    def __str__(self):
        return self.user_name


class Genre(models.Model):
    genre_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.genre_name


class Movie(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField()
    img_url = models.URLField(max_length=200)
    is_active = models.BooleanField(default=True)
    genres = models.ManyToManyField(Genre, through='MovieGenre')

    def __str__(self):
        return self.title


class MovieGenre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
    genre = models.ForeignKey(Genre, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('movie', 'genre')


class Hall(models.Model):
    hall_number = models.PositiveIntegerField(unique=True)
    capacity = models.PositiveIntegerField()

    def __str__(self):
        return f'Hall {self.hall_number}'


class Session(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=0)

    def __str__(self):
        return f'{self.movie.title} at {self.start_time}'


class Status(models.Model):
    status = models.CharField(max_length=8)

    def __str__(self):
        return self.status


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)

    def __str__(self):
        return f'Booking #{self.id} - {self.user.user_name}'
