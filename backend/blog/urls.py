from django.urls import path
from . import views

urlpatterns = [
    path('blogs/', views.get_blog),
    path('category/<int:category_id>/', views.posts_by_category),
    path('blogs/<slug:slug>/', views.blogs),
    path('categories/', views.get_categories),
]