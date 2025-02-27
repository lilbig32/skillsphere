import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../assets/register.css";
import Header from "../components/Header";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      navigate("/profile");
    } catch (error) {
      setError(
        error.code === "auth/email-already-in-use"
          ? "Этот email уже зарегистрирован"
          : error.code === "auth/weak-password"
          ? "Пароль должен содержать минимум 6 символов"
          : "Произошла ошибка при регистрации"
      );
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2>Регистрация</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Имя:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Введите ваше имя"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
            />
          </label>
          <label>
            Пароль:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Придумайте пароль"
            />
          </label>
          <button type="submit">Зарегистрироваться</button>
        </form>
        <div className="auth-links">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </>
  );
};

export default Register;
