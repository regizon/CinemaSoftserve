from django.urls import path, include

from cinema.admin_api.views import AdminMovieViewset, AdminSessionViewset, AdminBookingViewset, AdminHallViewset, AdminActorViewset, AdminDirectorViewset, FindFilm, AdminActorViewset, AdminDirectorViewset
from cinema.public_api.views import AllEntitiesView, ConfirmEmailView, CustomTokenObtainPairView, PublicMovieViewset, PublicUserBooking, RegisterView, PublicSessionViewset,PublicActorViewSet, CancelBookingView, CheckProfile, ActorInfoView
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = routers.SimpleRouter()
router.register(r'public/movies', PublicMovieViewset,basename='public')
router.register(r'admin/movies', AdminMovieViewset, basename='admin')
router.register(r'public/sessions', PublicSessionViewset)
router.register(r'public/actors', PublicActorViewSet, basename='public-actors')
router.register(r'admin/sessions', AdminSessionViewset, basename='admin_sessions')
router.register(r'admin/bookings', AdminBookingViewset)
router.register(r'admin/halls', AdminHallViewset)
router.register(r'admin/actors', AdminActorViewset)
router.register(r'admin/directors', AdminDirectorViewset)
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/bookings/', PublicUserBooking.as_view(), name="get_bookings"),
    path('api/v1/bookings/<int:pk>/cancel/', CancelBookingView.as_view(), name="cancel_booking"),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/v1/confirm-email/<str:uidb64>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/profile/', CheckProfile.as_view(), name='profile'),
    path('api/v1/public/get_movie/', FindFilm.as_view(), name='parse_movie'),
    path('api/v1/public/sessions/<int:movie_id>', MovieSessions.as_view(), name='get_movie_sessions'),
    path('api/v1/confirm-email/<str:uidb64>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('api/v1/public/all-entities/', AllEntitiesView.as_view()),
    path("api/v1/public/actors/<int:pk>/info/", ActorInfoView.as_view()),
]
