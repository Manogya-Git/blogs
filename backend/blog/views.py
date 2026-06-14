from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Blog, Category
from .serializers import BlogSerializer,CategorySerializer
from django.http import HttpResponse



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


