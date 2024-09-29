import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Signup = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 201) {
        alert(result.message);
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-[url('./assets/reg.jpg')]">
      <div className="container max-w-md bg-transparent rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="FullName"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            value={formData.FullName}
            onChange={handleChange}
            required
          />
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
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-white font-serif">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
