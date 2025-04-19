import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем предыдущую ошибку

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      // --- Обработка ошибок входа ---
      let errorMessage = "Произошла ошибка при входе. Попробуйте снова.";
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential": // Более новая ошибка, часто заменяет user-not-found и wrong-password
          errorMessage = "Неверный email или пароль.";
          break;
        case "auth/invalid-email":
          errorMessage = "Неверный формат email адреса.";
          break;
        case "auth/user-disabled":
          errorMessage = "Этот аккаунт отключен.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Слишком много попыток входа. Попробуйте позже.";
          break;
        // Можно добавить другие коды ошибок Firebase
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2>Войти</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              placeholder="Введите пароль"
            />
          </label>
          <button type="submit">Войти</button>
        </form>
        <div className="auth-links">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
