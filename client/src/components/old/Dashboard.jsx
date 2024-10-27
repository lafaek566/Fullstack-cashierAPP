import React, { useState } from "react";
import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import images from "../assets/images/tea.png";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setIsRegisterVisible(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterVisible(true);
    setIsLoginVisible(false);
  };

  const imageSources = [images];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar
        isLogin={isLoginVisible}
        onSwitchToLogin={handleLoginClick}
        onSwitchToRegister={handleRegisterClick}
      />

      {isLoginVisible && <Login onSwitchToRegister={handleRegisterClick} />}
      {isRegisterVisible && <Register onSwitchToLogin={handleLoginClick} />}

      <div className="p-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mt-4">
          Welcome to Neo Drink's
        </h1>
      </div>

      <motion.div className="grid gap-8 p-4 sm:grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
        <div className="flex flex-col items-start sm:items-center text-center md:text-left px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-snug">
            AxeL Brand new{" "}
            <span className="text-primary font-bold">Furniture</span> Mobile App
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-700 max-w-lg">
            Giving your home a proper makeover has never been this easy. Modern
            and stylish furniture for affordable prices. Explore our range with
            a click.
          </p>
        </div>

        <motion.div className="flex items-center justify-center p-4">
          {imageSources.map((src, index) => (
            <motion.img
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={index}
              className="w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-cover rounded-xl shadow-lg"
              src={src}
              alt={`header-phone-${index}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
