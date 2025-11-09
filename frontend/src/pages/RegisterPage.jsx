import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const register = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/register`, {
        username,
        password,
      });
      alert(res.data);
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
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
        <button onClick={register}>Register</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
