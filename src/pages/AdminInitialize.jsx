import { useState } from "react";
import initializeDatabase from "../scripts/initializeCourses";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminInitialize = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleInitialize = async () => {
    try {
      setStatus("loading");
      await initializeDatabase();
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <div className="admin-init-container">
        <h1>Административная панель</h1>

        <div className={`init-status ${status}`}>
          {status === "idle" && (
            <div>
              <h2>Инициализация базы данных курсов</h2>
              <p>Нажмите кнопку ниже, чтобы добавить курсы в базу данных.</p>
              <p>
                <strong>Внимание:</strong> Это перезапишет существующие курсы!
              </p>
              <button onClick={handleInitialize}>
                Инициализировать базу данных
              </button>
            </div>
          )}

          {status === "loading" && (
            <div>
              <div className="spinner"></div>
              <h2>Инициализация...</h2>
              <p>Пожалуйста, подождите. Это может занять несколько секунд.</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <h2>Успех!</h2>
              <p>База данных курсов была успешно инициализирована.</p>
              <button onClick={() => setStatus("idle")}>Назад</button>
            </div>
          )}

          {status === "error" && (
            <div>
              <h2>Ошибка!</h2>
              <p>Произошла ошибка при инициализации базы данных:</p>
              <p>{error}</p>
              <button onClick={() => setStatus("idle")}>
                Попробовать снова
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminInitialize;
