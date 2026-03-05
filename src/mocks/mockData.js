// Моковые данные для тестирования

export const mockUsers = [
  { id: 1, username: 'admin', login: 'admin', password: 'admin', is_admin: true, role: 'admin', last_login: '2026-02-24 10:30:00' },
  { id: 2, username: 'user1', login: 'user1', password: 'user1', is_admin: false, role: 'user', last_login: '2026-02-24 09:15:00' },
  { id: 3, username: 'guest1', login: 'guest1', password: 'guest1', is_admin: false, role: 'guest', last_login: '2026-02-23 16:45:00' },
  { id: 4, username: 'user2', login: 'user2', password: 'user2', is_admin: false, role: 'user', last_login: '2026-02-24 11:20:00' },
  { id: 5, username: 'developer', login: 'developer', password: 'dev123', is_admin: false, role: 'user', last_login: '2026-02-24 08:00:00' },
];

export const mockProcesses = [
  { pid: 1001, name: 'chrome.exe', cpu: 15.2, mem: 8.5, status: 'Running', owner: 'user1', priority: 0 },
  { pid: 1002, name: 'python.exe', cpu: 2.1, mem: 3.2, status: 'Sleeping', owner: 'admin', priority: 5 },
  { pid: 1003, name: 'code.exe', cpu: 8.7, mem: 12.1, status: 'Running', owner: 'user2', priority: -5 },
  { pid: 1004, name: 'node.exe', cpu: 5.3, mem: 4.8, status: 'Running', owner: 'user1', priority: 0 },
  { pid: 1005, name: 'java.exe', cpu: 22.1, mem: 45.2, status: 'Running', owner: 'admin', priority: 10 },
  { pid: 1006, name: 'docker.exe', cpu: 3.2, mem: 2.1, status: 'Sleeping', owner: 'user3', priority: -10 },
  { pid: 1007, name: 'nginx.exe', cpu: 1.1, mem: 1.5, status: 'Running', owner: 'admin', priority: 0 },
  { pid: 1008, name: 'postgres.exe', cpu: 4.5, mem: 15.3, status: 'Running', owner: 'admin', priority: 5 },
];

export const mockAuditLog = [
  { 
    id: 1, 
    timestamp: '2026-02-24T10:30:15', 
    username: 'admin', 
    action: 'Завершение процесса', 
    object_name: 'chrome.exe (PID: 1234)', 
    ip_address: '192.168.1.100',
    details: 'Процесс завершен успешно'
  },
  { 
    id: 2, 
    timestamp: '2026-02-24T09:15:22', 
    username: 'admin', 
    action: 'Добавление пользователя', 
    object_name: 'user2', 
    ip_address: '192.168.1.100',
    details: 'Роль: ограниченный пользователь'
  },
  { 
    id: 3, 
    timestamp: '2026-02-23T16:45:10', 
    username: 'user1', 
    action: 'Просмотр метрик', 
    object_name: '-', 
    ip_address: '192.168.1.105',
    details: null
  },
  { 
    id: 4, 
    timestamp: '2026-02-23T14:30:05', 
    username: 'admin', 
    action: 'Изменение приоритета', 
    object_name: 'python.exe (PID: 5678)', 
    ip_address: '192.168.1.100',
    details: 'Новый приоритет: 10'
  },
  { 
    id: 5, 
    timestamp: '2026-02-23T11:20:30', 
    username: 'admin', 
    action: 'Удаление пользователя', 
    object_name: 'guest1', 
    ip_address: '192.168.1.100',
    details: null
  },
  { 
    id: 6, 
    timestamp: '2026-02-23T10:15:00', 
    username: 'user2', 
    action: 'Вход в систему', 
    object_name: '-', 
    ip_address: '192.168.1.110',
    details: 'Успешная аутентификация'
  },
];

export const mockMetrics = {
  hostname: 'server-monitoring-01',
  cpu_percent: 45.2,
  mem_percent: 62.8,
  disk_percent: 78.5,
  last_update: new Date().toISOString(),
  status: 'ok',
  alerts: []
};

// Генератор случайных чисел для симуляции изменений
export const randomChange = (value, range = 2) => {
  const change = (Math.random() - 0.5) * range * 2;
  return Number.parseFloat(Math.max(0, value + change).toFixed(1));
};

// Симуляция изменения метрик процессов
export const simulateProcessMetrics = (processes) => {
  return processes.map(p => ({
    ...p,
    cpu: randomChange(p.cpu, 2),
    mem: randomChange(p.mem, 1)
  }));
};

// Симуляция изменения метрик сервера
export const simulateServerMetrics = () => {
  return {
    ...mockMetrics,
    cpu_percent: randomChange(mockMetrics.cpu_percent, 5),
    mem_percent: randomChange(mockMetrics.mem_percent, 3),
    disk_percent: randomChange(mockMetrics.disk_percent, 1),
    last_update: new Date().toISOString(),
    status: Math.random() > 0.9 ? 'warning' : 'ok',
    alerts: Math.random() > 0.95 ? ['High CPU usage detected'] : []
  };
};