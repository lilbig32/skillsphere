import logo from "../assets/img/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-content">
      <div className="footer-logo">
        <a href="/home"><img src={logo} alt="SkillSphere Logo" /></a>
        <a href="/home">SkillSphere</a>
      </div>
      <nav className="footer-links">
        <a href="/home">Главная</a>
        <a href="/news">Новости</a>
        <a href="/courses">Курсы</a>
      </nav>
      </div>
        <div className="footer-policy">Проект разработан в рамках ВКР</div>
    </footer>
  );
};

export default Footer;
