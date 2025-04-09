import Header from "../../components/Header";
import "../../assets/courses.css";

const NodeJSCourse = () => {
  const sections = [
    {
      title: "Введение в Node.js",
      content: "Архитектура Node.js, event loop, модули, npm.",
    },
    {
      title: "Express.js",
      content: "Создание сервера, маршрутизация, middleware, обработка ошибок.",
    },
    {
      title: "Базы данных",
      content: "MongoDB, Mongoose, SQL, работа с данными.",
    },
    {
      title: "API разработка",
      content: "REST API, аутентификация, авторизация, JWT.",
    },
    {
      title: "Развертывание",
      content: "Деплой приложения, работа с облачными сервисами, Docker.",
    },
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>Backend разработка на Node.js</h1>
        <div className="course-sections">
          {sections.map((section, index) => (
            <div key={index} className="course-section">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodeJSCourse;
