import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { config } from './config';
import Header from './components/common/Header';
import GuestView from './components/guest/GuestView';
import UserView from './components/user/UserView';
import AdminView from './components/admin/AdminView';
import './App.css';

function App() {
  const { user, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Введите логин и пароль');
      setIsLoading(false);
      return;
    }

    try {
      let role = 'user';
      if (username.toLowerCase() === 'admin') {
        role = 'admin';
      } else if (username.toLowerCase().includes('guest')) {
        role = 'guest';
      }

      await login(username, password, role);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMockMode = () => {
    config.USE_MOCKS = !config.USE_MOCKS;
    alert(`Переключено на: ${config.USE_MOCKS ? 'MOCK данные' : 'Реальный API'}`);
    window.location.reload();
  };

  if (showLoginModal) {
    return (
      <div className="login-page">
        <div className="mode-switcher">
          <button onClick={toggleMockMode} className="mode-btn">
            {config.USE_MOCKS ? 'Тестовый режим' : 'Real API'}
          </button>
        </div>

        <div className="login-container">
          <h1 className="login-title">Авторизация</h1>
          
          <form onSubmit={handleLoginSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                autoComplete="username"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <button 
              type="button"
              className="cancel-button"
              onClick={() => {
                setShowLoginModal(false);
                setUsername('');
                setPassword('');
                setError('');
              }}
            >
              Отмена
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        role={user?.role || 'guest'} 
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
        isLoggedIn={!!user}
      />
      <div className="monitoring-page">
        {}
        {!user && <GuestView />}
        
        {}
        {user?.role === 'user' && <UserView />}
        {user?.role === 'admin' && <AdminView />}
      </div>
    </div>
  );
}

export default App;