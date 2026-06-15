import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCurrentUser, isLoggedIn, authFetch, clearTokens } from "../utils/auth";

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAuthor = isLoggedIn() && blog?.author?.id === currentUser.id;
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BASEURL}/api/blogs/${slug}/`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await authFetch(`${BASEURL}/api/blogs/${blog.id}/delete/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        navigate('/');
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Something went wrong');
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate("/");
    window.location.reload();
  };

  if (!blog) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-gray-500 text-lg animate-pulse">Loading article...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Link to="/" className="hover:text-blue-600 transition">Latest Blogs</Link>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Explore insights, technology, and ideas</p>
          </div>
          <div className="flex gap-3">
            {loggedIn ? (
              <>
                <Link to="/blog/create" className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  + Write Blog
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition">Login</a>
                <a href="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Register</a>
              </>
            )}
          </div>
        </div>
      </div>

      <Navbar />

      {/* Article */}
      <div className="max-w-3xl mx-auto px-6 py-10">

        {blog.category && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {blog.category.category_name}
          </span>
        )}

        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{blog.title}</h1>

        <p className="text-sm text-gray-400 mb-2">By {blog.author?.username}</p>

        <p className="text-lg text-gray-500 mb-6 leading-relaxed">{blog.short_description}</p>

        {blog.featured_image && (
          <img
            src={`${BASEURL}${blog.featured_image}`}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-2xl mb-8 shadow-md"
          />
        )}

        <hr className="border-gray-200 mb-8" />

        <div className="text-gray-800 text-base leading-8 whitespace-pre-line">
          {blog.blog_body}
        </div>

        {/* Edit / Delete — only for author */}
        {isAuthor && (
          <div className="flex gap-3 mt-10">
            <button
              onClick={() => navigate(`/blog/${blog.id}/edit`)}
              className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
            >
              Edit Blog
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete Blog
            </button>
          </div>
        )}

        <div className="mt-12">
          <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">← Back to all blogs</Link>
        </div>

      </div>
    </div>
  );
};

export default SingleBlog;