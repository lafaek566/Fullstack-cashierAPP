import React, { useState } from "react"; // Removed useContext
import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import images from "../assets/images/tea.png";
import images2 from "../assets/images/tea.png";
import images3 from "../assets/images/tea.png";
import images4 from "../assets/images/tea.png";

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

  const imageSources = [images, images2, images3, images4];

  return (
    <div>
      <Navbar
        isLogin={isLoginVisible}
        onSwitchToLogin={handleLoginClick}
        onSwitchToRegister={handleRegisterClick}
      />
      {/* Render Login and Register forms based on visibility state */}
      {isLoginVisible && <Login onSwitchToRegister={handleRegisterClick} />}
      {isRegisterVisible && <Register onSwitchToLogin={handleLoginClick} />}

      {/* Additional content for the dashboard can go here */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mt-4">Welcome to the Neo Drink's</h1>
      </div>

      <div className="grid sm:grid-cols-1 grid-cols-2 justify-items-center items-center">
        <div className="sm:w-full sm:pl-4 w-4/5 pl-24">
          <h2 className="sm:text-3xl text-5xl font-russonOne font-medium no-underline align-middle tracking-wide normal-case leading-normal text-dark">
            AxeL Brand new{" "}
            <span className="sm:text-4xl text-dark text-6xl font-petitFormal font-bold">
              Furniture
            </span>{" "}
            Mobile App
          </h2>
          <div className="mt-4">
            <p className="sm:text-lg w-4/5 font-inter font-medium no-underline align-middle tracking-wide normal-case text-dark text-2xl">
              Giving your home a proper makeover never was this easy. Modern and
              stylish furniture for decent prices. Take a look at what we offer
              with a simple button click.
            </p>
          </div>
        </div>
        <div className="sm:pl-4 mt-4">
          {imageSources.map((src, index) => (
            <img
              key={index}
              className="sm:h-[4175px] h-[765px] w-full bg-no-repeat bg-center relative z-10 header rounded-xl"
              src={src}
              alt={`header-phone${index}`}
            />
          ))}
        </div>
        ;
      </div>
    </div>
  );
};

export default Dashboard;
