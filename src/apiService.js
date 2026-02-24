const API_BASE_URL = 'http://localhost:8000'; // Или import.meta.env.VITE_API_URL

// Авторизация
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) throw new Error('Invalid credentials');
  return await response.json();
};

// Получение метрик
export const fetchMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  return await response.json();
};

// Получение процессов
export const fetchProcesses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/processes`);
  return await response.json();
};

// Завершение процесса
export const terminateProcess = async (pid, terminateTree = false) => {
  await fetch(`${API_BASE_URL}/api/processes/${pid}/terminate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ terminateTree })
  });
};

// Изменение приоритета
export const changePriority = async (pid, priority) => {
  await fetch(`${API_BASE_URL}/api/processes/${pid}/priority`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority })
  });
};

// Пользователи
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  return await response.json();
};

export const addUser = async (userData) => {
  await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
};

export const editUser = async (userId, userData) => {
  await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
};

export const deleteUser = async (userId) => {
  await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'DELETE'
  });
};

// Журнал аудита
export const fetchAuditLog = async () => {
  const response = await fetch(`${API_BASE_URL}/api/audit`);
  return await response.json();
};