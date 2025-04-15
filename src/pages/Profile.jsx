import { useEffect, useState, useMemo } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllCourses, getUserProgress } from "../services/courseService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Загрузка курсов и прогресса
  const loadUserData = async (currentUser) => {
    try {
      setLoading(true);
      // Инициализируем дефолтные курсы, если это необходимо
      // await initializeDefaultCourses(); // Можно закомментировать, если не нужно при каждом заходе

      // Получаем курсы (из Firebase или локально, в зависимости от courseService)
      const coursesData = await getAllCourses();
      setCourses(coursesData);

      // Получаем прогресс пользователя
      if (currentUser) {
        const progressData = await getUserProgress(currentUser.uid);
        setUserProgress(progressData);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadUserData(user);
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

  // Фильтруем курсы, чтобы показывать только те, по которым есть прогресс
  const startedCourses = useMemo(() => {
    return courses.filter((course) => userProgress[course.id] > 0);
  }, [courses, userProgress]);

  if (!user || loading) return <div className="loading">Загрузка...</div>;

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
              <span>
                <b>E-mail:</b> {user.email}
              </span>
            </div>
            <div className="info-item">
              <span>
                <b>Дата регистрации:</b>{" "}
                {new Date(user.metadata.creationTime).toLocaleString("ru-RU", {
                  timeZone: "Europe/Moscow",
                })}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>

          {/* Отображение прогресса курсов */}
          <div className="course-progress">
            <h3>Мои курсы</h3>
            {startedCourses.length > 0 ? (
              startedCourses.map((course) => (
                <div key={course.id} className="course-item">
                  <span>{course.title}</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${(userProgress[course.id] || 0) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span>
                    {((userProgress[course.id] || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              ))
            ) : (
              <p>Вы еще не начали ни одного курса.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
