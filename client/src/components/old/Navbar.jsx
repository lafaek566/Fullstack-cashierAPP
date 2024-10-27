// Navbar.js
import React from "react";

const Navbar = ({ isLogin, onSwitchToLogin, onSwitchToRegister }) => {
  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div>
        <button
          className={`px-4 py-2 ${
            isLogin ? "bg-gray-600" : "bg-gray-800"
          } rounded`}
          onClick={onSwitchToLogin}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
