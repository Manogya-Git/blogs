import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch, isLoggedIn } from "../utils/auth";

const CreateBlog = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    blog_body: "",
    status: "Published",
    category_id: "",
  });
  const [image, setImage] = useState(null);

  // redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, []);

  // fetch categories for dropdown
  useEffect(() => {
    fetch(`${BASEURL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // use FormData because we have a file
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("short_description", form.short_description);
    formData.append("blog_body", form.blog_body);
    formData.append("status", form.status);
    formData.append("category_id", form.category_id);
    if (image) formData.append("featured_image", image);

    try {
      const res = await authFetch(`${BASEURL}/api/blogs/create/`, {
        method: "POST",
        body: formData,
        // don't set Content-Type, browser sets it automatically for FormData
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/single_blog/${data.slug}`); // go to the new blog
      } else {
        setError(JSON.stringify(data));
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            <Link to="/" className="hover:text-blue-600 transition">Latest Blogs</Link>
          </h1>
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition">
            ← Back to blogs
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a New Blog</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter blog title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Brief summary of your blog"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
            <textarea
              name="blog_body"
              value={form.blog_body}
              onChange={handleChange}
              required
              rows={8}
              placeholder="Write your blog here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="w-full text-sm text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlog;