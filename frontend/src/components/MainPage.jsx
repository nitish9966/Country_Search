import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-[url('./assets/map.jpg')]">
      <div className="container bg-transparent rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-6">
          Country Details
        </h1>

        <div className="mb-6">
          <h2 className="text-2xl text-white mb-3 font-serif">Register</h2>
          <Link to="/signup">
            <button className="bg-black text-white py-2 px-4 rounded hover:bg-aqua transform hover:scale-105 transition hover:bg-cyan-400 hover:text-black hover:font-serif">
              Register
            </button>
          </Link>
          <p>Go to Registration</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-3 font-serif">Login</h2>
          <Link to="/login">
            <button className="bg-black text-white py-2 px-4 rounded transform hover:scale-105 transition hover:bg-cyan-400 hover:text-black hover:font-serif">
              Login
            </button>
          </Link>
          <p>Go to Login</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
