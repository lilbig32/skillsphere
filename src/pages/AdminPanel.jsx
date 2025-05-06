import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminStatus } from "../services/authService";
import { getAllUserProgressData } from "../services/adminService";
import { getAllCourses } from "../services/courseService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import initializeDatabase from "../scripts/initializeCourses";

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Флаг, что пользователь - админ
  const [loadingAuth, setLoadingAuth] = useState(true); // Загрузка проверки прав
  const [usersProgress, setUsersProgress] = useState([]); // Данные о прогрессе пользователей
  const [allCourses, setAllCourses] = useState([]); // Состояние для всех курсов
  const [loadingData, setLoadingData] = useState(false); // Загрузка данных прогресса
  const [dataError, setDataError] = useState(null); // Ошибка загрузки данных
  const navigate = useNavigate();

  // Состояния для инициализации базы данных (перенесены из AdminInitialize)
  const [initStatus, setInitStatus] = useState("idle");
  const [initError, setInitError] = useState(null);

  // Эффект для проверки прав админа
  useEffect(() => {
    setLoadingAuth(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Пользователь найден, проверяем права админа...");
        const isAdminResult = await checkAdminStatus();
        setIsAdmin(isAdminResult);

        if (!isAdminResult) {
          console.warn("Доступ запрещен: пользователь не является админом.");
          navigate("/");
        } else {
          setLoadingAuth(false);
        }
      } else {
        console.warn(
          "Доступ к админ-панели запрещен: пользователь не аутентифицирован."
        );
        navigate("/login");
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Эффект для загрузки данных ПОСЛЕ подтверждения прав админа
  useEffect(() => {
    if (!loadingAuth && isAdmin) {
      const fetchData = async () => {
        setLoadingData(true);
        setDataError(null);
        try {
          const [progressData, coursesData] = await Promise.all([
            getAllUserProgressData(),
            getAllCourses(),
          ]);
          setUsersProgress(progressData);
          setAllCourses(coursesData);
          console.log("AdminPanel: Курсы загружены:", coursesData);
        } catch (error) {
          console.error(
            "Ошибка в компоненте AdminPanel при загрузке данных:",
            error
          );
          setDataError("Не удалось загрузить данные пользователей или курсов.");
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [loadingAuth, isAdmin]);

  // --- Группировка данных прогресса по пользователям ---
  const groupedUserData = useMemo(() => {
    if (usersProgress.length === 0) return {};

    const grouped = {};
    usersProgress.forEach((progressData) => {
      const userId = progressData.userId;
      if (!userId) return; // Пропускаем записи без userId

      if (!grouped[userId]) {
        grouped[userId] = {
          userId: userId,
          displayName: progressData.displayName || "(нет данных)",
          email: progressData.email || "(нет данных)",
          progressRecords: [],
        };
      } else {
        // Если пользователь уже есть, обновляем имя/email, если они появились
        if (
          progressData.displayName &&
          grouped[userId].displayName === "(нет данных)"
        ) {
          grouped[userId].displayName = progressData.displayName;
        }
        if (progressData.email && grouped[userId].email === "(нет данных)") {
          grouped[userId].email = progressData.email;
        }
      }
      // Добавляем текущую запись прогресса (по конкретному курсу) пользователю
      grouped[userId].progressRecords.push(progressData);
    });
    console.log("AdminPanel: Данные сгруппированы:", grouped);
    return grouped;
  }, [usersProgress]);

  // Функция для инициализации базы данных (перенесена из AdminInitialize)
  const handleInitializeDatabase = async () => {
    try {
      setInitStatus("loading");
      setInitError(null); // Сбрасываем предыдущую ошибку
      await initializeDatabase();
      setInitStatus("success");
    } catch (err) {
      setInitError(err.message);
      setInitStatus("error");
      console.error("Ошибка при инициализации БД из AdminPanel:", err);
    }
  };

  if (loadingAuth) {
    return (
      <>
        <Header />
        <div
          className="page-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Проверка прав доступа...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  console.log("AdminPanel: Рендеринг с usersProgress:", usersProgress);

  console.log(
    "AdminPanel: Проверка usersProgress.length:",
    usersProgress.length
  );

  // Если админ, показываем панель
  return (
    <>
      <Header />
      <div
        className="page-container"
        style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1>Админ-панель</h1>

        {/* Блок инициализации базы данных */}
        <div className="admin-init-container" style={{ marginBottom: "30px" }}>
          {" "}
          <div className={`init-status ${initStatus}`}>
            {" "}
            {initStatus === "idle" && (
              <div>
                <h2>Инициализация базы данных курсов</h2>
                <p>
                  Нажмите кнопку ниже, чтобы добавить/обновить курсы в базе
                  данных.
                </p>
                <p>
                  <strong>Внимание:</strong> Это перезапишет существующие данные
                  курсов!
                </p>
                <button onClick={handleInitializeDatabase}>
                  Инициализировать/Обновить базу данных курсов
                </button>
              </div>
            )}
            {initStatus === "loading" && (
              <div>
                <div className="spinner"></div> <h2>Инициализация...</h2>
                <p>Пожалуйста, подождите. Это может занять несколько секунд.</p>
              </div>
            )}
            {initStatus === "success" && (
              <div>
                <h2>Успех!</h2>
                <p>
                  База данных курсов была успешно инициализирована/обновлена.
                </p>
                <button onClick={() => setInitStatus("idle")}>
                  Закрыть сообщение
                </button>
              </div>
            )}
            {initStatus === "error" && (
              <div>
                <h2>Ошибка!</h2>
                <p>
                  Произошла ошибка при инициализации/обновлении базы данных:
                </p>
                <p>{initError}</p>
                <button onClick={() => setInitStatus("idle")}>
                  Попробовать снова
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Конец блока инициализации */}

        {/* Руководство для администратора - Новый блок */}
        <div
          className="admin-guide-section"
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
            padding: "25px",
            marginTop: "30px",
            marginBottom: "30px",
            // border: '1px solid #e0e0e0', // Убираем, т.к. есть тень
          }}
        >
          <h3
            style={{
              fontFamily: "montserat_bold, sans-serif",
              color: "var(--text-dark, #333)",
              marginTop: "0", // Убираем верхний отступ у h3, т.к. есть padding у родителя
              marginBottom: "20px",
            }}
          >
            Руководство: Как обновлять курсы
          </h3>
          <ol
            style={{
              textAlign: "left",
              paddingLeft: "20px",
              listStyleType: "decimal",
            }}
          >
            <li
              style={{ marginBottom: "15px", color: "#555", lineHeight: "1.6" }}
            >
              <strong>Найдите файл с данными:</strong> Все данные курсов,
              включая модули, уроки и этапы, хранятся в файле:
              <code
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  color: "#555",
                  fontFamily: "monospace",
                }}
              >
                src/scripts/initializeCourses.js
              </code>
              .
            </li>
            <li
              style={{ marginBottom: "15px", color: "#555", lineHeight: "1.6" }}
            >
              <strong>Внесите изменения:</strong> Откройте этот файл и внесите
              необходимые правки непосредственно в его код (например, измените
              тексты, добавьте новые уроки, скорректируйте правильные ответы и
              т.д.).
            </li>
            <li
              style={{ marginBottom: "15px", color: "#555", lineHeight: "1.6" }}
            >
              <strong>Примените изменения:</strong> После сохранения изменений в
              файле
              <code
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  color: "#555",
                  fontFamily: "monospace",
                }}
              >
                initializeCourses.js
              </code>
              , вернитесь в эту админ-панель и нажмите кнопку «
              <strong>Инициализировать/Обновить базу данных курсов</strong>»
              выше.
            </li>
            <li style={{ color: "#555", lineHeight: "1.6" }}>
              <strong>Внимание:</strong> Эта операция полностью перезаписывает
              данные о курсах в базе данных на основе содержимого файла
              <code
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  color: "#555",
                  fontFamily: "monospace",
                }}
              >
                initializeCourses.js
              </code>
              . Убедитесь, что все изменения в файле корректны перед
              инициализацией.
            </li>
          </ol>
        </div>
        {/* Конец блока руководства */}

        {/* Блок отображения данных пользователей */}
        {loadingData && <p>Загрузка данных...</p>}
        {dataError && <p className="error">{dataError}</p>}

        {!loadingData && !dataError && (
          <div>
            <h2>Пользователи и их прогресс</h2>
            {Object.keys(groupedUserData).length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {/* Проходим по каждому пользователю в сгруппированных данных */}
                {Object.values(groupedUserData).map((userData) => {
                  // Ищем информацию о курсах, чтобы получить названия
                  const coursesMap = allCourses.reduce((acc, course) => {
                    acc[course.id] = course;
                    return acc;
                  }, {});

                  return (
                    <li
                      key={userData.userId}
                      className="admin-user-card"
                      style={{
                        border: "1px solid #eee",
                        marginBottom: "20px",
                        padding: "20px",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            UID: {userData.userId}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <h4>Прогресс по курсам:</h4>
                          {userData.progressRecords.length > 0 ? (
                            <ul
                              style={{
                                listStyle: "none",
                                paddingLeft: "0",
                                marginTop: "10px",
                              }}
                            >
                              {/* Проходим по прогрессу каждого курса для этого пользователя */}
                              {userData.progressRecords.map((record) => {
                                const courseInfo = coursesMap[record.courseId];
                                const progressPercent =
                                  (record.progress || 0) * 100;
                                const isCompleted = !!record.completedAt;

                                return (
                                  <li
                                    key={record.id || record.courseId}
                                    className="admin-course-progress-item"
                                    style={{
                                      marginBottom: "15px",
                                      paddingBottom: "15px",
                                      borderBottom: "1px dashed #eee",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      <strong>
                                        {courseInfo?.title || record.courseId}
                                      </strong>
                                      {/* Кнопка сертификата */}
                                      {isCompleted && (
                                        <Link
                                          to={`/courses/${record.courseId}`}
                                        ></Link>
                                      )}
                                    </div>
                                    <div
                                      className="progress-bar"
                                      style={{
                                        background: "#e0e0e0",
                                        borderRadius: "10px",
                                        height: "10px",
                                        overflow: "hidden",
                                        width: "100%",
                                      }}
                                    >
                                      <div
                                        className="progress"
                                        style={{
                                          background: "var(--primary-color)",
                                          height: "100%",
                                          width: `${progressPercent.toFixed(
                                            0
                                          )}%`,
                                          borderRadius: "10px",
                                        }}
                                      ></div>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "0.85em",
                                        color: "#555",
                                        display: "block",
                                        textAlign: "right",
                                        marginTop: "3px",
                                      }}
                                    >
                                      {progressPercent.toFixed(0)}%
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p>Нет активных курсов.</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Нет данных о пользователях с прогрессом.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;
