import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../utils/auth";


function Navbar() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();


  const [navCategories, setNavCategories] = useState([]);


  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${BASEURL}/api/categories/`);
        if (!response.ok) throw new Error("Failed to load categories");

        const data = await response.json();

        const formatted = data.map((cat) => ({
          id: cat.id,
          name: cat.category_name,
        }));

        setNavCategories(formatted);
      } catch (error) {
        console.warn(error);
      }
    }

    loadCategories();
  }, [BASEURL]);

  const activeCategoryId = useMemo(() => {
    const match = location.pathname.match(/^\/category\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
  }, [location.pathname]);


  const isLoggedIn = !!getAccessToken();
  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-center gap-4 overflow-x-auto">
      <Link to="/" className="text-gray-700 hover:text-blue-600">
        Home
      </Link>

      {navCategories.map((cat) => {
        const isActive = activeCategoryId === cat.id;

        return (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className={`transition ${
              isActive
                ? "font-semibold text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navbar;