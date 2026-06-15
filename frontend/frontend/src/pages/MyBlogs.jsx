import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch, isLoggedIn, getCurrentUser, clearTokens } from "../utils/auth";

const MyBlogs = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    authFetch(`${BASEURL}/api/my-blogs/`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your blogs");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await authFetch(`${BASEURL}/api/blogs/${id}/delete/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate("/");
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Loading your blogs...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Link to="/" className="hover:text-blue-600 transition">Latest Blogs</Link>
            </h1>
            <p className="text-gray-500 text-sm mt-1">My Dashboard</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              to="/blog/create"
              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              + Write Blog
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Welcome, {currentUser.username} — Your Blogs ({blogs.length})
        </h2>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 mb-4">You haven't written any blogs yet.</p>
            <Link
              to="/blog/create"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              Write your first blog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">

                {/* Image */}
                <img
                  src={`${BASEURL}${blog.featured_image}`}
                  alt={blog.title}
                  className="w-24 h-20 object-cover rounded-xl flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{blog.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {blog.category?.category_name} · {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                    blog.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {blog.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/single_blog/${blog.slug}`}
                    className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => navigate(`/blog/${blog.id}/edit`)}
                    className="px-3 py-1.5 text-xs bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;