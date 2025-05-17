import React from 'react'
// src/components/common/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} To‘yxona Bronlash Platformasi. Barcha huquqlar himoyalangan.</p>
      <div className="mt-2">
        <a href="/about" className="text-blue-300 hover:underline mx-2">Biz haqimizda</a>
        <a href="/contact" className="text-blue-300 hover:underline mx-2">Aloqa</a>
      </div>
    </footer>
  );
};

export default Footer;