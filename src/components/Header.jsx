import { Link } from "react-router-dom";
import "../assets/header.css";
import profile from "../assets/img/profile.png";
import logo from "../assets/img/logo.png";

const Header = () => {
  return (
    <header className="header">

      <a href="/home"><h1 className="logo">
        <img src={logo} alt="logo" className="logoimg"/>SkillSphere
      </h1></a>

      <nav className="nav">
        <Link to="/home" className="nav-link">Главная</Link>
        <Link to="/news" className="nav-link">Новости</Link>
        <Link to="/courses" className="nav-link">Курсы</Link>
        <Link to="/profile" className="nav-link">
          <img src={profile} alt="profile" className="profile-icon" />
        </Link>
      </nav>

    </header>
  );
};

export default Header;
