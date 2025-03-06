import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/header.css";
import profile from "../assets/img/profile.png";
import logo from "../assets/img/logo.png";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <a href="/home">
        <h1 className="logo">
          <img src={logo} alt="logo" className="logoimg" />
          SkillSphere
        </h1>
      </a>

      <div className="burger" onClick={toggleNav}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav ref={navRef} className={`nav ${isNavOpen ? "active" : ""}`}>
        {isNavOpen && (
          <div className="close-icon" onClick={closeNav}>
            &times;
          </div>
        )}
        <Link to="/home" className="nav-link" onClick={closeNav}>
          Главная
        </Link>
        <Link to="/news" className="nav-link" onClick={closeNav}>
          Новости
        </Link>
        <Link to="/courses" className="nav-link" onClick={closeNav}>
          Курсы
        </Link>
        <Link to="/profile" className="nav-link" onClick={closeNav}>
          <img src={profile} alt="profile" className="profile-icon" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
