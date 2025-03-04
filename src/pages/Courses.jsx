import { useState } from "react";
import Header from "../components/Header";
import "../assets/courses.css";
import course1 from "../assets/img/course1.png";
import course2 from "../assets/img/course2.png";
import osnovi_program from "../assets/img/osnovi_program.jpg";
import web_razrabotka from "../assets/img/web_razrabotka.jpg";
import javascript from "../assets/img/javascript.jpg";
import nodejs from "../assets/img/nodejs.png";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("Все курсы");
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "Основы программирования",
      description: "Изучите базовые концепции программирования с нуля",
      duration: "12 разделов",
      category: "Программирование",
      image: osnovi_program,
    },
    {
      id: 2,
      title: "Web-разработка",
      description: "Создавайте современные веб-приложения с React",
      duration: "15 разделов",
      category: "Web-разработка",
      image: web_razrabotka,
    },
    {
      id: 3,
      title: "Python-разработчик",
      description: "Освойте самый востребованный язык программирования, на котором пишут сайты, приложения, игры и чат-боты.",
      duration: "10 разделов",
      category: "Программирование",
      image: course1,
    },
    {
      id: 4,
      title: "JavaScript для начинающих",
      description: "Освойте самый популярный язык программирования в мире",
      duration: "14 разделов",
      category: "Программирование",
      image: javascript,
    },
    {
      id: 5,
      title: "Графический дизайн",
      description: "Вы научитесь создавать айдентику для брендов и освоите популярные графические редакторы – от Illustrator до Figma.",
      duration: "11 разделов",
      category: "Дизайн",
      image: course2,
    },
    {
      id: 6,
      title: "Backend разработка на Node.js",
      description: "Научитесь создавать серверную часть веб-приложений",
      duration: "13 разделов",
      category: "Web-разработка",
      image: nodejs,
    },
  ];

  const popularTopics = [
    {
      name: "JavaScript",
      icon: "🟨",
    },
    {
      name: "React",
      icon: "⚛️",
    },
    {
      name: "Node.js",
      icon: "💚",
    },
    {
      name: "Python",
      icon: "🐍",
    },
    {
      name: "Основы программирования",
      icon: "💻",
    },
    {
      name: "Графический дизайн",
      icon: "🎯",
    },
  ];

  const handleTopicClick = (topicName) => {
    setSearchQuery(topicName); // При клике на тему, устанавливаем её как поисковый запрос
  };

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      activeFilter === "Все курсы" || course.category === activeFilter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <Header />
      <div className="search-section">
        <input
          type="text"
          placeholder="Поиск курсов..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filters">
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
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <img
                src={course.image}
                alt={course.title}
                className="course-image"
              />
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-duration">{course.duration}</span>
                </div>
                <button className="enroll-button">Записаться на курс</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>Результатов нет</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
      
      <div className="popular-topics">
        <h2>Популярные темы</h2>
        <div className="topics-grid">
          {popularTopics.map((topic) => (
            <div
              className="topic-card"
              key={topic.name}
              onClick={() => handleTopicClick(topic.name)}
            >
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-name">{topic.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
