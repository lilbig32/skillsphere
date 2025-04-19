import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- Функция валидации пароля ---
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("минимум 6 символов");
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("латинские буквы");
    }
    if ((password.match(/\d/g) || []).length < 3) {
      errors.push("минимум 3 цифры");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("хотя бы 1 спецсимвол (!@#$%^&*...)");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем предыдущую ошибку

    // --- Клиентская валидация ---
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(
        `Пароль не соответствует требованиям: ${passwordErrors.join(", ")}.`
      );
      return; // Прерываем отправку
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Имя обновляется после успешного создания пользователя
      await updateProfile(userCredential.user, {
        displayName: name, 
      });
      navigate("/profile"); // Перенаправляем в профиль
    } catch (error) {
      // --- Обработка ошибок Firebase ---
      let errorMessage = "Произошла ошибка при регистрации. Попробуйте снова.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Этот email уже используется другим аккаунтом.";
          break;
        case "auth/invalid-email":
          errorMessage = "Неверный формат email адреса.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Пароль не соответствует требованиям безопасности Firebase.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Регистрация с email/паролем не включена в настройках Firebase.";
          break;
      }
      setError(errorMessage);
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
              aria-describedby="password-hint"
            />
            {/* --- Подсказка для пароля --- */}
            <small
              id="password-hint"
              style={{ color: "#666", marginTop: "4px", lineHeight: "1.4" }}
            >
              Требования: мин. 6 символов, латинские буквы, мин. 3 цифры,
              спецсимвол (!@#...).
            </small>
          </label>
          <button type="submit">Зарегистрироваться</button>
        </form>
        <div className="auth-links">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
