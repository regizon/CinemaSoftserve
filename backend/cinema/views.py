from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.

def index(request):
    return render(request, 'main/index.html')

def movie_page(request):
    return HttpResponse("Сторінка для фільма")

def admin_panel(request):
    return HttpResponse("Сторінка для адмін панелі")