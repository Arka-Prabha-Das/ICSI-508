import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status (e.g., token in localStorage)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
        <img src="./logo.webp" height="50" width="50"></img>
        <Link to="/" className="text-2xl font-bold text-blue-600 ml-2">
          BookNest
        </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/books"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Books
          </Link>
          <Link
            to="/clubs"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Clubs
          </Link>
          <Link
            to="/payments"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Payments
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
            />
          </svg>
        </button>

        {/* Sign In / Logout Button */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/books"
              className="block text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              to="/clubs"
              className="block text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubs
            </Link>
            <Link
              to="/payments"
              className="block text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Payments
            </Link>
            <Link
              to="/profile"
              className="block text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
