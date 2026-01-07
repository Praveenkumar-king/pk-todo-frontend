import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../../utils/api"; // ✅ API helper

const Login = () => {
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Load Cloudflare Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Callback for Turnstile success
    window.turnstileCallback = () => {
      setVerified(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!verified) return;

    setError("");

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Go to todos page
      navigate("/todos");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" data-aos="zoom-in">
        <h1>Welcome Back 👋</h1>
        <p className="subtitle">Login to PK Todo</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* Cloudflare Turnstile */}
          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAACLHHYYC4gt2pSVH"
            data-callback="turnstileCallback"
          ></div>

          <button
            type="submit"
            disabled={!verified}
            className={verified ? "login-btn" : "login-btn disabled"}
          >
            Login
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
