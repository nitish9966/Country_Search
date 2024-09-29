// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation after login

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // To show error message
  const navigate = useNavigate(); // To redirect after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 200) {
        handleLogin(); // Update the authentication state
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        setErrorMessage(
          result.error || "Invalid credentials. Please try again."
        ); // Show error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again."); // Handle other errors
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-[url('./assets/reg.jpg')]">
      <div className="container max-w-md bg-transparent rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Login</h2>
        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}{" "}
        {/* Error message */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="Email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            value={formData.Password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-white font-serif">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
