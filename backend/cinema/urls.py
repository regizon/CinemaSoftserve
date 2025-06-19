from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('movie/', views.movie_page, name='movie'),
    path('admin_panel/', views.admin_panel, name='admin_panel')
]