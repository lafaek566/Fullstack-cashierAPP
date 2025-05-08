import React, { useState } from "react";
import axios from "axios";

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5002/auth/register", {
        username,
        password,
        role,
      });

      if (response.data.success) {
        setError("");
        onSwitchToLogin();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="kasir">Kasir</option>
      </select>
      <button onClick={handleRegister}>Register</button>
      {/* Added inline style for cursor pointer */}
      <p
        onClick={onSwitchToLogin}
        style={{
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
        }}
      >
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;
