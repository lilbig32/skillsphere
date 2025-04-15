import Header from "../../components/Header";

const JavaScriptCourse = () => {
  const sections = [
    {
      title: "Введение в JavaScript",
      content: "История языка, особенности, где и как используется JavaScript.",
    },
    {
      title: "Основы языка",
      content: "Переменные, типы данных, операторы, функции.",
    },
    {
      title: "Работа с DOM",
      content: "Манипуляция элементами, события, делегирование событий.",
    },
    {
      title: "Асинхронное программирование",
      content: "Promise, async/await, работа с API.",
    },
    {
      title: "ES6+ возможности",
      content: "Стрелочные функции, деструктуризация, модули, классы.",
    },
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>JavaScript для начинающих</h1>
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

export default JavaScriptCourse;
