function LoginPage({ onLogin }) {
  return (
    <div className="login-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '20px'
    }}>
      <h1 style={{ color: '#FF8C00' }}>Авторизация</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '40px',
        border: '2px solid #FFD7A0',
        borderRadius: '12px',
        backgroundColor: 'white'
      }}>
        <p style={{ textAlign: 'center', color: '#666' }}>
          Выберите роль для тестирования:
        </p>
        
        <button 
          onClick={() => onLogin('guest')}
          style={buttonStyle}
        >
          Войти как Гость
        </button>
        
        <button 
          onClick={() => onLogin('user')}
          style={buttonStyle}
        >
          Войти как Ограниченный пользователь
        </button>
        
        <button 
          onClick={() => onLogin('admin')}
          style={buttonStyle}
        >
          Войти как Администратор
        </button>
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

export default LoginPage;