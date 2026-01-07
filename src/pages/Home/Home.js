import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from "../../assets/img/Pk To-Do App.png";
import AOS from "aos";
import "aos/dist/aos.css";

const texts = [
  "Organize your day.",
  "Pin what matters.",
  "Stay productive with PK Todo."
];

const Home = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const currentText = texts[index];
    let timeout;

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 80);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 50);
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((index + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index]);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="logo-area">
          <img src={logo} alt="PK Todo Logo" />
          <span>PK Todo</span>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/signup" className="btn-filled">Signup</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero" data-aos="fade-up">
        <p className="tagline">
          A simple and powerful way to manage your daily tasks.
        </p>

        <h1 className="typing-text">
          {text}
          <span className="cursor">|</span>
        </h1>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-left">
          <img src={logo} alt="PK Todo" />
          <p>PK Todo</p>
        </div>

        <div className="footer-center">
          <a href="google.com" target="_blank" rel="noreferrer">Privacy</a>
          <a href="google.com" target="_blank" rel="noreferrer">Terms & Conditions</a>
        </div>

        <div className="footer-right">
          Designed & Developed by PK Todo App with ❤️
        </div>
      </footer>
    </div>
  );
};

export default Home;
