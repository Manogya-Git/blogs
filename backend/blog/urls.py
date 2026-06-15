from django.urls import path
from django.urls import include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('blogs/', views.get_blog),
    path('blogs/create/', views.create_blog),
    path('category/<int:category_id>/', views.posts_by_category),
    path('blogs/<slug:slug>/', views.blogs),
    path('categories/', views.get_categories),
    path('register/',views.register_view),
    path('token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('blogs/<int:pk>/edit/', views.update_blog),
    path('blogs/<int:pk>/delete/', views.delete_blog),
    path('my-blogs/', views.my_blogs),
    path('categories/create/', views.create_category),
    path('blogs/<int:pk>/detail/', views.blog_detail_by_id),
]