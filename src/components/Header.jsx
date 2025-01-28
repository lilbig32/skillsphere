import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1>Онлайн курсы</h1>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/login">Войти</Link>
        <Link to="/register">Регистрация</Link>
      </nav>
    </header>
  );
};

export default Header;
