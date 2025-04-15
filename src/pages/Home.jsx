import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import headergif from "../assets/img/headergif.gif";
import FAQ_Illustration from "../assets/img/FAQ-Illustration.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { NewsModal, NewsCard, newsData } from "../components/NewsComponents";
import { getAllCourses } from "../services/courseService";
import { auth } from "../firebase";
import { getUserProgress } from "../services/courseService";

import osnovi_program from "../assets/img/osnovi_program.jpg";
import web_razrabotka from "../assets/img/web_razrabotka.jpg";
import javascript from "../assets/img/javascript.jpg";
import nodejs from "../assets/img/nodejs.png";
import course1 from "../assets/img/course1.png";
import course2 from "../assets/img/course2.png";

const courseImages = {
  "programming-basics": osnovi_program,
  "web-development": web_razrabotka,
  javascript: javascript,
  nodejs: nodejs,
  python: course1,
  "graphic-design": course2,
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <img
        src={FAQ_Illustration}
        alt="FAQ Illustration"
        className="faq-image"
      />
      <div className="faq-content">
        <h2
          style={{
            textAlign: "center",
            fontFamily: "montserat_bold",
            fontSize: "2.3rem",
          }}
        >
          FAQ
        </h2>
        {[
          {
            question: "Можно ли получить сертификат после прохождения курса?",
            answer:
              "Да, по завершении любого курса на платформе SkillSphere вы можете получить официальный сертификат о прохождении обучения. Сертификат подтверждает ваши навыки и может быть использован для демонстрации ваших достижений.",
          },
          {
            question: "Как начать обучение на SkillSphere?",
            answer:
              "Просто зарегистрируйтесь на платформе и выберите интересующий вас курс. Все материалы доступны сразу после регистрации. Учитесь в своем темпе, в любое удобное время. Наши интерактивные уроки помогут освоить новые навыки легко и эффективно.",
          },
          {
            question: "Есть ли ограничения по времени для прохождения курсов?",
            answer:
              "Нет, вы можете изучать материалы в своем собственном темпе без каких-либо временных ограничений.",
          },
        ].map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <svg
                className="faq-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                />
              </svg>
            </div>
            <div className="faq-answer">
              {openIndex === index && <p>{faq.answer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homeCourses, setHomeCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCoursesAndProgress = async (currentUser) => {
      try {
        setLoadingCourses(true);
        const allCourses = await getAllCourses();
        setHomeCourses(allCourses.slice(0, 3));

        if (currentUser) {
          const progressData = await getUserProgress(currentUser.uid);
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error("Ошибка при загрузке курсов на главной:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      fetchCoursesAndProgress(user);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleReadMore = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  return (
    <>
      <Header />

      <div className="mainheader">
        <div className="left-section">
          <h3 className="title">
            Инвестируйте в<br /> себя с SkillSphere
          </h3>
          <Link to="/courses">
            <button className="button">Начать обучение</button>
          </Link>
        </div>
        <div className="right-section">
          <img src={headergif} alt="GIF" className="gif" />
        </div>
      </div>

      <div className="newsCards">
        {newsData.map((news) => (
          <NewsCard key={news.id} news={news} onReadMore={handleReadMore} />
        ))}
      </div>

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <h1 style={{ textAlign: "center", fontFamily: "montserat_bold" }}>
        Наши Популярные Курсы
      </h1>
      <div className="home-course-list">
        {loadingCourses ? (
          <p>Загрузка курсов...</p>
        ) : homeCourses.length > 0 ? (
          homeCourses.map((course) => (
            <div key={course.id} className="home-course-card">
              <img
                src={courseImages[course.id] || course1}
                alt={course.title}
                className="home-course-image"
              />
              <div className="home-course-content">
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="home-course-meta">
                    <span className="home-course-duration">
                      {course.totalLessons} разделов
                    </span>
                  </div>
                </div>
                <Link
                  to={`/courses/${course.id}`}
                  className="home-course-button-link"
                >
                  <button className="home-course-button">
                    {user && userProgress[course.id]
                      ? "Продолжить"
                      : "Начать обучение"}
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Курсы не найдены.</p>
        )}
      </div>

      <FAQ />
      <Footer />
    </>
  );
};

export default Home;
