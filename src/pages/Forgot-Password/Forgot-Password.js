import React, { useState } from "react";
import axios from "axios";
import "./Forgot-Password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "https://pk-todo-backend.onrender.com/api/auth/forgot-password",
        { email }
      );

      setMessage(
        "If this email is registered, a reset link has been sent. Please check your Inbox or Spam folder."
      );
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to send reset email. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Reset Password For PK Todo</h1>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="reset-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="info-text">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
