

const Login = () => {
  return (
    <div>
      <h2>Войти</h2>
      <form>
        <label>
          Email:
          <input type="email" />
        </label>
        <label>
          Пароль:
          <input type="password" />
        </label>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;
