import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/images/Neo logo.svg";
import { Link } from "react-scroll";
import "./Navbar.css"; // Import CSS

const Navbar = ({ onSwitchToLogin, onSwitchToRegister }) => {
  const [scroll, setScroll] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); // State for nav toggle
  const navbarRef = useRef(null); // Ref for navbar

  const handleScroll = () => {
    setScroll(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle nav state
  };

  // Handle clicks outside of the navbar
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsNavOpen(false);
    }
  };

  // Add event listener for clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        className={`navbar ${scroll ? "navbar-scroll" : "navbar-transparent"}`}
        ref={navbarRef}
      >
        <div className="grid grid-cols-2 justify-items-center items-center w-full">
          <div className="pl-20 w-4/5">
            <img className="navbar-logo" src={logo} alt="logo-img" />
          </div>
          <div className="hamburger" onClick={toggleNav}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className={`navbar-links ${isNavOpen ? "active" : ""}`}>
            <button
              className="{`navbar-button login mx-2`}"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
            <button
              className="{`navbar-button register`}"
              onClick={onSwitchToRegister}
            >
              Register
            </button>
            <Link
              to="home"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="cursor-pointer text-black text-lg font-medium px-2 hover:text-blue-500"
              onClick={() => setIsNavOpen(false)} // Close nav on link click
            >
              Home
            </Link>
            <Link
              to="about"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="cursor-pointer text-black text-lg font-medium px-2 hover:text-blue-500"
              onClick={() => setIsNavOpen(false)} // Close nav on link click
            >
              About
            </Link>
            <Link
              to="contact"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="cursor-pointer text-black text-lg font-medium px-2 hover:text-blue-500"
              onClick={() => setIsNavOpen(false)} // Close nav on link click
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
