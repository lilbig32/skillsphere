const Register = () => {
  return (
    <div>
      <h2>Регистрация</h2>
      <form>
        <label>
          Имя:
          <input type="text" />
        </label>
        <label>
          Email:
          <input type="email" />
        </label>
        <label>
          Пароль:
          <input type="password" />
        </label>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
