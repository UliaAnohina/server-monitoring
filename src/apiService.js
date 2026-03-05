import { config } from './config';
import { mockApi } from './mocks/mockApi';


const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};


export const getAccessToken = async (username, password) => {
  if (config.USE_MOCKS) {
    return await mockApi.login(username, password);
  }
  
  // Реальный API
  const response = await fetch(`${config.API_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      username,
      password,
      grant_type: 'password',
      scope: '',
      client_id: '',
      client_secret: ''
    })
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Неверный логин или пароль');
    }
    throw new Error('Ошибка сервера авторизации');
  }
  
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_type', data.token_type || 'bearer');
  }
  return data;
};

// ПОЛЬЗОВАТЕЛИ

export const fetchUsers = async () => {
  if (config.USE_MOCKS) {
    return await mockApi.getUsers();
  }

  const response = await fetch(`${config.API_BASE_URL}/users`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Нет прав для просмотра пользователей');
    }
    throw new Error('Ошибка загрузки пользователей');
  }

  return await response.json();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('user');
};

// МЕТРИКИ

export const fetchMetrics = async () => {
  if (config.USE_MOCKS) {
    return await mockApi.getMetrics();
  }
  
  const response = await fetch(`${config.API_BASE_URL}/metrics`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Требуется авторизация');
    throw new Error('Ошибка загрузки метрик');
  }
  
  return await response.json();
};

// ПРОЦЕССЫ

export const fetchProcesses = async (filters = {}) => {
  if (config.USE_MOCKS) {
    return await mockApi.getProcesses(filters);
  }
  
  const queryParams = new URLSearchParams();
  if (filters.filter_name) {
    queryParams.append('filter_name', filters.filter_name);
  }
  if (filters.sort_by) {
    queryParams.append('sort_by', filters.sort_by);
  }
  
  const url = queryParams.toString() 
    ? `${config.API_BASE_URL}/processes?${queryParams.toString()}`
    : `${config.API_BASE_URL}/processes`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Требуется авторизация');
    throw new Error('Ошибка загрузки процессов');
  }
  
  return await response.json();
};

// УПРАВЛЕНИЕ ПРОЦЕССОМ

export const manageProcess = async (pid, action, confirm = true, options = {}) => {
  if (config.USE_MOCKS) {
    return await mockApi.manageProcess(pid, action, confirm, options);
  }
  
  const body = {
    action,
    confirm
  };
  
  if (action === 'priority' && options.priority !== undefined) {
    body.priority = options.priority;
  }

  const response = await fetch(`${config.API_BASE_URL}/processes/${pid}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Недостаточно прав или нет авторизации');
    }
    throw new Error('Ошибка управления процессом');
  }
  
  return await response.json();
};

// СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ

export const addUser = async (userData) => {
  if (config.USE_MOCKS) {
    return await mockApi.createUser({
      username: userData.login,
      password: userData.password,
      is_admin: userData.role === 'admin'
    });
  }
  
  const response = await fetch(`${config.API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      username: userData.login,
      password: userData.password,
      is_admin: userData.role === 'admin'
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 400) {
      throw new Error(error.message || 'Username уже занят');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Нет прав для создания пользователей');
    }
    throw new Error('Ошибка создания пользователя');
  }
  
  return await response.json();
};

// ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ

export const editUser = async (userId, userData) => {
  if (config.USE_MOCKS) {
    return await mockApi.updateUser(userId, {
      username: userData.login,
      password: userData.password,
      is_admin: userData.role === 'admin'
    });
  }
  
  const body = {};
  if (userData.login) body.username = userData.login;
  if (userData.password) body.password = userData.password;
  if (userData.role !== undefined) {
    body.is_admin = userData.role === 'admin';
  }
  
  const response = await fetch(`${config.API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 404) throw new Error('Пользователь не найден');
    if (response.status === 400) throw new Error(error.message || 'Некорректные данные');
    if (response.status === 401 || response.status === 403) throw new Error('Нет прав');
    throw new Error('Ошибка обновления');
  }
  
  return await response.json();
};

// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ

export const deleteUser = async (userId) => {
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === parseInt(userId)) {
    throw new Error('Нельзя удалить самого себя');
  }
  
  if (config.USE_MOCKS) {
    return await mockApi.deleteUser(userId);
  }
  
  const response = await fetch(`${config.API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 404) throw new Error('Пользователь не найден');
    if (response.status === 400) throw new Error(error.message || 'Нельзя удалить пользователя');
    if (response.status === 401 || response.status === 403) throw new Error('Нет прав');
    throw new Error('Ошибка удаления');
  }
  
  return await response.json();
};

// ЖУРНАЛ АУДИТА

export const fetchAuditLog = async () => {
  if (config.USE_MOCKS) {
    return await mockApi.getAuditLog();
  }
  
  const response = await fetch(`${config.API_BASE_URL}/audit`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Нет прав');
    throw new Error('Ошибка загрузки аудита');
  }
  
  return await response.json();
};

// ЭКСПОРТ АУДИТА

export const exportAuditLog = async (format = 'json') => {
  if (config.USE_MOCKS) {
    return await mockApi.exportAudit(format);
  }
  
  const response = await fetch(`${config.API_BASE_URL}/audit/export?format=${format}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Нет прав');
    throw new Error('Ошибка экспорта');
  }
  
  if (format === 'csv') {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  }
  
  return await response.json();
};