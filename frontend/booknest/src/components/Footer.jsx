import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      
      <div className="container mx-auto text-center flex justify-center items-center">
      <div >
        <img src="./logo.webp" alt="logo" height="90" width="90" />
      </div>
      <div className="ml-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BookNest. All Rights Reserved.
        </p>
        <div className="mt-4">
          <a
            href="/"
            className="text-gray-400 hover:text-white mx-2"
          >
            Privacy Policy
          </a>
          <a
            href="/"
            className="text-gray-400 hover:text-white mx-2"
          >
            Terms of Service
          </a>
          <a
            href="/"
            className="text-gray-400 hover:text-white mx-2"
          >
            Contact Us
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
