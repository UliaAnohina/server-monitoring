import { useState, useEffect } from 'react';
import './Header.css';

function Header({ role = 'guest', onLogout }) {
  return (
    <header className="header">
      <h1 className="header-title">МОНИТОРИНГ РЕСУРСОВ СЕРВЕРА</h1>
      <div className="header-right">
        <button 
          onClick={onLogout}
          className="login-button"
        >
          {role === 'guest' ? 'Войти' : 'Выйти'}
        </button>
      </div>
    </header>
  );
}

export default Header;