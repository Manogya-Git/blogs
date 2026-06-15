from rest_framework import serializers
from .models import Blog, Category
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class BlogSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)          
    category_id = serializers.PrimaryKeyRelatedField(     
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    author = UserSerializer(read_only=True)                

    class Meta:
        model = Blog
        fields = '__all__'

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method == 'PATCH':
            fields['category_id'].required = False
        return fields





class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Password do not match')
        return data

    def create(self, validate_data):
        username = validate_data['username']
        email = validate_data.get('email', '')
        password = validate_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)
        return user