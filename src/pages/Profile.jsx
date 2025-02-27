import { useEffect, useState, useMemo } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../assets/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
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
      "#B8FF00", // зеленый (как на вашем сайте)
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
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <span>Дата регистрации: {user.metadata.creationTime}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-button">Редактировать профиль</button>
            <button className="logout-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
