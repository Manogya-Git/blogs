import React from 'react'
import { Link } from 'react-router-dom';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const BlogCard = ({ blog }) => {
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

          <span>
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Short description */}
        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
          {blog.short_description}
        </p>

        {/* Button */}
        <Link to={`/single_blog/${blog.slug}`}>  
        <button className='mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
          Read More
        </button>
        </Link>

      </div>
    </div>
  )
}

export default BlogCard