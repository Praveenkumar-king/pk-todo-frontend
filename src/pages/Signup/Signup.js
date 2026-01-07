import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../../utils/api"; // ✅ API helper

const Signup = () => {
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Load Cloudflare Turnstile
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.turnstileSignupCallback = () => {
      setVerified(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!verified || !accepted) return;

    setError("");

    try {
      await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // ✅ Go to login after successful signup
      navigate("/login");
    } catch (err) {
      setError("User already exists or something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card" data-aos="zoom-in">
        <h1>Welcome To PK Todo 👋</h1>
        <p className="subtitle">Signup To PK Todo</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <label htmlFor="terms">
              Please accept the{" "}
              <a
                href="https://yourdomain.com/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Cloudflare Turnstile */}
          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAACLHHYYC4gt2pSVH"
            data-callback="turnstileSignupCallback"
          ></div>

          <button
            type="submit"
            disabled={!verified || !accepted}
            className={
              verified && accepted
                ? "signup-btn"
                : "signup-btn disabled"
            }
          >
            Signup
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
