import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";

const BlogsByCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

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

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/?search=${searchInput}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-lg font-medium text-gray-600 animate-pulse">Loading blogs...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-red-600 font-semibold">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      {/* Header */}
<div className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 items-center">

    {/* Left — Title */}
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

    {/* Center — Search */}
    <div className="flex items-center justify-center gap-2">
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>

    {/* Right — Auth */}
    <div className="flex items-center justify-end gap-3">
      <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition">
        Login
      </a>
      <a href="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Register
      </a>
    </div>

  </div>
</div>
      <Navbar />

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No blogs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogsByCategory;