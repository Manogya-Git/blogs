import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import { isLoggedIn, clearTokens } from "../utils/auth";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASEURL}/api/blogs/?search=${search}`)
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
  }, [search]);

  const handleDelete = (deletedId) => {
    setBlogs((prev) => prev.filter((b) => b.id !== deletedId));
  };

  const handleLogout = () => {
    clearTokens();
    navigate("/");
    window.location.reload();
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Link to="/" onClick={() => { setSearch(""); setSearchInput(""); }} className="hover:text-blue-600 transition">
                Latest Blogs
              </Link>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Explore insights, technology, and ideas</p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setSearch(searchInput)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3 items-center">
            {loggedIn ? (
              <>
                <Link
                  to="/blog/create"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  + Write Blog
                </Link>
                <Link
                  to="/my-blogs"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  My Blogs
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      <Navbar />

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BlogList;