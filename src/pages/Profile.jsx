import { useEffect, useState, useMemo } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Статичный объект для курсов и их прогресса
  const courses = {
    course1: { title: "Основы программирования", progress: 0.5 }, // 50%
    course2: { title: "Web-разработка", progress: 0.75 }, // 75%
    course3: { title: "Графический дизайн", progress: 0.2 }, // 20%
  };

  // Функция для получения инициалов
  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return email ? email[0].toUpperCase() : "U";
  };

  // Функция для получения случайного цвета на основе email
  const getRandomColor = (seed) => {
    const colors = [
      "#4A90E2", // синий
      "#50E3C2", // бирюзовый
      "#B8FF00", // зеленый
      "#F5A623", // оранжевый
      "#7ED321", // светло-зеленый
      "#C471ED", // фиолетовый
    ];
    const index = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Создаем стиль для аватара с помощью useMemo для оптимизации
  const avatarStyle = useMemo(() => {
    if (!user) return {};
    const backgroundColor = getRandomColor(user.email || "");
    return {
      backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "2.5rem",
      fontWeight: "bold",
      width: "100%",
      height: "100%",
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Фото профиля" />
              ) : (
                <div style={avatarStyle}>
                  {getInitials(user.displayName, user.email)}
                </div>
              )}
            </div>
            <h2>{user.displayName || "Пользователь"}</h2>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <span><b>E-mail:</b> {user.email}</span>
            </div>
            <div className="info-item">
              <span><b>Дата регистрации:</b> {new Date(user.metadata.creationTime).toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'})}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>

          {/* Отображение прогресса курсов */}
          <div className="course-progress">
            <h3>Прогресс курсов</h3>
            {Object.entries(courses).map(([courseId, course]) => (
              <div key={courseId} className="course-item">
                <span>{course.title}</span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${course.progress * 100}%` }}
                  ></div>
                </div>
                <span>{(course.progress * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
