import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Получение всех курсов
export const getAllCourses = async () => {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    return coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Ошибка при получении курсов:", error);
    throw error;
  }
};

// Получение конкретного курса по ID
export const getCourseById = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    } else {
      throw new Error("Курс не найден");
    }
  } catch (error) {
    console.error("Ошибка при получении курса:", error);
    throw error;
  }
};

// Получение прогресса пользователя по всем курсам
export const getUserProgress = async (userId) => {
  try {
    const progressCollection = collection(db, "userProgress");
    const q = query(progressCollection, where("userId", "==", userId));
    const progressSnapshot = await getDocs(q);

    const progress = {};
    progressSnapshot.forEach((doc) => {
      progress[doc.data().courseId] = doc.data().progress;
    });

    return progress;
  } catch (error) {
    console.error("Ошибка при получении прогресса пользователя:", error);
    throw error;
  }
};

// Обновление прогресса пользователя по курсу
export const updateUserProgress = async (userId, courseId, newProgress) => {
  try {
    const progressCollection = collection(db, "userProgress");
    const q = query(
      progressCollection,
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    );

    const progressSnapshot = await getDocs(q);

    if (progressSnapshot.empty) {
      // Создаем новую запись прогресса
      await addDoc(progressCollection, {
        userId,
        courseId,
        progress: newProgress,
        lastUpdated: new Date(),
      });
    } else {
      // Обновляем существующую запись
      const progressDoc = progressSnapshot.docs[0];
      await updateDoc(doc(db, "userProgress", progressDoc.id), {
        progress: newProgress,
        lastUpdated: new Date(),
      });
    }
  } catch (error) {
    console.error("Ошибка при обновлении прогресса:", error);
    throw error;
  }
};

// Инициализация базовых курсов (запустить один раз при первом деплое)
export const initializeDefaultCourses = async () => {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Проверяем, есть ли уже курсы в базе данных
    if (coursesSnapshot.empty) {
      // Базовые курсы для инициализации
      const defaultCourses = [
        {
          id: "course1",
          title: "Основы программирования",
          description: "Введение в основы программирования и алгоритмов",
          modules: [
            { id: "module1", title: "Введение в программирование", lessons: 5 },
            { id: "module2", title: "Основы алгоритмов", lessons: 4 },
            { id: "module3", title: "Структуры данных", lessons: 6 },
          ],
          totalLessons: 15,
        },
        {
          id: "course2",
          title: "Web-разработка",
          description:
            "Изучение HTML, CSS и JavaScript для создания веб-сайтов",
          modules: [
            { id: "module1", title: "HTML основы", lessons: 4 },
            { id: "module2", title: "CSS стилизация", lessons: 5 },
            { id: "module3", title: "JavaScript основы", lessons: 7 },
            { id: "module4", title: "Создание проекта", lessons: 3 },
          ],
          totalLessons: 19,
        },
        {
          id: "course3",
          title: "Графический дизайн",
          description: "Основы графического дизайна и работа с редакторами",
          modules: [
            { id: "module1", title: "Введение в дизайн", lessons: 3 },
            { id: "module2", title: "Работа с цветом", lessons: 4 },
            { id: "module3", title: "Типографика", lessons: 3 },
            { id: "module4", title: "Композиция", lessons: 5 },
          ],
          totalLessons: 15,
        },
      ];

      // Добавляем каждый курс в базу данных
      for (const course of defaultCourses) {
        const { id, ...courseData } = course;
        await setDoc(doc(db, "courses", id), courseData);
      }

      console.log("Базовые курсы успешно инициализированы");
    }
  } catch (error) {
    console.error("Ошибка при инициализации курсов:", error);
    throw error;
  }
};
