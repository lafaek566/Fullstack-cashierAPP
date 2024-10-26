import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/auth/login", {
        username,
        password,
      });
      const { role } = response.data.user; // Access the user data

      // Store token if your backend sends one
      // localStorage.setItem("token", response.data.token);

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "kasir") {
        navigate("/kasir");
      } else {
        navigate("/customers");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your username and password.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p onClick={onSwitchToRegister}>Don't have an account? Register</p>
    </div>
  );
};

export default Login;
