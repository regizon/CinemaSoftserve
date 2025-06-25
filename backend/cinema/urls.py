from django.urls import path, include

from cinema.admin_api.views import AdminMovieViewset
from cinema.public_api.views import PublicMovieViewset, PublicUserBooking, RegisterView, IndexView
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = routers.SimpleRouter()
router.register(r'public/movies', PublicMovieViewset,basename='public')
router.register(r'admin/movies', AdminMovieViewset, basename='admin')
urlpatterns = [
    path('index/', IndexView.as_view()),
    path('api/v1/', include(router.urls)),
    path('api/v1/bookings', PublicUserBooking.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
# urlpatterns = [
#     path('api/v1/movies', PublicMovieApiView.as_view()),
#     path('api/v1/movies/<int:pk>/', PublicMovieDetailsApiView.as_view()),
#     path('api/v1/bookings', PublicUserBooking.as_view()),
# ]