import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-bold text-[#2e82ff] cursor-pointer select-none"
      >
        WeddingVenue
      </Link>

      {/* Navigatsiya */}
      <nav className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-[#2e82ff] transition font-medium"
        >
          🏛 Home
        </Link>
        <Link
          to="/venue"
          className="text-gray-700 hover:text-[#2e82ff] transition font-medium"
        >
          📋 To‘yxonalar
        </Link>
        <Link
          to="/user-bookings"
          className="text-gray-700 hover:text-[#2e82ff] transition font-medium"
        >
        </Link>

        {/* Kirish tugmasi */}
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-[#2e82ff] text-white rounded-md hover:bg-[#4c9eff] transition"
        >
          Kirish
        </button>
      </nav>
    </header>
  );
}

export default Header;