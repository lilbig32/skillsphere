import { auth } from "../firebase"; 


export const checkAdminStatus = async () => {
  try {
    const user = auth.currentUser; // Получаем текущего пользователя

    if (user) {
      const idTokenResult = await user.getIdTokenResult(true);

      // Проверяем наличие и значение метки 'admin' в claims
      const isAdmin = idTokenResult.claims.admin === true;
      console.log("Admin claim:", idTokenResult.claims.admin); // Лог для отладки
      return isAdmin;
    } else {
      console.log("Пользователь не аутентифицирован для проверки админ-прав.");
      return false;
    }
  } catch (error) {
    console.error("Ошибка при проверке прав администратора:", error);
    return false;
  }
};
