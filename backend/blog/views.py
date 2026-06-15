from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Blog, Category
from .serializers import BlogSerializer,CategorySerializer, RegisterSerializer, UserSerializer
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login,logout
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

@api_view(['GET'])
def blog_detail_by_id(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    serializer = BlogSerializer(blog)
    return Response(serializer.data)

@api_view(['GET'])
def get_blog(request):
    search = request.query_params.get('search', None)

    posts = Blog.objects.filter(status='Published')

    if search:
        posts = posts.filter(title__icontains=search)

    posts = posts.order_by('-updated_at')

    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def blogs(request, slug):
    single_blog = get_object_or_404(
        Blog,
        slug=slug,
        status='Published'
    )

    serializer = BlogSerializer(single_blog)

    return Response(serializer.data)

@api_view(['GET'])
def posts_by_category(request, category_id):
    posts = Blog.objects.filter(category__id=category_id, status='Published')
    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"MESSAGE":"user created successfully","user":UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_blog(request):
    serializer = BlogSerializer(data=request.data, context={'request':request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def update_blog(request,pk):
    blog = get_object_or_404(Blog,pk=pk)

    if blog.author != request.user:
        return Response({'error': 'You are not the author of this blog'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = BlogSerializer(blog, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_blog(request, pk):
    blog = get_object_or_404(Blog, pk=pk)

    if blog.author != request.user:
        return Response({'error': 'You are not the author of this blog'}, status=status.HTTP_403_FORBIDDEN)

    blog.delete()
    return Response({'message': 'Blog deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_blogs(request):
    posts = Blog.objects.filter(author=request.user).order_by('-updated_at')
    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        






