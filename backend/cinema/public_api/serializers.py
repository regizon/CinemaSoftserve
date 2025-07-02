from rest_framework import serializers

from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices, Hall, Director, Actor
from django.contrib.auth.hashers import make_password


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    genres = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='genre_name'
    )

    class Meta:
        model = Movie
        fields = '__all__'
        read_only_fields = ['uuid']

class BookingSerializer(serializers.ModelSerializer):
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

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)