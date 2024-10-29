import React from "react";
import logo from "../../assets/images/neo logo.svg";
import googlePlay from "../../assets/images/google-play.svg";
import appleStore from "../../assets/images/apple-store.svg";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="sm:grid-cols-2 grid grid-cols-4 gap-10 items-center justify-items-center">
          <div className="sm:w-full sm:pl-8 h-64 mx-auto pl-24 logo">
            <img className="h-10 cursor-pointer" src={logo} alt="logo" />
            <div className="app-links">
              <img
                className="h-8 cursor-pointer mt-5"
                src={appleStore}
                alt="apple-store"
              />
              <img
                className="h-8 cursor-pointer mt-5"
                src={googlePlay}
                alt="google-play"
              />
            </div>
          </div>
          {/* Removed Features sections */}
        </div>
        <div className="flex items-center justify-center">
          <hr className="sm:w-full h-px w-4/5 bg-gray-400 opacity-50 outline-none border-none" />
        </div>
        <div className="flex justify-around items-center py-6">
          <div>
            <p className="sm:text-xs text-dark pb-2 font-inter font-light cursor-pointer no-underline align-middle tracking-wide normal-case">
              Copyright {year} page by Elvren Nahak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
