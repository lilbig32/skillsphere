import Header from "../../components/Header";
import "../../assets/courses.css";

const GraphicDesignCourse = () => {
  const sections = [
    {
      title: "Основы дизайна",
      content: "Теория цвета, композиция, типографика, принципы дизайна.",
    },
    {
      title: "Adobe Photoshop",
      content: "Работа со слоями, масками, фильтрами, ретушь фотографий.",
    },
    {
      title: "Adobe Illustrator",
      content: "Векторная графика, работа с кривыми Безье, создание логотипов.",
    },
    {
      title: "Figma",
      content: "Прототипирование интерфейсов, компоненты, автолейаут.",
    },
    {
      title: "Брендинг",
      content: "Создание айдентики, гайдлайны, презентация проектов.",
    },
  ];

  return (
    <div>
      <Header />
      <div className="course-detail">
        <h1>Графический дизайн</h1>
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

export default GraphicDesignCourse;
