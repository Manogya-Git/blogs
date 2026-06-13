import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";

const BlogsByCategory = () => {
  const { id } = useParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    setLoading(true);

    fetch(`${BASEURL}/api/category/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Latest Blogs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Explore insights, technology, and ideas
            </p>
          </div>

          <div className="flex gap-3">
            <a href="/login" className="px-4 py-2 text-sm text-gray-700">
              Login
            </a>

            <a
              href="/register"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
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

export default BlogsByCategory;