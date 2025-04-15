import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { migrateCoursesToFirebase } from "../services/migrateCourses";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminInitialize = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCourses = async () => {
      try {
        await migrateCoursesToFirebase();
        setSuccess(true);
        // Перенаправление на главную страницу после успешной инициализации
        setTimeout(() => {
          navigate("/courses");
        }, 3000);
      } catch (error) {
        console.error("Ошибка при инициализации курсов:", error);
        setError(
          "Произошла ошибка при инициализации курсов. Проверьте консоль для получения дополнительной информации."
        );
      } finally {
        setLoading(false);
      }
    };

    initializeCourses();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="admin-init-container">
        <h1>Инициализация базы данных курсов</h1>

        {loading && (
          <div className="init-status loading">
            <div className="spinner"></div>
            <p>Загрузка курсов в базу данных...</p>
          </div>
        )}

        {error && (
          <div className="init-status error">
            <h2>Ошибка!</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/courses")}>
              Вернуться к курсам
            </button>
          </div>
        )}

        {success && (
          <div className="init-status success">
            <h2>Курсы успешно загружены!</h2>
            <p>
              Вы будете перенаправлены на страницу курсов через несколько
              секунд...
            </p>
            <button onClick={() => navigate("/courses")}>
              Перейти к курсам сейчас
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminInitialize;
