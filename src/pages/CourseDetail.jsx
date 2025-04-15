import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  getCourseById,
  getUserProgress,
  updateUserProgress,
} from "../services/courseService";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Импортируем изображения для курсов
import osnovi_program from "../assets/img/osnovi_program.jpg";
import web_razrabotka from "../assets/img/web_razrabotka.jpg";
import javascript from "../assets/img/javascript.jpg";
import nodejs from "../assets/img/nodejs.png";
import course1 from "../assets/img/course1.png";
import course2 from "../assets/img/course2.png";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(1);

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
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadCourseData(currentUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [courseId, navigate]);

  const loadCourseData = async (userId) => {
    try {
      setLoading(true);
      // Получаем данные курса
      const courseData = await getCourseById(courseId);
      setCourse(courseData);

      // Получаем прогресс пользователя
      const progressData = await getUserProgress(userId);
      const courseProgress = progressData[courseId] || 0;
      setProgress(courseProgress);

      // Определяем текущий модуль и урок на основе прогресса
      if (courseData.modules && courseData.modules.length > 0) {
        const completedLessons = Math.floor(
          courseProgress * courseData.totalLessons
        );
        let lessonCount = 0;
        let foundModule = false;

        for (let i = 0; i < courseData.modules.length; i++) {
          const module = courseData.modules[i];

          if (lessonCount + module.lessons > completedLessons && !foundModule) {
            setCurrentModule(module);
            setCurrentLesson(completedLessons - lessonCount + 1);
            foundModule = true;
          }

          lessonCount += module.lessons;
        }

        // Если не нашли текущий модуль (курс завершен), устанавливаем последний
        if (!foundModule) {
          setCurrentModule(courseData.modules[courseData.modules.length - 1]);
          setCurrentLesson(
            courseData.modules[courseData.modules.length - 1].lessons
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных курса:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user || !course || !currentModule) return;

    // Определяем общее количество уроков в курсе
    const totalLessons = course.totalLessons;

    // Вычисляем новый прогресс
    let completedLessons = 0;

    // Считаем уроки до текущего модуля
    for (const module of course.modules) {
      if (module.id === currentModule.id) {
        completedLessons += currentLesson;
        break;
      }
      completedLessons += module.lessons;
    }

    const newProgressDecimal = Math.min(completedLessons / totalLessons, 1);

    try {
      // Обновляем прогресс в Firebase
      await updateUserProgress(user.uid, courseId, newProgressDecimal);
      setProgress(newProgressDecimal);

      // Переходим к следующему уроку или модулю
      if (currentLesson < currentModule.lessons) {
        // Переход к следующему уроку в текущем модуле
        setCurrentLesson(currentLesson + 1);
      } else {
        // Нашли индекс текущего модуля
        const currentModuleIndex = course.modules.findIndex(
          (m) => m.id === currentModule.id
        );

        // Если это не последний модуль, переходим к следующему
        if (currentModuleIndex < course.modules.length - 1) {
          setCurrentModule(course.modules[currentModuleIndex + 1]);
          setCurrentLesson(1);
        }
      }
    } catch (error) {
      console.error("Ошибка при обновлении прогресса:", error);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!course) return <div className="error">Курс не найден</div>;

  const progressPercent = (progress * 100).toFixed(0);

  return (
    <>
      <Header />
      <div className="course-detail">
        <h1>{course.title}</h1>

        {/* Информация о курсе и прогрессе */}
        <div className="course-header">
          <div className="course-image-container">
            <img
              src={courseImages[courseId] || course1}
              alt={course.title}
              className="course-detail-image"
            />
          </div>

          <div className="course-info-container">
            <div className="course-description">{course.description}</div>

            <div className="course-progress-container">
              <h3>Ваш прогресс</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span>{progressPercent}% выполнено</span>
            </div>
          </div>
        </div>

        {/* Модули и текущий урок */}
        <div className="course-section">
          <div className="modules-list">
            <h2>Модули курса</h2>
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${
                  currentModule?.id === module.id ? "active" : ""
                }`}
              >
                <div className="module-title">
                  <h3>
                    {index + 1}. {module.title}
                  </h3>
                  <span className="lesson-count">
                    {module.lessons} урок(ов)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Текущий урок */}
          {currentModule && (
            <div className="current-lesson-container">
              <h2>Текущий урок</h2>
              <div className="lesson-card">
                <h3>
                  {currentModule.title} - Урок {currentLesson}/
                  {currentModule.lessons}
                </h3>

                <div className="lesson-content">
                  <p>{currentModule.content}</p>

                  {/* Здесь будет основное содержимое урока */}
                  <p>
                    Это содержимое урока {currentLesson} из модуля &quot;
                    {currentModule.title}&quot;.
                  </p>
                  <p>
                    В реальном приложении здесь будет загружаться контент урока
                    из базы данных.
                  </p>
                </div>

                <button
                  className="complete-lesson"
                  onClick={handleCompleteLesson}
                  disabled={progress === 1}
                >
                  {progress === 1 ? "Курс завершен" : "Завершить урок"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;
