

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status (e.g., token or userId in localStorage)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // If token exists, user is authenticated
  }, []);

  const handleExploreBooks = () => {
    navigate("/books");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />
      {/* Hero Section */}
      <header className="bg-gray-100">
        <div className="w-[95%] mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              Discover, Manage, and{" "}
              <span className="text-blue-600">Transform Your Library!</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Streamline book tracking, user memberships, and club activities in
              one seamless platform. Empower your library for the digital age.
            </p>
            <div className="mt-6 space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={handleExploreBooks}
                  className="bg-blue-600 text-white px-6 py-3 rounded text-lg shadow hover:bg-blue-700"
                >
                  Explore Books
                </button>
              ) : (
                <a
                  href="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded text-lg shadow hover:bg-blue-700"
                >
                  Try It Free
                </a>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://img.freepik.com/free-vector/online-library-concept-with-reading-people-electronic-devices-book-shelves-3d-isometric_1284-31703.jpg"
              alt="Laptop with Books"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>
      <Footer />
    </div>
  );
};

export default HomePage;
