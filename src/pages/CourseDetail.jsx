import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  getCourseById,
  getUserProgress,
  updateUserProgress,
} from "../services/courseService";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Импортируем изображения для курсов
import osnovi_program from "../assets/img/osnovi_program.jpg";
import web_razrabotka from "../assets/img/web_razrabotka.jpg";
import javascript from "../assets/img/javascript.jpg";
import nodejs from "../assets/img/nodejs.png";
import course1 from "../assets/img/course1.png";
import course2 from "../assets/img/course2.png";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Новые стейты для навигации по этапам ---
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // --- Стейты для практических этапов ---
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Индекс выбранного ответа
  const [textInput, setTextInput] = useState(""); // <-- Добавляем стейт для текстового ввода
  const [codeInput, setCodeInput] = useState(""); // <-- Добавляем стейт для Code Input
  const [stageStatus, setStageStatus] = useState("idle"); // idle, answered, correct, incorrect
  const [showExplanation, setShowExplanation] = useState(false);

  // Карта для изображений
  const courseImages = {
    "programming-basics": osnovi_program,
    "web-development": web_razrabotka,
    javascript: javascript,
    nodejs: nodejs,
    python: course1,
    "graphic-design": course2,
  };

  // --- Шаг 1: Считаем общее количество этапов ---
  const totalStages = useMemo(() => {
    if (!course || !course.modules) return 0;
    return course.modules.reduce(
      (moduleSum, module) =>
        moduleSum +
        (module.lessons?.reduce(
          (lessonSum, lesson) => lessonSum + (lesson.stages?.length || 0),
          0
        ) || 0),
      0
    );
  }, [course]);

  // --- Шаг 2: Считаем порядковый номер текущего этапа (начиная с 1) ---
  const currentOverallStageNumber = useMemo(() => {
    if (
      !course ||
      totalStages === 0 ||
      currentModuleIndex < 0 ||
      currentLessonIndex < 0 ||
      currentStageIndex < 0
    )
      return 0;
    let stageCount = 0;
    try {
      for (let m = 0; m < currentModuleIndex; m++) {
        if (!course.modules[m]?.lessons) continue;
        stageCount += course.modules[m].lessons.reduce(
          (ls, l) => ls + (l?.stages?.length || 0),
          0
        );
      }
      if (!course.modules[currentModuleIndex]?.lessons)
        return stageCount + currentStageIndex + 1; // Fallback
      for (let l = 0; l < currentLessonIndex; l++) {
        stageCount +=
          course.modules[currentModuleIndex].lessons[l]?.stages?.length || 0;
      }
      stageCount += currentStageIndex + 1;
    } catch (e) {
      console.error("Error calculating stage number:", e);
      return 0; // Return 0 on error
    }
    return stageCount;
  }, [
    course,
    currentModuleIndex,
    currentLessonIndex,
    currentStageIndex,
    totalStages,
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadCourseData(currentUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [courseId, navigate]);

  const loadCourseData = async (userId) => {
    setLoading(true);
    try {
      const courseData = await getCourseById(courseId);
      if (
        !courseData ||
        !courseData.modules ||
        !Array.isArray(courseData.modules)
      ) {
        console.error("Некорректная структура данных курса:", courseData);
        throw new Error("Некорректная структура курса");
      }
      setCourse(courseData);

      const progressData = await getUserProgress(userId);
      const savedProgress = progressData[courseId] || 0;
      setProgress(savedProgress);

      // --- Добавляем Логи ---
      console.log(
        `[Progress] Загружен сохраненный прогресс: ${(
          savedProgress * 100
        ).toFixed(1)}%`
      ); // <-- ЛОГ 1

      const loadedTotalStages = courseData.modules.reduce(
        (moduleSum, module) =>
          moduleSum +
          (module.lessons?.reduce(
            (lessonSum, lesson) => lessonSum + (lesson.stages?.length || 0),
            0
          ) || 0),
        0
      );
      console.log(`[Progress] Всего этапов в курсе: ${loadedTotalStages}`); // <-- ЛОГ 2

      // --- Корректируем расчет targetStageNumber ---
      const targetStageNumber = Math.round(savedProgress * loadedTotalStages);
      console.log(
        `[Progress] Целевой номер ПРОЙДЕННОГО этапа (округленный): ${targetStageNumber}`
      );

      let recoveredModuleIndex = 0;
      let recoveredLessonIndex = 0;
      let recoveredStageIndex = 0;
      let stagesPassed = 0;

      // Логика восстановления остается прежней, но будет искать позицию ПОСЛЕ targetStageNumber пройденных этапов
      if (
        loadedTotalStages > 0 &&
        targetStageNumber > 0 &&
        targetStageNumber < loadedTotalStages
      ) {
        // Нам нужно найти M/L/S для targetStageNumber + 1
        let stagesToFind = targetStageNumber; // Индекс следующего этапа
        for (let m = 0; m < courseData.modules.length; m++) {
          const module = courseData.modules[m];
          if (!module.lessons) continue;
          let stagesInModule = module.lessons.reduce(
            (ls, l) => ls + (l?.stages?.length || 0),
            0
          );
          if (stagesPassed + stagesInModule > stagesToFind) {
            // Если искомый этап в этом модуле
            recoveredModuleIndex = m;
            for (let l = 0; l < module.lessons.length; l++) {
              const lesson = module.lessons[l];
              if (!lesson.stages) continue;
              if (stagesPassed + lesson.stages.length > stagesToFind) {
                // Если искомый этап в этом уроке
                recoveredLessonIndex = l;
                recoveredStageIndex = stagesToFind - stagesPassed; // Индекс внутри урока
                break;
              }
              stagesPassed += lesson.stages.length;
            }
            break;
          }
          stagesPassed += stagesInModule;
        }
      } else if (targetStageNumber === loadedTotalStages) {
        setStageStatus("completed"); // Сразу ставим completed
        // Можно установить индексы на последний этап, если нужно его показать
      }

      console.log(
        `[Progress] Восстановленная позиция для СЛЕДУЮЩЕГО этапа: Модуль ${recoveredModuleIndex}, Урок ${recoveredLessonIndex}, Этап ${recoveredStageIndex}`
      );

      setCurrentModuleIndex(recoveredModuleIndex);
      setCurrentLessonIndex(recoveredLessonIndex);
      setCurrentStageIndex(recoveredStageIndex);

      // ... (сброс стейтов практики, КРОМЕ stageStatus, который установили выше) ...
      setSelectedAnswer(null);
      setTextInput("");
      setCodeInput("");
      // setStageStatus(savedProgress === 1 ? 'completed' : 'idle'); // <-- Убираем, ставится выше
      setShowExplanation(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных курса:", error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Получение текущих данных для рендеринга ---
  const getCurrentStageData = () => {
    if (
      !course ||
      !course.modules ||
      course.modules.length <= currentModuleIndex
    ) {
      return null;
    }
    const module = course.modules[currentModuleIndex];
    if (!module.lessons || module.lessons.length <= currentLessonIndex) {
      return null;
    }
    const lesson = module.lessons[currentLessonIndex];
    if (!lesson.stages || lesson.stages.length <= currentStageIndex) {
      return null;
    }
    return lesson.stages[currentStageIndex];
  };

  const currentStage = getCurrentStageData();

  // --- Добавляем функцию сброса попытки ---
  const resetStageAttempt = () => {
    setSelectedAnswer(null);
    setTextInput("");
    setCodeInput("");
    setStageStatus("idle");
    setShowExplanation(false);
  };

  // --- Упрощаем Обработчик взаимодействия ---
  const handleInteraction = () => {
    if (!currentStage || stageStatus === "completed") return;
    const isPractice = currentStage.type.startsWith("practice_");

    if (!isPractice) {
      // --- ЭТАП ТЕОРИИ ---
      // Убираем updateAndSaveProgress()
      moveToNextStep();
    } else {
      // --- ЭТАП ПРАКТИКИ ---
      if (stageStatus === "idle") {
        // --- Нажатие "Проверить" ---
        let isCorrect = false;
        // ... (логика проверки как была) ...
        if (currentStage.type === "practice_mcq") {
          /*...*/ isCorrect = selectedAnswer === currentStage.correctAnswer;
        } else if (currentStage.type === "practice_fill_blank") {
          /*...*/ isCorrect =
            textInput.trim().toLowerCase() ===
            String(currentStage.correctAnswer).toLowerCase();
        } else if (currentStage.type === "practice_code_input") {
          /*...*/ const normalize = (str) => str.replace(/\s+/g, " ").trim();
          isCorrect =
            normalize(codeInput.trim()) ===
            normalize(String(currentStage.correctAnswer));
        } else {
          isCorrect = true;
        }

        setStageStatus(isCorrect ? "correct" : "incorrect");
        if (currentStage.explanation) setShowExplanation(true);

        if (isCorrect) {
          // Убираем updateAndSaveProgress()
          if (!currentStage.explanation) {
            // Если нет объяснения, сразу переходим (прогресс сохранится в moveToNextStep)
            moveToNextStep();
          }
        }
      } else if (stageStatus === "correct") {
        // --- Нажатие "Далее" после ПРАВИЛЬНОГО ответа ---
        moveToNextStep();
      } else if (stageStatus === "incorrect") {
        // --- Нажатие "Попробовать снова" ---
        resetStageAttempt();
      }
    }
  };

  // --- Возвращаем логику прогресса в Функция перехода ---
  const moveToNextStep = async () => {
    // <-- Делаем async
    if (!course || !user || stageStatus === "completed") return;

    // --- Шаг 1: Рассчитываем и сохраняем прогресс для ЗАВЕРШЕННОГО этапа ---
    if (totalStages > 0) {
      const progressToSave = Math.min(
        currentOverallStageNumber / totalStages,
        1
      );
      console.log(
        `[Progress] Сохранение прогресса для завершенного этапа ${currentOverallStageNumber}/${totalStages} = ${(
          progressToSave * 100
        ).toFixed(1)}%`
      ); // <-- ЛОГ

      // Обновляем стейт и сохраняем в Firebase, если прогресс увеличился
      if (progress < progressToSave) {
        setProgress(progressToSave);
        try {
          await updateUserProgress(user.uid, courseId, progressToSave);
        } catch (error) {
          console.error("Ошибка при сохранении прогресса:", error);
        }
      }
    }
    // ---------------------------------------------------------------------

    // --- Шаг 2: Определяем следующий этап ---
    let nextModuleIndex = currentModuleIndex;
    let nextLessonIndex = currentLessonIndex;
    let nextStageIndex = currentStageIndex + 1;
    let courseCompleted = false;
    // ... (логика определения courseCompleted как была) ...
    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons?.[currentLessonIndex];
    if (!currentLesson) return;
    if (nextStageIndex >= currentLesson.stages.length) {
      nextLessonIndex = currentLessonIndex + 1;
      nextStageIndex = 0;
      if (nextLessonIndex >= currentModule.lessons.length) {
        nextModuleIndex = currentModuleIndex + 1;
        nextLessonIndex = 0;
        if (nextModuleIndex >= course.modules.length) {
          courseCompleted = true;
        }
      }
    }

    // --- Шаг 3: Обновляем стейты навигации и практики ---
    resetStageAttempt(); // Используем reset для сброса практики
    // setSelectedAnswer(null);
    // setTextInput('');
    // setCodeInput('');
    // setShowExplanation(false);
    setStageStatus(courseCompleted ? "completed" : "idle"); // Устанавливаем статус для следующего этапа

    if (!courseCompleted) {
      setCurrentModuleIndex(nextModuleIndex);
      setCurrentLessonIndex(nextLessonIndex);
      setCurrentStageIndex(nextStageIndex);
    } else {
      console.log("Курс завершен!");
      // Прогресс 100% уже должен был сохраниться на предыдущем шаге
    }
  };

  // --- Обработчик выбора ответа ---
  const handleSelectAnswer = (index) => {
    if (stageStatus === "idle") {
      // Позволяем менять ответ только до проверки
      setSelectedAnswer(index);
    }
  };

  // --- Функция рендеринга контента этапа ---
  const renderStageContent = (stage) => {
    if (!stage) return null;

    switch (stage.type) {
      case "theory":
        return <div dangerouslySetInnerHTML={{ __html: stage.content }} />;

      case "practice_mcq":
        return (
          <div>
            <p>{stage.content}</p>
            <div className="mcq-options">
              {stage.options.map((option, index) => {
                let buttonClass = "mcq-option-button";
                if (stageStatus !== "idle") {
                  if (index === stage.correctAnswer) buttonClass += " correct";
                  else if (index === selectedAnswer)
                    buttonClass += " incorrect";
                } else if (index === selectedAnswer) buttonClass += " selected";

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={stageStatus !== "idle"}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "practice_fill_blank": {
        // Убираем логику со split и map
        // Просто выводим контент и одно поле ввода под ним
        return (
          <div className="fill-blank-container">
            {/* Выводим текст вопроса (можно удалить '___' если они не нужны для отображения) */}
            <p>{String(stage.content).replace("___", "")}</p>
            <input
              type="text"
              className={`fill-blank-input ${
                stageStatus === "correct"
                  ? "correct-input"
                  : stageStatus === "incorrect"
                  ? "incorrect-input"
                  : ""
              }`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={stageStatus !== "idle"}
              aria-label="Введите ответ"
            />
          </div>
        );
      }

      case "practice_code_input":
        return (
          <div className="code-input-container">
            <p>{stage.content}</p>
            <textarea
              className={`code-input-textarea ${
                stageStatus === "correct"
                  ? "correct-input"
                  : stageStatus === "incorrect"
                  ? "incorrect-input"
                  : ""
              }`}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              disabled={stageStatus !== "idle"}
              rows={5} // Примерное кол-во строк
              aria-label="Введите код"
            />
          </div>
        );

      default:
        return <p>Неизвестный тип этапа: {stage.type}</p>;
    }
  };

  // --- Рендеринг ---
  if (loading) return <div className="loading">Загрузка...</div>; // TODO: Заменить на скелетон
  if (!course)
    return <div className="error">Курс не найден или ошибка загрузки.</div>;
  if (!user) return <div className="error">Пользователь не найден.</div>; // На всякий случай

  // --- Рассчитываем отображаемый процент НАПРЯМУЮ из стейта progress ---
  const displayProgressPercent = (progress * 100).toFixed(0);

  // --- Обновляем определение текста и доступности кнопки ---
  let buttonText = "Продолжить";
  let isButtonDisabled = false;
  if (currentStage) {
    const isPractice = currentStage.type.startsWith("practice_");
    if (isPractice) {
      if (stageStatus === "idle") {
        buttonText = "Проверить";
        // ... (логика isButtonDisabled для разных типов практики как была) ...
        if (currentStage.type === "practice_mcq") {
          isButtonDisabled = selectedAnswer === null;
        } else if (currentStage.type === "practice_fill_blank") {
          isButtonDisabled = textInput.trim() === "";
        } else if (currentStage.type === "practice_code_input") {
          isButtonDisabled = codeInput.trim() === "";
        } else {
          isButtonDisabled = true;
        }
      } else if (stageStatus === "correct") {
        buttonText = "Далее"; // Кнопка "Далее" только после правильного ответа
      } else if (stageStatus === "incorrect") {
        buttonText = "Попробовать снова"; // Кнопка для сброса попытки
        isButtonDisabled = false; // Всегда активна после ошибки
      } else if (stageStatus === "answered") {
        buttonText = "Далее"; // Если тип практики неизвестен, но отвечен
      }
    } else if (stageStatus === "completed") {
      buttonText = "Курс пройден";
      isButtonDisabled = true;
    }
    // Для теории (не isPractice) текст кнопки остается "Продолжить"
  }

  return (
    <>
      <Header />
      <div className="course-detail-container">
        <h1>{course.title}</h1>

        {/* Информация о курсе и прогрессе */}
        <div className="course-header">
          <div className="course-image-container">
            <img
              src={courseImages[courseId] || course1}
              alt={course.title}
              className="course-detail-image"
            />
          </div>

          <div className="course-info-container">
            <div className="course-description">{course.description}</div>

            <div className="course-progress-container">
              <h3>Ваш прогресс</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${displayProgressPercent}%` }}
                />
              </div>
              <span>{displayProgressPercent}% выполнено</span>
            </div>
          </div>
        </div>

        {/* Модули и текущий урок */}
        <div className="course-section">
          <div className="modules-list">
            <h2>Модули курса</h2>
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${
                  currentModuleIndex === index ? "active" : ""
                }`}
              >
                <div className="module-title">
                  <h3>
                    {index + 1}. {module.title}
                  </h3>
                  {/* Убираем счетчик уроков */}
                  {/* 
                  <span className="lesson-count">
                    {module.lessons ? module.lessons.length : 0} урок(ов)
                  </span>
                  */}
                </div>
              </div>
            ))}
          </div>

          {/* Текущий урок */}
          {currentStage ? (
            <div className="current-lesson-container">
              <h2>Текущий урок</h2>
              <div className="lesson-card">
                {/* Отображаем Заголовок этапа, если он есть */}
                {currentStage.title && <h3>{currentStage.title}</h3>}

                {/* --- Контент этапа (пока только теория) --- */}
                <div className="lesson-content">
                  {/* --- Рендерим контент через новую функцию --- */}
                  {renderStageContent(currentStage)}

                  {/* --- Блок обратной связи (Сообщение + Объяснение) --- */}
                  {(stageStatus === "correct" ||
                    stageStatus === "incorrect") && (
                    <div className="feedback-section">
                      {" "}
                      {/* Опциональный контейнер */}
                      {/* --- Сообщение Правильно/Неверно --- */}
                      <div className={`feedback-message ${stageStatus}`}>
                        {stageStatus === "correct" ? "Правильно!" : "Неверно"}
                      </div>
                      {/* --- Объяснение --- */}
                      {showExplanation && currentStage.explanation && (
                        <div className="explanation">
                          <h4>Объяснение:</h4>
                          <p>{currentStage.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* --- Кнопка навигации --- */}
                {stageStatus !== "completed" && (
                  <button
                    className={`complete-lesson ${
                      stageStatus === "incorrect" ? "incorrect-button" : ""
                    }`}
                    onClick={handleInteraction}
                    disabled={isButtonDisabled}
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>Этап не найден или курс завершен.</div> // Сообщение, если что-то пошло не так
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;
