import './Header.css';

function Header({ onLogout, onLoginClick, isLoggedIn }) {
  

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">МОНИТОРИНГ РЕСУРСОВ СЕРВЕРА</h1>
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <button className="logout-btn" onClick={onLogout}>
                Выйти
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;