import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isLoggedIn, authFetch } from '../utils/auth';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const BlogCard = ({ blog, onDelete }) => {
  const currentUser = getCurrentUser();
  const isAuthor = isLoggedIn() && currentUser.id === blog.author?.id;
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await authFetch(`${BASEURL}/api/blogs/${blog.id}/delete/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onDelete(blog.id); // remove from list instantly
      } else {
        alert('Failed to delete blog');
      }
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden'>

      {/* Image */}
      <img
        src={`${BASEURL}${blog.featured_image}`}
        alt={blog.title}
        className='w-full h-48 object-cover'
      />

      {/* Content */}
      <div className='p-4'>

        {/* Title */}
        <h2 className='text-lg font-bold text-gray-900 flex-wrap'>
          {blog.title}
        </h2>

        {/* Category + Date */}
        <div className='flex justify-between items-center text-xs text-gray-500 mt-1 mb-2'>
          <span className='bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>
            {blog.category?.category_name}
          </span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>

        {/* Short description */}
        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
          {blog.short_description}
        </p>

        {/* Author */}
        <p className='text-xs text-gray-400 mb-3'>
          By {blog.author?.username}
        </p>

        {/* Read More */}
        <Link to={`/single_blog/${blog.slug}`}>
          <button className='mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
            Read More
          </button>
        </Link>

        {/* Edit / Delete — only for author */}
        {isAuthor && (
          <div className='flex gap-2 mt-2'>
            <button
              onClick={() => navigate(`/blog/${blog.id}/edit`)}
              className='flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition text-sm'
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm'
            >
              Delete
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default BlogCard