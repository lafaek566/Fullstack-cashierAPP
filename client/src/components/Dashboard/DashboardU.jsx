import React, { useState } from "react";
import Image from "../../assets/images/tea.png";
import Images from "../../assets/images/boba.png";
import Navbar from "../Navbar/NavbarU";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import "./Dashboard.css"; // Import CSS

const DashboardU = ({ topRef }) => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setIsRegisterVisible(false);
  };

  const handleRegisterClick = () => {
    setIsLoginVisible(false);
    setIsRegisterVisible(true);
  };

  const hideForms = () => {
    setIsLoginVisible(false);
    setIsRegisterVisible(false);
  };

  return (
    <div>
      <Navbar
        onSwitchToLogin={handleLoginClick}
        onSwitchToRegister={handleRegisterClick}
      />

      <div ref={topRef} className="dashboard-container">
        {/* Dashboard content area */}
        <div className="dashboard-content">
          {/* Show Login or Register form if either is visible */}
          {(isLoginVisible || isRegisterVisible) && (
            <div className="w-full max-w-md mb-8">
              {isLoginVisible && (
                <div>
                  <Login onSwitchToRegister={handleRegisterClick} />
                  <button
                    onClick={hideForms}
                    className="mt-4 w-full py-2 bg-gray-300 text-black rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
              {isRegisterVisible && (
                <div>
                  <Register onSwitchToLogin={handleLoginClick} />
                  <button
                    onClick={hideForms}
                    className="mt-4 w-full py-2 bg-gray-300 text-black rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Flex Container for Text and Image */}
          <div className="flex flex-col sm:flex-row w-full items-center justify-between">
            {/* Text Section */}
            <div className="text-content sm:w-1/2 text-center sm:text-left pr-4">
              <h1>Héllo</h1>
              <p className="sm:text-lg text-2xl text-center max-w-lg mx-auto">
                Take your drink's, sweet magic in every drop.
              </p>
            </div>
            {/* Image Section */}
            <div className="image-content sm:w-1/2 mt-8 sm:mt-1">
              <div>
                <img
                  className="dashboard-image" // Use CSS class
                  src={Image}
                  alt="header-phone"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardU;
