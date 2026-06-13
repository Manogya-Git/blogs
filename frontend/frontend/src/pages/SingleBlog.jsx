import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

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

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {blog.title}
      </h1>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-2">
        Category: {blog.category?.category_name}
      </p>

      {/* Image */}
      {blog.featured_image && (
        <img
          src={`${BASEURL}${blog.featured_image}`}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Short description */}
      <p className="text-gray-700 mb-4">
        {blog.short_description}
      </p>

      {/* Blog content */}
      <div className="text-gray-900 leading-relaxed">
        {blog.blog_body}
      </div>

    </div>
  );
};

export default SingleBlog;