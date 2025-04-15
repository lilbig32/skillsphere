import Header from "../../components/Header";

const WebDevelopmentCourse = () => {
  const sections = [
    {
      title: "Введение в веб-разработку",
      content:
        "Основы работы интернета, клиент-серверная архитектура, протоколы.",
    },
    {
      title: "HTML5",
      content:
        "Структура HTML-документа, семантические теги, формы и валидация.",
    },
    {
      title: "CSS3",
      content: "Стилизация элементов, flexbox, grid, анимации и медиа-запросы.",
    },
    {
      title: "JavaScript основы",
      content: "Базовый синтаксис, работа с DOM, обработка событий.",
    },
    {
      title: "React",
      content: "Компоненты, состояния, props, хуки и маршрутизация.",
    },
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>Web-разработка</h1>
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

export default WebDevelopmentCourse;
