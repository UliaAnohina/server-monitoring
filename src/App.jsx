import { useState } from 'react';
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

  if (!userRole) {
    return (
      <div className="login-page">
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
            Выберите роль для тестирования:
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
        {/* Рендерим ТОЛЬКО один компонент в зависимости от роли */}
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