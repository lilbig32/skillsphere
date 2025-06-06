import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses, getUserProgress } from "../services/courseService";
import { auth } from "../firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Импортируем изображения для курсов
import osnovi_program from "../assets/img/osnovi_program.jpg";
import web_razrabotka from "../assets/img/web_razrabotka.jpg";
import javascript from "../assets/img/javascript.jpg";
import nodejs from "../assets/img/nodejs.png";
import course1 from "../assets/img/course1.png";
import course2 from "../assets/img/course2.png";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Все курсы");
  const [searchQuery, setSearchQuery] = useState("");

  // Карта для изображений
  const courseImages = {
    "programming-basics": osnovi_program,
    "web-development": web_razrabotka,
    javascript: javascript,
    nodejs: nodejs,
    python: course1,
    "graphic-design": course2,
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      loadCourses(user);
    });

    return () => unsubscribe();
  }, []);

  const loadCourses = async (user) => {
    try {
      setLoading(true);

      // Получаем все курсы
      const coursesData = await getAllCourses();
      setCourses(coursesData);

      // Если пользователь авторизован, получаем его прогресс
      if (user) {
        const userProgressData = await getUserProgress(user.uid);
        setUserProgress(userProgressData);
      }
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация курсов по категории и поисковому запросу
  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      activeFilter === "Все курсы" ||
      (course.category && course.category === activeFilter);
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container">
      <Header />
      <div
        className="search-section fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <input
          type="text"
          placeholder="Поиск курсов..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filters fade-in" style={{ animationDelay: "0.2s" }}>
          {["Все курсы", "Программирование", "Дизайн", "Web-разработка"].map(
            (filter) => (
              <button
                key={filter}
                className={`filter-button ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>
      <div className="courses-container">
        {loading ? (
          // Показываем скелетоны во время загрузки
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="skeleton-card fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-line w-75"></div>
              <div className="skeleton skeleton-line w-100"></div>
              <div className="skeleton skeleton-line w-50"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          // Показываем реальные карточки курсов
          filteredCourses.map((course, idx) => (
            <div
              key={course.id}
              className="course-card fade-in"
              style={{ animationDelay: `${0.4 + idx * 0.12}s` }}
            >
              <img
                src={courseImages[course.id] || course1}
                alt={course.title}
                className="course-image"
              />
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-duration">
                    {course.totalLessons} разделов
                  </span>
                </div>
                <Link to={`/courses/${course.id}`} className="enroll-link">
                  <button className="enroll-button">
                    {userProgress[course.id]
                      ? "Продолжить курс"
                      : "Начать курс"}
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          // Показываем сообщение, если курсов нет
          <div
            className="no-results fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <h3>Результатов нет</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
