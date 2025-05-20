import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
      <div className="text-4xl font-script text-[#2e82ff] font-bold cursor-default select-none cursor-pointer">
        WeddingVenue
      </div>
      <button
        onClick={() => navigate('/login')}
        className="px-5 py-2 bg-[#2e82ff] text-white rounded-md hover:bg-[#4c9eff] transition cursor-pointer"
      >
        Kirish
      </button>
    </header>
  );
}

export default Header;
