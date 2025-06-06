import { useNavigate } from "react-router-dom";
import "../assets/index.css";
import logo from "../assets/img/logo.png";

function TitlePage() {
  const navigate = useNavigate();

  return (
    <div className="title-container">
      <div className="title-header">ГБПОУ «Пермский краевой колледж «Оникс»</div>
      <div className="title-content">
        <h1>Выпускная квалификационная работа</h1>
          <h1>«Информационная система для реализации онлайн-курсов»</h1>
        <div className="title-logo" style={{display: "flex", alignItems: "center", gap: "10px"}}><img src={logo} alt="Логотип" className="logo" style={{width: "60px", height: "60px"}}/><span style={{fontSize: "38px", fontWeight: "bold"}}>SkillSphere</span></div>
        <p>Разработал: Шерстобитов Иван Александрович</p>
        <p>Специальность 09.02.07 «Информационные системы и программирование»</p>
        <button onClick={() => navigate("/home")}>Перейти к диплому</button>
      </div>
      <footer className="title-footer">Пермь, {new Date().getFullYear()}</footer>
    </div>
  );
}

export default TitlePage;
