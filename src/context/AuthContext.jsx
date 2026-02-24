import { createContext, useState, useContext } from 'react';
import { loginUser } from '../apiService'; // Функция запроса к API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null, 'guest', 'user', 'admin'

  const login = async (username, password) => {
    // Запрос к бэкенду для проверки логина/пароля
    const userData = await loginUser(username, password);
    setUser(userData); // { username: 'admin', role: 'admin' }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);