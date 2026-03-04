import { useState, useEffect, useRef } from 'react';
import './UserManagement.css';

function UserManagement({ isVisible, onClose }) {
  const [users, setUsers] = useState([
    { id: 1, login: 'admin', role: 'Администратор', lastLogin: '2026-02-24 10:30' },
    { id: 2, login: 'user1', role: 'Ограниченный', lastLogin: '2026-02-24 09:15' },
    { id: 3, login: 'guest1', role: 'Гость', lastLogin: '2026-02-23 16:45' },
    { id: 4, login: 'user2', role: 'Ограниченный', lastLogin: '2026-02-24 11:20' },
    { id: 5, login: 'user3', role: 'Гость', lastLogin: '2026-02-24 08:30' },
    { id: 6, login: 'user4', role: 'Ограниченный', lastLogin: '2026-02-23 14:15' },
    { id: 7, login: 'user5', role: 'Гость', lastLogin: '2026-02-24 10:00' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const tableRef = useRef(null);

  // Закрытие dropdown при клике вне его и при скролле
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };

    const handleScroll = () => {
      setSelectedUser(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleUserClick = (user, event) => {
    event.stopPropagation();
    
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
      return;
    }
    
    const row = event.currentTarget;
    const rect = row.getBoundingClientRect();
    const tableRect = tableRef.current.getBoundingClientRect();
    
    setDropdownPosition({
      top: rect.top - tableRect.top + row.offsetHeight,
      left: rect.left - tableRect.left
    });
    
    setSelectedUser(user);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.login.length < 3 || formData.login.length > 50) {
      newErrors.login = 'Логин должен быть от 3 до 50 символов';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.login)) {
      newErrors.login = 'Логин может содержать только латиницу, цифры и подчеркивание';
    }
    
    if (!editingUser || formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Пароль должен содержать минимум 8 символов';
      }
      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Пароль должен содержать буквы и цифры';
      }
    }
    
    if (!editingUser && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ login: '', password: '', confirmPassword: '', role: 'user' });
    setErrors({});
    setIsModalOpen(true);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      login: user.login,
      password: '',
      confirmPassword: '',
      role: user.role === 'Администратор' ? 'admin' : user.role === 'Ограниченный' ? 'user' : 'guest'
    });
    setErrors({});
    setIsModalOpen(true);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (userToDelete && userToDelete.role === 'Администратор') {
      alert('Нельзя удалить пользователя с ролью Администратор!');
      setSelectedUser(null);
      return;
    }
    
    if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
      setUsers(users.filter(u => u.id !== userId));
      setSelectedUser(null);
    }
  };

  const handleSaveUser = () => {
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? {
          ...u,
          login: formData.login,
          role: formData.role === 'admin' ? 'Администратор' : formData.role === 'user' ? 'Ограниченный' : 'Гость'
        } : u
      ));
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        login: formData.login,
        role: formData.role === 'admin' ? 'Администратор' : formData.role === 'user' ? 'Ограниченный' : 'Гость',
        lastLogin: 'Никогда'
      };
      setUsers([...users, newUser]);
    }
    
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Если таблица не видима - не рендерим ничего
  if (!isVisible) {
    return null;
  }

  return (
    <div className="user-management" ref={tableRef}>
      <div className="table-header">
        <h3 className="table-title">Список пользователей</h3>
        <div className="table-controls">
          <button className="btn btn-close" onClick={onClose}>
            ✕ Скрыть таблицу
          </button>
          <button className="btn btn-primary" onClick={handleAddUser}>
            + Добавить пользователя
          </button>
        </div>
      </div>

      {/* Обертка для скролла */}
      <div className="table-scroll-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Последний вход</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr 
                key={user.id}
                className={`user-row ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                onClick={(e) => handleUserClick(user, e)}
                style={{ cursor: 'pointer' }}
                title="Кликните для действий"
              >
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div 
          ref={dropdownRef}
          className="user-dropdown"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 1000
          }}
        >
          <div className="dropdown-header">
            <strong>{selectedUser.login}</strong>
            <button className="dropdown-close" onClick={() => setSelectedUser(null)}>×</button>
          </div>
          <div className="dropdown-actions">
            <button 
              className="dropdown-btn edit"
              onClick={() => handleEditUser(selectedUser)}
            >
              ✏️ Редактировать
            </button>
            {selectedUser.role !== 'Администратор' && (
              <button 
                className="dropdown-btn delete"
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                🗑️ Удалить
            </button>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => {setIsModalOpen(false); setSelectedUser(null);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Редактирование пользователя' : 'Добавление нового пользователя'}</h3>
              <button className="close-btn" onClick={() => {setIsModalOpen(false); setSelectedUser(null);}}>×</button>
            </div>

            <div className="form-group">
              <label>Логин:</label>
              <input
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({...formData, login: e.target.value})}
                className={errors.login ? 'error' : ''}
              />
              {errors.login && <span className="error-text">{errors.login}</span>}
            </div>

            <div className="form-group">
              <label>Пароль {editingUser && '(оставьте пустым, чтобы не менять)' }:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!editingUser && (
              <div className="form-group">
                <label>Подтверждение пароля:</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Роль:</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="guest">Гость</option>
                <option value="user">Ограниченный пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSaveUser}>
                {editingUser ? 'Сохранить' : 'Добавить'}
              </button>
              <button className="btn btn-secondary" onClick={() => {setIsModalOpen(false); setSelectedUser(null);}}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;