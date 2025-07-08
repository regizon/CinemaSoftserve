from rest_framework import serializers

from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices, Hall, Director, Actor, MovieDirector, \
    MovieActor, MovieGenre
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from cinema.mixins.movie_relation_mixin import MovieRelationMixin



class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class BaseMovieSerializer(serializers.ModelSerializer):
    genres = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )
    genres_read = serializers.SerializerMethodField()

    actors = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    actors_read = serializers.SerializerMethodField()

    directors = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    directors_read = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'
        read_only_fields = ['uuid']

    def get_genres_read(self, obj):
        return [genre.genre_name for genre in obj.genres.all()]

    def get_actors_read(self, obj):
        return [actor.actor_name for actor in obj.actors.all()]

    def get_directors_read(self, obj):
        return [director.director_name for director in obj.directors.all()]


class ManualMovieSerializer(BaseMovieSerializer, MovieRelationMixin):
    def create(self, validated_data):
        actors = validated_data.pop("actors", [])
        directors = validated_data.pop("directors", [])
        genres = validated_data.pop("genres", [])

        if not validated_data.get('active_until'):
            validated_data['active_until'] = timezone.now() + timedelta(days=14)

        movie = super().create(validated_data)
        self._assign_relations(movie, actors, directors, genres, create_if_missing=False)
        return movie

class ParserMovieSerializer(BaseMovieSerializer, MovieRelationMixin):
    def create(self, validated_data):
        actors = validated_data.pop("actors", [])
        directors = validated_data.pop("directors", [])
        genres = validated_data.pop("genres", [])

        if not validated_data.get('active_until'):
            validated_data['active_until'] = timezone.now() + timedelta(days=14)

        movie = super().create(validated_data)
        self._assign_relations(movie, actors, directors, genres, create_if_missing=True)
        return movie

class CustomPrimaryKeyRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError:
            raise serializers.ValidationError("Сеанс не знайдено", code="session_not_found")


class BookingSerializer(serializers.ModelSerializer):
    session = CustomPrimaryKeyRelatedField(queryset=Session.objects.all())
    movie_title = serializers.CharField(source='session.movie.title', read_only=True)
    session_time = serializers.DateTimeField(source='session.start_time', read_only=True)
    ticket_price = serializers.SerializerMethodField()


    class Meta:
        model = Booking
        fields = ['id', 'session', 'session_time', 'movie_title', 'status', 'row', 'seat_number','ticket_price']
        read_only_fields = ['id', 'movie_title', 'session_time', 'status','ticket_price']

    def validate(self, data):
      session = data.get('session')
      row = data.get('row')
      seat = data.get('seat_number')

      if row is None:
          raise serializers.ValidationError({'row': 'Потрібно вказати ряд'})
      if not seat:
          raise serializers.ValidationError({'seat_number': 'Потрібно вказати місце'})

      if Booking.objects.filter(session=session, row=row, seat_number=seat, status=StatusChoices.BOOKED).exists():
          raise serializers.ValidationError({'seat_number': 'Це місце вже зайняте'})

      booked_count = Booking.objects.filter(session=session, status=StatusChoices.BOOKED).count()
      if booked_count >= session.hall.capacity:
          raise serializers.ValidationError("На обраний сеанс немає вільних місць")

      return data

    
    def get_ticket_price(self, obj):
        vip_rows = obj.session.hall.get_vip_rows_list()
        if obj.row in vip_rows:
            return obj.session.vip_price if obj.session.vip_price > 0 else obj.session.price
        return obj.session.price



class BookingCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id']
        read_only_fields = ['id']


class SessionSerializer(serializers.ModelSerializer):
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = '__all__'

    def get_available_seats(self, obj):
        total = obj.hall.capacity
        booked = Booking.objects.filter(session=obj, status=StatusChoices.BOOKED).count()
        return total - booked


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = '__all__'

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username','first_name', 'last_name', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувач з таким email вже існує")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        user.is_active = False
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'phone_number')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role 
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role 
        return data