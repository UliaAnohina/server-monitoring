import { createContext, useState, useContext } from 'react';
import { getAccessToken, logoutUser, getCurrentUser } from '../apiService';
import { config } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getCurrentUser();
  });
  
  const [error, setError] = useState(null);

  const login = async (username, password, roleForMock = null) => {
    try {
      setError(null);
      
      // Получаем токен через API (mock или реальный)
      const tokenData = await getAccessToken(username, password);
      
      let userData;
      
      if (config.USE_MOCKS) {
        // MOCK режим: определяем роль по username или параметру
        userData = {
          id: username === 'admin' ? 1 : 2,
          username: username,
          is_admin: username === 'admin' || roleForMock === 'admin',
          role: roleForMock || (username === 'admin' ? 'admin' : 'user')
        };
      } else {
        // REAL API режим: используем данные из ответа токена
        userData = {
          id: tokenData.user_id || 1,
          username: username,
          is_admin: tokenData.is_admin || false,
          role: tokenData.role || 'user'
        };
      }
      
      // Сохраняем в localStorage для persistence между перезагрузками
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { user: userData, token: tokenData.access_token };
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    logoutUser(); // Очищает токены из localStorage
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      error, 
      clearError,
      isMock: config.USE_MOCKS 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};