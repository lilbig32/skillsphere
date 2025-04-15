import { db } from "../firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Старые данные курсов
export const oldCourses = [
  {
    id: "programming-basics",
    title: "Основы программирования",
    description: "Изучите базовые концепции программирования с нуля",
    totalLessons: 12,
    image: "osnovi_program.jpg",
    category: "Программирование",
    modules: [
      {
        id: "module1",
        title: "Введение в программирование",
        lessons: 2,
        content:
          "Что такое программирование, базовые концепции и принципы работы компьютера.",
      },
      {
        id: "module2",
        title: "Алгоритмы и блок-схемы",
        lessons: 2,
        content:
          "Основы алгоритмического мышления, создание блок-схем, базовые алгоритмические конструкции.",
      },
      {
        id: "module3",
        title: "Переменные и типы данных",
        lessons: 3,
        content:
          "Работа с различными типами данных, объявление переменных, основные операции.",
      },
      {
        id: "module4",
        title: "Условные конструкции",
        lessons: 2,
        content: "Использование if-else, switch-case, тернарные операторы.",
      },
      {
        id: "module5",
        title: "Циклы",
        lessons: 3,
        content: "Работа с циклами while, do-while, for. Управление циклами.",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web-разработка",
    description: "Создавайте современные веб-приложения с React",
    totalLessons: 15,
    image: "web_razrabotka.jpg",
    category: "Web-разработка",
    modules: [
      {
        id: "module1",
        title: "Введение в веб-разработку",
        lessons: 3,
        content:
          "Основы работы интернета, клиент-серверная архитектура, протоколы.",
      },
      {
        id: "module2",
        title: "HTML5",
        lessons: 3,
        content:
          "Структура HTML-документа, семантические теги, формы и валидация.",
      },
      {
        id: "module3",
        title: "CSS3",
        lessons: 3,
        content:
          "Стилизация элементов, flexbox, grid, анимации и медиа-запросы.",
      },
      {
        id: "module4",
        title: "JavaScript основы",
        lessons: 3,
        content: "Базовый синтаксис, работа с DOM, обработка событий.",
      },
      {
        id: "module5",
        title: "React",
        lessons: 3,
        content: "Компоненты, состояния, props, хуки и маршрутизация.",
      },
    ],
  },
  {
    id: "graphic-design",
    title: "Графический дизайн",
    description: "Основы графического дизайна и работа с редакторами",
    totalLessons: 15,
    image: "course2.png", 
    category: "Дизайн",
    modules: [
      {
        id: "module1",
        title: "Основы дизайна",
        lessons: 3,
        content: "Теория цвета, композиция, типографика, принципы дизайна.",
      },
      {
        id: "module2",
        title: "Adobe Photoshop",
        lessons: 3,
        content: "Работа со слоями, масками, фильтрами, ретушь фотографий.",
      },
      {
        id: "module3",
        title: "Adobe Illustrator",
        lessons: 3,
        content:
          "Векторная графика, работа с кривыми Безье, создание логотипов.",
      },
      {
        id: "module4",
        title: "Figma",
        lessons: 3,
        content: "Прототипирование интерфейсов, компоненты, автолейаут.",
      },
      {
        id: "module5",
        title: "Брендинг",
        lessons: 3,
        content: "Создание айдентики, гайдлайны, презентация проектов.",
      },
    ],
  },
  {
    id: "python",
    title: "Python-разработчик",
    description:
      "Освойте самый востребованный язык программирования, на котором пишут сайты, приложения, игры и чат-боты.",
    totalLessons: 10,
    image: "course1.png", 
    category: "Программирование",
    modules: [
      {
        id: "module1",
        title: "Введение в Python",
        lessons: 2,
        content: "Установка Python, основы синтаксиса, работа с консолью.",
      },
      {
        id: "module2",
        title: "Основы языка Python",
        lessons: 2,
        content: "Переменные, типы данных, операторы, функции.",
      },
      {
        id: "module3",
        title: "Структуры данных",
        lessons: 2,
        content: "Списки, кортежи, словари, множества.",
      },
      {
        id: "module4",
        title: "ООП в Python",
        lessons: 2,
        content: "Классы, объекты, наследование, инкапсуляция.",
      },
      {
        id: "module5",
        title: "Python для веб-разработки",
        lessons: 2,
        content: "Flask, Django, работа с API.",
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript для начинающих",
    description: "Освойте самый популярный язык программирования в мире",
    totalLessons: 14,
    image: "javascript.jpg", 
    category: "Программирование",
    modules: [
      {
        id: "module1",
        title: "Введение в JavaScript",
        lessons: 3,
        content: "История JavaScript, включение скриптов в HTML, консоль.",
      },
      {
        id: "module2",
        title: "Основы JavaScript",
        lessons: 3,
        content: "Переменные, типы данных, операторы, функции.",
      },
      {
        id: "module3",
        title: "Работа с DOM",
        lessons: 3,
        content: "Выбор элементов, изменение стилей, создание элементов.",
      },
      {
        id: "module4",
        title: "События",
        lessons: 3,
        content: "Обработка событий, всплытие, делегирование.",
      },
      {
        id: "module5",
        title: "Асинхронный JavaScript",
        lessons: 2,
        content: "Промисы, async/await, работа с API.",
      },
    ],
  },
  {
    id: "nodejs",
    title: "Backend разработка на Node.js",
    description: "Научитесь создавать серверную часть веб-приложений",
    totalLessons: 13,
    image: "nodejs.png", 
    category: "Web-разработка",
    modules: [
      {
        id: "module1",
        title: "Введение в Node.js",
        lessons: 3,
        content: "Установка, npm, модули, файловая система.",
      },
      {
        id: "module2",
        title: "Express.js",
        lessons: 3,
        content: "Маршрутизация, шаблонизаторы, статические файлы.",
      },
      {
        id: "module3",
        title: "Работа с базами данных",
        lessons: 3,
        content: "MongoDB, Mongoose, SQL с Sequelize.",
      },
      {
        id: "module4",
        title: "Авторизация и аутентификация",
        lessons: 2,
        content: "JWT, сессии, OAuth.",
      },
      {
        id: "module5",
        title: "REST API",
        lessons: 2,
        content: "Создание API, документация, тестирование.",
      },
    ],
  },
];

// Функция для загрузки курсов в Firebase
export const migrateCoursesToFirebase = async () => {
  try {
    // Сначала проверим, не загружены ли уже курсы
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Если курсы уже есть в базе данных, не будем их дублировать
    if (!coursesSnapshot.empty) {
      console.log("Курсы уже существуют в базе данных");
      return;
    }

    // Загружаем каждый курс
    for (const course of oldCourses) {
      const { id, ...courseData } = course;
      await setDoc(doc(db, "courses", id), courseData);
      console.log(`Курс ${course.title} успешно загружен`);
    }

    console.log("Все курсы успешно перенесены в Firebase");
  } catch (error) {
    console.error("Ошибка при переносе курсов:", error);
    throw error;
  }
};
