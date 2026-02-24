import { useState, useEffect } from 'react';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, login: 'admin', role: 'Администратор', lastLogin: '2026-02-24 10:30' },
    { id: 2, login: 'user1', role: 'Ограниченный', lastLogin: '2026-02-24 09:15' },
    { id: 3, login: 'guest1', role: 'Гость', lastLogin: '2026-02-23 16:45' },
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

  // Валидация формы
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

  // Открытие модального окна для добавления
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ login: '', password: '', confirmPassword: '', role: 'user' });
    setErrors({});
    setIsModalOpen(true);
  };

  // Открытие модального окна для редактирования
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
  };

  // Удаление пользователя
  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    // Запрещаем удаление администраторов
    if (userToDelete && userToDelete.role === 'Администратор') {
      alert('Нельзя удалить пользователя с ролью Администратор!');
      return;
    }
    
    if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // В таблице - скрываем кнопку удаления для админов
  {users.map(user => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.login}</td>
      <td>{user.role}</td>
      <td>{user.lastLogin}</td>
      <td className="actions">
        <button 
          className="btn btn-small btn-edit"
          onClick={() => handleEditUser(user)}
        >
          Редактировать
        </button>
        {user.role !== 'Администратор' && (
          <button 
            className="btn btn-small btn-delete"
            onClick={() => handleDeleteUser(user.id)}
          >
            Удалить
          </button>
        )}
      </td>
    </tr>
  ))}

  // Сохранение пользователя
  const handleSaveUser = () => {
    if (!validateForm()) return;

    if (editingUser) {
      // Редактирование
      setUsers(users.map(u => 
        u.id === editingUser.id ? {
          ...u,
          login: formData.login,
          role: formData.role === 'admin' ? 'Администратор' : formData.role === 'user' ? 'Ограниченный' : 'Гость'
        } : u
      ));
    } else {
      // Добавление нового
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        login: formData.login,
        role: formData.role === 'admin' ? 'Администратор' : formData.role === 'user' ? 'Ограниченный' : 'Гость',
        lastLogin: 'Никогда'
      };
      setUsers([...users, newUser]);
    }
    
    setIsModalOpen(false);
  };

  const getRoleName = (role) => {
    if (role === 'admin') return 'Администратор';
    if (role === 'user') return 'Ограниченный';
    return 'Гость';
  };

  return (
    <div className="user-management">
      <div className="table-header">
        <h3 className="table-title">Список пользователей</h3>
        <button className="btn btn-primary" onClick={handleAddUser}>
          + Добавить пользователя
        </button>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Последний вход</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
                <td className="actions">
                  <button 
                    className="btn btn-small btn-edit"
                    onClick={() => handleEditUser(user)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-small btn-delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Редактирование пользователя' : 'Добавление нового пользователя'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
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
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
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