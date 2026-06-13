import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";


const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;


  useEffect(() => {
    fetch(`${BASEURL}/api/blogs/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to fetch blogs");
        }
        return response.json();
      })
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading blogs...
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-600 font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Link to="/" className="hover:text-blue-600 transition">
                Latest Blogs
              </Link>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Explore insights, technology, and ideas
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
            >
              Login
            </a>

            <a
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </a>
          </div>
        </div>
      </div>


      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
