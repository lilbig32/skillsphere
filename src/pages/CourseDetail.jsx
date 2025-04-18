import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [stageStatus, setStageStatus] = useState("idle");
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
      return 0;
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

      // --- Загрузка и обработка структурированного прогресса ---
      const allProgressData = await getUserProgress(userId);
      const courseProgressData = allProgressData[courseId]; // Получаем объект прогресса для этого курса

      let savedProgressNumber = 0;
      let isCompleted = false;

      if (courseProgressData) {
        // Проверяем, есть ли поле progress и оно число
        if (typeof courseProgressData.progress === "number") {
          savedProgressNumber = courseProgressData.progress;
        } else {
          // Обработка случая, если формат старый (просто число)
          // или если progress отсутствует/не число
          if (typeof courseProgressData === "number") {
            savedProgressNumber = courseProgressData;
            console.warn("Загружен старый формат прогресса (число)");
          } else {
            console.warn(
              "Поле progress отсутствует или имеет неверный формат в courseProgressData",
              courseProgressData
            );
          }
        }
        // Проверяем, завершен ли курс (наличие completedAt или completed === true)
        isCompleted =
          !!courseProgressData.completedAt ||
          courseProgressData.completed === true;
      }

      setProgress(savedProgressNumber); // В стейт progress кладем только число
      if (isCompleted) {
        setStageStatus("completed"); // Если курс завершен, ставим статус сразу
      }

      console.log(
        `[Progress] Загружен прогресс: ${(savedProgressNumber * 100).toFixed(
          1
        )}%, Завершен: ${isCompleted}`
      );
      // --------------------------------------------------------

      const loadedTotalStages = courseData.modules.reduce(
        (moduleSum, module) =>
          moduleSum +
          (module.lessons?.reduce(
            (lessonSum, lesson) => lessonSum + (lesson.stages?.length || 0),
            0
          ) || 0),
        0
      );
      console.log(`[Progress] Всего этапов в курсе: ${loadedTotalStages}`);

      // --- Логика восстановления остается прежней, но использует savedProgressNumber ---
      const targetStageNumber = Math.round(
        savedProgressNumber * loadedTotalStages
      );
      console.log(
        `[Progress] Целевой номер ПРОЙДЕННОГО этапа (округленный): ${targetStageNumber}`
      );

      let recoveredModuleIndex = 0;
      let recoveredLessonIndex = 0;
      let recoveredStageIndex = 0;
      let stagesPassed = 0;

      if (
        loadedTotalStages > 0 &&
        targetStageNumber > 0 &&
        targetStageNumber < loadedTotalStages
      ) {
        let stagesToFind = targetStageNumber;
        for (let m = 0; m < courseData.modules.length; m++) {
          const module = courseData.modules[m];
          if (!module.lessons) continue;
          let stagesInModule = module.lessons.reduce(
            (ls, l) => ls + (l?.stages?.length || 0),
            0
          );
          if (stagesPassed + stagesInModule > stagesToFind) {
            recoveredModuleIndex = m;
            for (let l = 0; l < module.lessons.length; l++) {
              const lesson = module.lessons[l];
              if (!lesson.stages) continue;
              if (stagesPassed + lesson.stages.length > stagesToFind) {
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
      }

      console.log(
        `[Progress] Восстановленная позиция для СЛЕДУЮЩЕГО этапа: Модуль ${recoveredModuleIndex}, Урок ${recoveredLessonIndex}, Этап ${recoveredStageIndex}`
      );

      setCurrentModuleIndex(recoveredModuleIndex);
      setCurrentLessonIndex(recoveredLessonIndex);
      setCurrentStageIndex(recoveredStageIndex);

      setSelectedAnswer(null);
      setTextInput("");
      setCodeInput("");
      // Устанавливаем статус completed только если isCompleted, иначе 'idle'
      if (!isCompleted) {
        setStageStatus("idle");
      }
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
      moveToNextStep();
    } else {
      // --- ЭТАП ПРАКТИКИ ---
      if (stageStatus === "idle") {
        // --- Нажатие "Проверить" ---
        let isCorrect = false;
        if (currentStage.type === "practice_mcq") {
           isCorrect = selectedAnswer === currentStage.correctAnswer;
        } else if (currentStage.type === "practice_fill_blank") {
           isCorrect =
            textInput.trim().toLowerCase() ===
            String(currentStage.correctAnswer).toLowerCase();
        } else if (currentStage.type === "practice_code_input") {
           const normalize = (str) => str.replace(/\s+/g, " ").trim();
          isCorrect =
            normalize(codeInput.trim()) ===
            normalize(String(currentStage.correctAnswer));
        } else {
          isCorrect = true;
        }

        setStageStatus(isCorrect ? "correct" : "incorrect");
        if (currentStage.explanation) setShowExplanation(true);

        if (isCorrect) {
          if (!currentStage.explanation) {
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
    if (!course || !user || stageStatus === "completed") return;

    // --- Определяем следующий этап и статус завершения ДО сохранения ---
    let nextModuleIndex = currentModuleIndex;
    let nextLessonIndex = currentLessonIndex;
    let nextStageIndex = currentStageIndex + 1;
    let courseCompleted = false;
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
    // --------------------------------------------------------------

    // --- Шаг 1: Рассчитываем и ГОТОВИМ данные для сохранения ---
    let progressDataToSave = {};
    if (totalStages > 0) {
      const progressNumber = Math.min(
        currentOverallStageNumber / totalStages,
        1
      );
      progressDataToSave.progress = progressNumber; // Всегда сохраняем число прогресса

      if (courseCompleted) {
        progressDataToSave.completedAt = new Date(); // Добавляем дату завершения
        progressDataToSave.progress = 1; // Убедимся, что прогресс 100%
        console.log(
          `[Progress] Курс завершен! Подготовка данных:`,
          progressDataToSave
        );
      } else {
        console.log(
          `[Progress] Подготовка данных для сохранения:`,
          progressDataToSave
        );
      }

      
      if (progress < progressDataToSave.progress) {
        setProgress(progressDataToSave.progress); // Обновляем стейт числом
        try {
          // Передаем весь объект progressDataToSave
          await updateUserProgress(user.uid, courseId, progressDataToSave);
        } catch (error) {
          console.error("Ошибка при сохранении прогресса:", error);
        }
      }
    }
    // ---------------------------------------------------------------------

    // --- Шаг 3: Обновляем стейты навигации и практики ---
    resetStageAttempt();
    setStageStatus(courseCompleted ? "completed" : "idle");

    if (!courseCompleted) {
      setCurrentModuleIndex(nextModuleIndex);
      setCurrentLessonIndex(nextLessonIndex);
      setCurrentStageIndex(nextStageIndex);
    } else {
      console.log("Курс завершен (стейт установлен)!");
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
        return (
          <div className="fill-blank-container">
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
  if (loading) return <div className="loading">Загрузка...</div>;
  if (!course)
    return <div className="error">Курс не найден или ошибка загрузки.</div>;
  if (!user) return <div className="error">Пользователь не найден.</div>;

  const displayProgressPercent = (progress * 100).toFixed(0);

  // --- Определение текста и доступности кнопки (логика остается, но используется только если НЕ completed) ---
  let buttonText = "Продолжить";
  let isButtonDisabled = false;
  if (currentStage && stageStatus !== "completed") {
    const isPractice = currentStage.type.startsWith("practice_");
    if (isPractice) {
      if (stageStatus === "idle") {
        buttonText = "Проверить";
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
        buttonText = "Далее";
      } else if (stageStatus === "incorrect") {
        buttonText = "Попробовать снова";
        isButtonDisabled = false;
      } else if (stageStatus === "answered") {
        buttonText = "Далее";
      }
    } // Для теории текст остается "Продолжить"
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

        {/* Модули и Текущий урок / Поздравление */}
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
                </div>
              </div>
            ))}
          </div>

          {/* --- Условный рендеринг: Урок ИЛИ Поздравление --- */}
          {stageStatus === "completed" ? (
            // --- БЛОК ПОЗДРАВЛЕНИЯ ---
            <div className="course-completed-container">
              <h2>🎉 Поздравляем! 🎉</h2>
              <p>Вы успешно завершили курс &quot;{course.title}&quot;!</p>
              <p>Отличная работа! Теперь вы готовы двигаться дальше.</p>
              <p>Сертификат о прохождении будет доступен в вашем профиле.</p>
              <Link to="/courses" className="back-to-courses-link">
                <button>К списку курсов</button>
              </Link>
            </div>
          ) : currentStage ? (
            // --- ОБЫЧНЫЙ БЛОК УРОКА ---
            <div className="current-lesson-container">
              <h2>Текущий урок</h2>
              <div className="lesson-card">
                {currentStage.title && <h3>{currentStage.title}</h3>}
                <div className="lesson-content">
                  {renderStageContent(currentStage)}
                  {(stageStatus === "correct" ||
                    stageStatus === "incorrect") && (
                    <div className="feedback-section">
                      <div className={`feedback-message ${stageStatus}`}>
                        {stageStatus === "correct" ? "Правильно!" : "Неверно"}
                      </div>
                      {showExplanation && currentStage.explanation && (
                        <div className="explanation">
                          <h4>Объяснение:</h4>
                          <p>{currentStage.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Кнопка навигации рендерится только если не completed */}
                <button
                  className={`complete-lesson ${
                    stageStatus === "incorrect" ? "incorrect-button" : ""
                  }`}
                  onClick={handleInteraction}
                  disabled={isButtonDisabled}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          ) : (
            <div>Этап не найден или произошла ошибка.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;
