import { useState } from 'react';
import { config } from './config';
import Header from './components/common/Header';
import GuestView from './components/guest/GuestView';
import UserView from './components/user/UserView';
import AdminView from './components/admin/AdminView';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const toggleMockMode = () => {
    config.USE_MOCKS = !config.USE_MOCKS;
    alert(`Переключено на: ${config.USE_MOCKS ? 'MOCK данные' : 'Реальный API'}`);
    window.location.reload();
  };

  if (!userRole) {
    return (
      <div className="login-page">
        <div className="mode-switcher">
          <button onClick={toggleMockMode} className="mode-btn">
            {config.USE_MOCKS ? 'Тестовый режим' : 'Real API'}
          </button>
        </div>
        <h1 style={{ color: '#FF8C00', textAlign: 'center' }}>Авторизация</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '40px',
          border: '2px solid #FFD7A0',
          borderRadius: '12px',
          backgroundColor: 'white',
          maxWidth: '400px',
          margin: '100px auto'
        }}>
          <p style={{ textAlign: 'center', color: '#666' }}>
          </p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
          </p>
          <button onClick={() => handleLogin('guest')} style={buttonStyle}>
            Войти как Гость
          </button>
          <button onClick={() => handleLogin('user')} style={buttonStyle}>
            Войти как Ограниченный пользователь
          </button>
          <button onClick={() => handleLogin('admin')} style={buttonStyle}>
            Войти как Администратор
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header role={userRole} onLogout={handleLogout} />
      <div className="monitoring-page">
        {userRole === 'guest' && <GuestView />}
        {userRole === 'user' && <UserView />}
        {userRole === 'admin' && <AdminView />}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '16px',
  backgroundColor: '#FF8C00',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

export default App;