import Header from "../../components/Header";
import "../../assets/courses.css";

const PythonCourse = () => {
  const sections = [
    {
      title: "Введение в Python",
      content: "Основы синтаксиса и структуры языка.",
    },
    {
      title: "Условные операторы",
      content: "Как использовать if, else и elif.",
    },
    { title: "Циклы", content: "Работа с циклами for и while." },
    // Добавьте другие разделы курса
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>Python-разработчик</h1>
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

export default PythonCourse;
