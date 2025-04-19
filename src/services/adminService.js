import { getFirestore, collection, getDocs } from "firebase/firestore";

export const getAllUserProgressData = async () => {
  const db = getFirestore();
  const progressCollectionRef = collection(db, "userProgress"); // Убедись, что имя коллекции верное
  console.log("Admin Service: Запрос всех данных о прогрессе...");

  try {
    const querySnapshot = await getDocs(progressCollectionRef);
    const allProgress = [];
    querySnapshot.forEach((doc) => {
      // Добавляем данные документа И его ID (если он нужен)
      allProgress.push({ id: doc.id, ...doc.data() });
    });
    console.log(
      `Admin Service: Загружено ${allProgress.length} записей прогресса.`
    );
    return allProgress;
  } catch (error) {
    console.error(
      "Admin Service: Ошибка при загрузке данных прогресса:",
      error
    );
    throw error;
  }
};
