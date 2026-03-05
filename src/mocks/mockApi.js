import { config } from '../config';
import { 
  mockUsers, 
  mockProcesses, 
  mockAuditLog,
  simulateProcessMetrics,
  simulateServerMetrics
} from './mockData';

const delay = () => new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));

let currentToken = null;
let nextUserId = 6;
let nextAuditId = 7;

const checkAuth = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  return true;
};

const checkAdmin = () => {
  checkAuth();
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }
  const user = JSON.parse(userStr);
  if (!user.is_admin && user.role !== 'admin') {
    const error = new Error('Admin access required');
    error.status = 403;
    throw error;
  }
  return user;
};

// Mock API методы
export const mockApi = {
  login: async (username, password) => {
    await delay();
    
    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      const error = new Error('Неверный логин или пароль');
      error.status = 401;
      throw error;
    }
    
    currentToken = `mock-jwt-token-${Date.now()}`;
    
    // Сохраняем данные пользователя
    const userData = {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin,
      role: user.role
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    return {
      access_token: currentToken,
      token_type: 'bearer',
      expires_in: 3600
    };
  },

  getMetrics: async () => {
    await delay();
    checkAuth();
    return simulateServerMetrics();
  },

  getProcesses: async (filters = {}) => {
    await delay();
    checkAuth();
    
    let processes = [...mockProcesses];
    
    // Фильтр по имени
    if (filters.filter_name) {
      processes = processes.filter(p => 
        p.name.toLowerCase().includes(filters.filter_name.toLowerCase())
      );
    }
    
    // Сортировка
    if (filters.sort_by) {
      const key = filters.sort_by;
      processes.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
    }
    
    return simulateProcessMetrics(processes);
  },

  // Управление процессом
  manageProcess: async (pid, action, confirm, options = {}) => {
    await delay();
    checkAdmin();
    
    if (!confirm) {
      const error = new Error('Confirmation required');
      error.status = 400;
      throw error;
    }
    
    const processIndex = mockProcesses.findIndex(p => p.pid === parseInt(pid));
    if (processIndex === -1) {
      const error = new Error('Process not found');
      error.status = 404;
      throw error;
    }
    
    switch(action) {
      case 'kill': {
        mockProcesses.splice(processIndex, 1);
        // Добавляем запись в аудит
        mockAuditLog.unshift({
          id: nextAuditId++,
          timestamp: new Date().toISOString(),
          username: JSON.parse(localStorage.getItem('user')).username,
          action: 'Завершение процесса',
          object_name: mockProcesses[processIndex]?.name || `PID: ${pid}`,
          ip_address: '127.0.0.1',
          details: 'Процесс завершен администратором'
        });
        return { status: 'success', message: `Process ${pid} terminated` };
      }
        
      case 'kill_tree': {
        // Удаляем процесс и "дочерние"
        mockProcesses.splice(processIndex, 1);
        mockAuditLog.unshift({
          id: nextAuditId++,
          timestamp: new Date().toISOString(),
          username: JSON.parse(localStorage.getItem('user')).username,
          action: 'Завершение дерева процессов',
          object_name: `PID: ${pid}`,
          ip_address: '127.0.0.1',
          details: 'Дерево процессов завершено'
        });
        return { status: 'success', message: `Process tree ${pid} terminated` };
      }
        
      case 'priority': {
        if (options.priority !== undefined) {
          mockProcesses[processIndex].priority = options.priority;
        }
        mockAuditLog.unshift({
          id: nextAuditId++,
          timestamp: new Date().toISOString(),
          username: JSON.parse(localStorage.getItem('user')).username,
          action: 'Изменение приоритета',
          object_name: mockProcesses[processIndex].name,
          ip_address: '127.0.0.1',
          details: `Новый приоритет: ${options.priority}`
        });
        return { status: 'success', message: `Priority changed to ${options.priority}` };
      }
        
      default: {
        const error = new Error('Unknown action');
        error.status = 400;
        throw error;
      }
    }
  },

  // Создание пользователя
  createUser: async (userData) => {
    await delay();
    checkAdmin();
    
    // Проверка на существующий username
    if (mockUsers.some(u => u.username === userData.username)) {
      const error = new Error('Username уже занят');
      error.status = 400;
      throw error;
    }
    
    const newUser = {
      id: nextUserId++,
      username: userData.username,
      login: userData.username,
      password: userData.password,
      is_admin: userData.is_admin || false,
      role: userData.is_admin ? 'admin' : 'user',
      last_login: null
    };
    
    mockUsers.push(newUser);
    
    mockAuditLog.unshift({
      id: nextAuditId++,
      timestamp: new Date().toISOString(),
      username: JSON.parse(localStorage.getItem('user')).username,
      action: 'Добавление пользователя',
      object_name: userData.username,
      ip_address: '127.0.0.1',
      details: `Роль: ${userData.is_admin ? 'администратор' : 'пользователь'}`
    });
    
    return {
      id: newUser.id,
      login: newUser.login,
      role: newUser.role
    };
  },

  // Обновление пользователя
  updateUser: async (userId, userData) => {
    await delay();
    checkAdmin();
    
    const userIndex = mockUsers.findIndex(u => u.id === parseInt(userId));
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    const user = mockUsers[userIndex];
    
    if (userData.username) {
      // Проверка на уникальность
      if (mockUsers.some(u => u.username === userData.username && u.id !== user.id)) {
        const error = new Error('Username уже занят');
        error.status = 400;
        throw error;
      }
      user.username = userData.username;
      user.login = userData.username;
    }
    
    if (userData.password) {
      user.password = userData.password;
    }
    
    if (userData.is_admin !== undefined) {
      user.is_admin = userData.is_admin;
      user.role = userData.is_admin ? 'admin' : 'user';
    }
    
    mockUsers[userIndex] = user;
    
    return {
      id: user.id,
      login: user.login,
      role: user.role
    };
  },

  // Удаление пользователя
  deleteUser: async (userId) => {
    await delay();
    const currentUser = checkAdmin();
    
    const userIdNum = parseInt(userId);
    
    // Нельзя удалить себя
    if (currentUser.id === userIdNum) {
      const error = new Error('Нельзя удалить самого себя');
      error.status = 400;
      throw error;
    }
    
    const userIndex = mockUsers.findIndex(u => u.id === userIdNum);
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    const user = mockUsers[userIndex];
    
    // Нельзя удалить админа
    if (user.is_admin) {
      const error = new Error('Нельзя удалить администратора');
      error.status = 400;
      throw error;
    }
    
    mockUsers.splice(userIndex, 1);
    
    mockAuditLog.unshift({
      id: nextAuditId++,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
      action: 'Удаление пользователя',
      object_name: user.username,
      ip_address: '127.0.0.1',
      details: null
    });
    
    return { status: 'success' };
  },

  // Журнал аудита
  getAuditLog: async () => {
    await delay();
    checkAdmin();
    
    return [...mockAuditLog]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100);
  },

  // Экспорт аудита
  exportAudit: async (format = 'json') => {
    await delay();
    checkAdmin();
    
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Username', 'Action', 'Object', 'IP', 'Details'];
      const rows = mockAuditLog.map(log => [
        log.id,
        log.timestamp,
        log.username,
        log.action,
        log.object_name || '-',
        log.ip_address,
        log.details || ''
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return csvContent;
    }
    
    return [...mockAuditLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

export default mockApi;