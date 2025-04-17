import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDoc,
} from "firebase/firestore";
// import { auth } from "../firebase"; // <-- Убираем неиспользуемый импорт

// Этот скрипт создаст структуру курсов с модулями, уроками и этапами
// Запускать его нужно только один раз для инициализации

// Пример данных курса с модулями, уроками и этапами
const coursesData = [
  {
    id: "programming-basics", // ID курса для ссылок
    title: "Основы программирования",
    description:
      "Изучите фундаментальные концепции программирования на примере JavaScript",
    category: "Программирование",
    thumbnail: "programming-basics.jpg",
    totalLessons: 15, // Общее количество уроков для расчета прогресса
    modules: [
      {
        id: "module-1",
        title: "Введение в программирование",
        description: "Изучите что такое программирование и основные концепции",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Что такое программирование?",
            description: "Знакомство с миром программирования",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Что такое программирование",
                content:
                  "Программирование — это процесс создания компьютерных программ с помощью языков программирования. По сути, это способ общения с компьютером, чтобы он выполнял нужные нам задачи.",
              },
              {
                order: 1,
                type: "practice_mcq", // Multiple Choice Question
                title: "Проверка понимания",
                content:
                  "Что из перечисленного НЕ является языком программирования?",
                options: ["JavaScript", "Python", "HTML", "C++"],
                correctAnswer: 2, // Индекс правильного ответа (HTML)
                explanation:
                  "HTML — это язык разметки, который используется для создания структуры веб-страниц, а не язык программирования.",
              },
              {
                order: 2,
                type: "theory",
                title: "Зачем нужно программирование",
                content:
                  "Программирование позволяет создавать программы и приложения, которые решают конкретные задачи. Благодаря программированию возможно создание веб-сайтов, мобильных приложений, игр и многого другого.",
              },
              {
                order: 3,
                type: "practice_fill_blank",
                title: "Заполните пропуск",
                content:
                  "С помощью программирования можно создавать _______, игры и приложения.",
                correctAnswer: "веб-сайты",
                explanation:
                  "Программирование используется для создания различных программных продуктов, включая веб-сайты.",
              },
              {
                order: 4,
                type: "theory",
                title: "Как работает программа",
                content:
                  "Программы — это набор инструкций, которые компьютер выполняет последовательно. Компьютер не понимает человеческий язык, поэтому инструкции записываются на языках программирования, которые затем преобразуются в машинный код.",
              },
              {
                order: 5,
                type: "practice_code_input",
                title: "Ваш первый код",
                content:
                  "Напишите команду для вывода текста 'Привет, мир!' на JavaScript",
                correctAnswer: "console.log('Привет, мир!');",
                explanation:
                  "console.log() — это функция, которая выводит текст или значение переменной в консоль.",
              },
              {
                order: 6,
                type: "theory",
                title: "Подведем итоги",
                content:
                  "В этом уроке мы познакомились с программированием, узнали что это такое и зачем оно нужно. В следующих уроках мы углубимся в детали и начнем писать больше кода.",
              },
            ],
          },
          {
            id: "lesson-1-2",
            title: "Переменные и типы данных",
            description:
              "Изучите, что такое переменные и какие бывают типы данных",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Что такое переменные?",
                content:
                  "Переменные - это именованные контейнеры для хранения данных в программе. Представьте их как коробки с этикетками, куда можно что-то положить.",
              },
              {
                order: 1,
                type: "theory",
                title: "Объявление переменных (let, const, var)",
                content:
                  "В JavaScript переменные объявляются с помощью ключевых слов: `let` (для изменяемых переменных), `const` (для констант, которые нельзя переназначить) и `var` (старый способ, лучше использовать `let` или `const`).\nПример: `let age = 25; const PI = 3.14;`",
              },
              {
                order: 2,
                type: "practice_mcq",
                title: "Проверка: Объявление",
                content:
                  "Какое ключевое слово используется для объявления переменной, значение которой НЕЛЬЗЯ изменить позже?",
                options: ["var", "let", "const", "set"],
                correctAnswer: 2,
                explanation:
                  "`const` используется для объявления констант, значения которых не могут быть переназначены после инициализации.",
              },
              {
                order: 3,
                type: "theory",
                title: "Типы данных: Числа и Строки",
                content:
                  "Основные типы данных: `Number` (числа, например, `10`, `3.14`) и `String` (строки текста, например, `'Привет'` или `\"Мир\"`). Строки заключаются в одинарные или двойные кавычки.",
              },
              {
                order: 4,
                type: "practice_fill_blank",
                title: "Проверка: Типы данных",
                content:
                  "Тип данных для текста, как 'Hello', называется ______.",
                correctAnswer: "String",
                explanation:
                  "Строки (String) используются для представления текстовых данных.",
              },
              {
                order: 5,
                type: "theory",
                title: "Типы данных: Булевы значения",
                content:
                  "Булев тип (`Boolean`) имеет только два значения: `true` (истина) и `false` (ложь). Они часто используются в условиях.",
              },
              {
                order: 6,
                type: "practice_code_input",
                title: "Практика: Объявление",
                content:
                  "Объявите константу `MAX_USERS` и присвойте ей числовое значение `100`.",
                correctAnswer: "const MAX_USERS = 100;",
                explanation:
                  "Используем `const` для константы, `MAX_USERS` как имя и присваиваем `100`.",
              },
              {
                order: 7,
                type: "theory",
                title: "Итог",
                content:
                  "Мы изучили переменные (`let`, `const`), числа (`Number`), строки (`String`) и булевы значения (`Boolean`). Это основа для работы с данными в JavaScript!",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "Основные конструкции",
        description:
          "Изучите основные конструкции программирования: условия и циклы",
        lessons: [
          {
            id: "lesson-2-1",
            title: "Условные операторы",
            description:
              "Изучите как принимать решения в коде с помощью условий",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Оператор if",
                content: "Контент для теории про if...",
              },
              {
                order: 1,
                type: "practice_mcq",
                title: "Проверка if",
                content: "Вопрос по if...",
                options: [],
                correctAnswer: 0,
                explanation: "...",
              },
              // ... Добавить еще этапы ...
            ],
          },
          {
            id: "lesson-2-2",
            title: "Циклы",
            description: "Повторение действий с помощью циклов",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Цикл for",
                content: "Контент для теории про for...",
              },
              // ... Добавить еще этапы ...
            ],
          },
        ],
      },
      // Добавьте больше модулей
    ],
  },
  // Второй курс (можете добавить больше курсов)
  {
    id: "web-development",
    title: "Веб-разработка",
    description:
      "Научитесь создавать современные веб-сайты с помощью HTML, CSS и JavaScript",
    category: "Web-разработка",
    thumbnail: "web-development.jpg",
    totalLessons: 20,
    modules: [
      {
        id: "module-1",
        title: "HTML Основы",
        lessons: [
          {
            id: "l1-1",
            title: "Структура документа",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория по структуре HTML...",
              },
            ],
          },
          {
            id: "l1-2",
            title: "Теги и атрибуты",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория по тегам...",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "CSS Стилизация",
        lessons: [
          { id: "l2-1", title: "Селекторы и свойства", stages: [] },
          { id: "l2-2", title: "Flexbox", stages: [] },
        ],
      },
      {
        id: "module-3",
        title: "JavaScript Введение",
        lessons: [{ id: "l3-1", title: "DOM Манипуляции", stages: [] }],
      },
    ],
  },
  // --- Добавляем недостающие курсы ---
  {
    id: "javascript",
    title: "Углубленный JavaScript",
    description: "Погрузитесь в продвинутые концепции JavaScript",
    category: "Программирование",
    thumbnail: "javascript.jpg",
    totalLessons: 25, // Примерное количество
    modules: [
      {
        id: "module-1",
        title: "Функции",
        lessons: [
          {
            id: "l1-1",
            title: "Замыкания",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория про замыкания...",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "Асинхронность",
        lessons: [
          { id: "l2-1", title: "Promise", stages: [] },
          { id: "l2-2", title: "Async/Await", stages: [] },
        ],
      },
    ],
  },
  {
    id: "nodejs",
    title: "Node.js для начинающих",
    description: "Создание серверных приложений на Node.js",
    category: "Программирование",
    thumbnail: "nodejs.png",
    totalLessons: 18, // Примерное количество
    modules: [
      {
        id: "module-1",
        title: "Введение в Node.js",
        lessons: [
          {
            id: "l1-1",
            title: "Модули npm",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория про npm...",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "Express.js",
        lessons: [{ id: "l2-1", title: "Маршрутизация", stages: [] }],
      },
    ],
  },
  {
    id: "python",
    title: "Python для анализа данных",
    description: "Основы Python и библиотеки Pandas, NumPy",
    category: "Программирование",
    thumbnail: "course1.png", // Используем существующую картинку
    totalLessons: 30, // Примерное количество
    modules: [
      {
        id: "module-1",
        title: "Основы Python",
        lessons: [
          {
            id: "l1-1",
            title: "Типы данных",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория про типы данных Python...",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "Pandas",
        lessons: [{ id: "l2-1", title: "DataFrame", stages: [] }],
      },
    ],
  },
  {
    id: "graphic-design",
    title: "Графический дизайн",
    description: "Основы дизайна и работа с Figma",
    category: "Дизайн",
    thumbnail: "course2.png", // Используем существующую картинку
    totalLessons: 15, // Примерное количество
    modules: [
      {
        id: "module-1",
        title: "Введение в Figma",
        lessons: [
          {
            id: "l1-1",
            title: "Интерфейс",
            stages: [
              {
                order: 0,
                type: "theory",
                title: "Заглушка",
                content: "Здесь будет теория про интерфейс Figma...",
              },
            ],
          },
        ],
      },
      {
        id: "module-2",
        title: "Композиция",
        lessons: [{ id: "l2-1", title: "Сетка", stages: [] }],
      },
    ],
  },
];

// Функция для инициализации базы данных
const initializeDatabase = async () => {
  const db = getFirestore();
  console.log("Попытка инициализации базы данных...");

  // --- ТЕСТ: Попытка чтения перед записью ---
  try {
    console.log("Тестовое чтение документа courses/programming-basics...");
    const testDocRef = doc(db, "courses", "programming-basics");
    const testDocSnap = await getDoc(testDocRef);
    if (testDocSnap.exists()) {
      console.log(
        "Тестовое чтение успешно, документ существует.",
        testDocSnap.data()
      );
    } else {
      console.log("Тестовое чтение успешно, документ не существует.");
    }
  } catch (readError) {
    console.error("!!! ОШИБКА при тестовом чтении:", readError);
  }


  try {
    console.log("Подготовка батча для записи...");
    const batch = writeBatch(db); // Используем батч для групповой записи

    // Добавляем каждый курс
    for (const course of coursesData) {
      const courseRef = doc(collection(db, "courses"), course.id);
      batch.set(courseRef, {
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail,
        totalLessons: course.totalLessons,
        modules: course.modules,
      });
      console.log(`Подготовлен курс: ${course.title}`);
    }

    // Записываем все изменения в базу данных
    console.log("Отправка батча в Firebase...");
    await batch.commit();
    console.log("База данных курсов успешно инициализирована!");
  } catch (error) {
    // Ловим ошибку записи
    console.error("!!! ОШИБКА при записи данных:", error); // Изменяем сообщение
    // Не выбрасываем ошибку дальше, чтобы увидеть лог чтения
    // throw error;
  }
};

// Экспортируем функцию
export default initializeDatabase;
