import Header from "../../components/Header";
import "../../assets/courses.css";

const ProgrammingBasicsCourse = () => {
  const sections = [
    {
      title: "Введение в программирование",
      content:
        "Что такое программирование, базовые концепции и принципы работы компьютера.",
    },
    {
      title: "Алгоритмы и блок-схемы",
      content:
        "Основы алгоритмического мышления, создание блок-схем, базовые алгоритмические конструкции.",
    },
    {
      title: "Переменные и типы данных",
      content:
        "Работа с различными типами данных, объявление переменных, основные операции.",
    },
    {
      title: "Условные конструкции",
      content: "Использование if-else, switch-case, тернарные операторы.",
    },
    {
      title: "Циклы",
      content: "Работа с циклами while, do-while, for. Управление циклами.",
    },
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>Основы программирования</h1>
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

export default ProgrammingBasicsCourse;
