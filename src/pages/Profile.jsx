import { useEffect, useState, useMemo } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllCourses, getUserProgress } from "../services/courseService";
import jsPDF from "jspdf";
import logoSrc from "../assets/img/logo.png";

// --- Вспомогательная функция для конвертации ArrayBuffer в Base64 ---
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
// ------------------------------------------------------------------

// --- Новая вспомогательная функция для ArrayBuffer -> Base64 Data URL ---
function arrayBufferToDataURL(buffer, mimeType) {
  const base64String = arrayBufferToBase64(buffer);
  return `data:${mimeType};base64,${base64String}`;
}
// ---------------------------------------------------------------------

const Profile = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Функция для получения инициалов
  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return email ? email[0].toUpperCase() : "U";
  };

  // Функция для получения случайного цвета на основе email
  const getRandomColor = (seed) => {
    const colors = [
      "#4A90E2", // синий
      "#50E3C2", // бирюзовый
      "#B8FF00", // зеленый
      "#F5A623", // оранжевый
      "#7ED321", // светло-зеленый
      "#C471ED", // фиолетовый
    ];
    const index = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Создаем стиль для аватара с помощью useMemo для оптимизации
  const avatarStyle = useMemo(() => {
    if (!user) return {};
    const backgroundColor = getRandomColor(user.email || "");
    return {
      backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "2.5rem",
      fontWeight: "bold",
      width: "100%",
      height: "100%",
    };
  }, [user]);

  // Загрузка курсов и прогресса
  const loadUserData = async (currentUser) => {
    try {
      setLoading(true);

      const coursesData = await getAllCourses();
      setCourses(coursesData);

      // Получаем прогресс пользователя
      if (currentUser) {
        const progressData = await getUserProgress(currentUser.uid);
        setUserProgress(progressData);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadUserData(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  // --- Функция генерации сертификата (снова async) ---
  const generateCertificate = async (
    course,
    currentUser,
    completionTimestamp
  ) => {
    if (!currentUser || !course || !completionTimestamp) return;

    console.log("Начало генерации сертификата...");

    try {
      console.log("Загрузка шрифтов из /fonts/...");
      const fontRegularUrl = "/fonts/Montserrat-Regular.ttf";
      const fontBoldUrl = "/fonts/Montserrat-Bold.ttf";

      // --- Загрузка логотипа ---
      console.log("Загрузка логотипа...");
      const logoResponse = await fetch(logoSrc);
      if (!logoResponse.ok) {
        throw new Error(`Не удалось загрузить логотип: ${logoResponse.status}`);
      }
      console.log("Логотип успешно запрошен.");
      const logoBuffer = await logoResponse.arrayBuffer();
      const logoMimeType =
        logoResponse.headers.get("content-type") || "image/png";
      const logoBase64 = arrayBufferToDataURL(logoBuffer, logoMimeType);
      console.log("Логотип конвертирован в Base64 Data URL.");

      const [regularFontResponse, boldFontResponse] = await Promise.all([
        fetch(fontRegularUrl),
        fetch(fontBoldUrl),
      ]);

      if (!regularFontResponse.ok) {
        throw new Error(
          `Не удалось загрузить шрифт: ${fontRegularUrl} (статус: ${regularFontResponse.status})`
        );
      }
      if (!boldFontResponse.ok) {
        throw new Error(
          `Не удалось загрузить шрифт: ${fontBoldUrl} (статус: ${boldFontResponse.status})`
        );
      }
      console.log("Шрифты успешно запрошены.");

      const [regularFontBuffer, boldFontBuffer] = await Promise.all([
        regularFontResponse.arrayBuffer(),
        boldFontResponse.arrayBuffer(),
      ]);
      console.log("Данные шрифтов получены, конвертация в Base64...");

      const MontserratRegularBase64 = arrayBufferToBase64(regularFontBuffer);
      const MontserratBoldBase64 = arrayBufferToBase64(boldFontBuffer);
      console.log("Конвертация Base64 завершена.");

      const doc = new jsPDF({ orientation: "landscape" }); // Используем альбомную ориентацию для большего простора
      console.log("Регистрация шрифтов Montserrat в jsPDF...");

      doc.addFileToVFS("Montserrat-Regular.ttf", MontserratRegularBase64);
      doc.addFileToVFS("Montserrat-Bold.ttf", MontserratBoldBase64);

      doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");
      doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");

      doc.setFont("Montserrat", "normal");
      console.log("Шрифты Montserrat успешно добавлены и установлены.");

      // --- Добавление рамки ---
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15; // Отступы от края листа
      doc.setLineWidth(0.5);
      doc.setDrawColor(184, 255, 0); // Цвет рамки - наш primary-color
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

      // --- Добавление логотипа и названия SkillSphere ---
      const logoWidth = 13;
      const logoHeight = 13;
      const logoY = margin + 10;
      const titleText = "SkillSphere";
      const titleFontSize = 25;
      doc.setFont("Montserrat", "bold");
      doc.setFontSize(titleFontSize);
      const titleWidth = doc.getTextWidth(titleText);
      const totalWidth = logoWidth + titleWidth + 5; // Общая ширина лого + текста + отступ
      const logoX = (pageWidth - totalWidth) / 2; // Центрируем блок (лого + текст)
      const textX = logoX + logoWidth + 5; // Позиция текста справа от лого

      doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight); // Добавляем 'PNG' как формат

      // Добавляем текст SkillSphere рядом с логотипом
      // Выравниваем текст по вертикали точно по центру логотипа
      const textY = logoY + logoHeight / 2; // Точный центр логотипа по Y
      doc.text(titleText, textX, textY, { baseline: "middle" }); // Используем baseline: 'middle' для выравнивания текста

      console.log("Логотип и название добавлены в PDF.");

      // --- Добавление текста (сдвигаем Y координаты вниз) ---
      const textStartY = logoY + logoHeight + 25;
      const textCenterX = pageWidth / 2; // Центр страницы по X

      const completionDate = completionTimestamp.toDate();
      const formattedDate = completionDate.toLocaleDateString("ru-RU");
      const userName =
        currentUser.displayName || currentUser.email || "Пользователь";

      doc.setFontSize(24); // Увеличим заголовок
      doc.setFont("Montserrat", "bold");
      doc.text("СЕРТИФИКАТ", textCenterX, textStartY, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("Montserrat", "normal");
      doc.text("Настоящим подтверждается, что", textCenterX, textStartY + 20, {
        align: "center",
      });

      doc.setFontSize(20); // Увеличим имя
      doc.setFont("Montserrat", "bold");
      doc.text(userName, textCenterX, textStartY + 35, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("Montserrat", "normal");
      doc.text("успешно завершил(а) курс", textCenterX, textStartY + 50, {
        align: "center",
      });

      doc.setFontSize(18); // Увеличим название курса
      doc.setFont("Montserrat", "bold");
      // Автоматический перенос строки для длинных названий курса
      const courseTitleLines = doc.splitTextToSize(
        `"${course.title}"`,
        pageWidth - margin * 4
      ); // Оставляем место по бокам
      doc.text(courseTitleLines, textCenterX, textStartY + 65, {
        align: "center",
      });

      // Рассчитаем Y позицию для даты в зависимости от высоты названия курса
      const courseTitleHeight = doc.getTextDimensions(courseTitleLines).h;
      const dateY = textStartY + 65 + courseTitleHeight + 15;

      doc.setFontSize(12);
      doc.setFont("Montserrat", "normal");
      doc.text(`Дата завершения: ${formattedDate}`, textCenterX, dateY, {
        align: "center",
      });

      // --- Сохранение PDF ---
      console.log("Сохранение PDF...");
      doc.save(`Сертификат-${course.title}.pdf`);
      console.log("Сертификат сохранен.");
    } catch (error) {
      console.error("ОШИБКА при генерации сертификата:", error);
      alert(`Не удалось сгенерировать сертификат: ${error.message}`);
    } finally {
      // TODO: Снять индикатор загрузки
    }
  };

  // Фильтрую курсы, чтобы показывать только те, по которым есть прогресс
  const startedCourses = useMemo(() => {
    // Теперь проверяем наличие объекта прогресса и progress > 0 внутри него
    return courses.filter((course) => userProgress[course.id]?.progress > 0);
  }, [courses, userProgress]);

  let content;
  if (!user || loading) {
    // Показываем скелетон во время загрузки
    content = (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="skeleton skeleton-avatar"></div>
            <div
              className="skeleton skeleton-line w-50"
              style={{ margin: "0 auto 10px auto" }}
            ></div>
          </div>
          <div className="profile-info">
            <div
              className="skeleton skeleton-line w-100"
              style={{ height: "40px", marginBottom: "15px" }}
            ></div>
            <div
              className="skeleton skeleton-line w-100"
              style={{ height: "40px", marginBottom: "15px" }}
            ></div>
          </div>
          <div className="profile-actions">
            <div
              className="skeleton skeleton-line w-100"
              style={{ height: "40px", borderRadius: "30px" }}
            ></div>
          </div>
          <div className="course-progress">
            <div
              className="skeleton skeleton-line w-50"
              style={{ height: "24px", marginBottom: "20px" }}
            ></div>
            <div
              className="skeleton skeleton-line w-100"
              style={{ height: "30px", marginBottom: "15px" }}
            ></div>
            <div
              className="skeleton skeleton-line w-100"
              style={{ height: "30px", marginBottom: "15px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  } else {
    // Показываем реальный контент профиля
    content = (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Фото профиля" />
              ) : (
                <div style={avatarStyle}>
                  {getInitials(user.displayName, user.email)}
                </div>
              )}
            </div>
            <h2>{user.displayName || "Пользователь"}</h2>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <span>
                <b>E-mail:</b> {user.email}
              </span>
            </div>
            <div className="info-item">
              <span>
                <b>Дата регистрации:</b>{" "}
                {new Date(user.metadata.creationTime).toLocaleString("ru-RU", {
                  timeZone: "Europe/Moscow",
                })}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>

          {/* Отображение прогресса курсов */}
          <div className="course-progress">
            <h3>Мои курсы</h3>
            {startedCourses.length > 0 ? (
              startedCourses.map((course) => {
                // Получаем объект прогресса для курса
                const progressData = userProgress[course.id];
                // Извлекаем число прогресса (или 0)
                const progressPercent = (progressData?.progress || 0) * 100;
                // Проверяем дату завершения
                const completionDate = progressData?.completedAt;

                return (
                  <div key={course.id} className="course-item">
                    {/* Строка с названием и прогрессом */}
                    <div className="course-info-row">
                      {/* Название курса (слева) */}
                      <span className="course-title-profile">
                        {course.title}
                      </span>

                      {/* Детали прогресса (справа) */}
                      <div className="course-progress-details">
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <span>{progressPercent.toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* Кнопка сертификата (под строкой с инфо) */}
                    {completionDate && (
                      <button
                        className="certificate-button"
                        onClick={() =>
                          generateCertificate(course, user, completionDate)
                        }
                      >
                        Сертификат
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p>Вы еще не начали ни одного курса.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {content} {/* Рендерим либо скелетон, либо контент */}
      <Footer />
    </>
  );
};

export default Profile;
