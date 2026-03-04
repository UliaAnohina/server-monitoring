import { useState, useEffect } from 'react';
import ProcessTable from './ProcessTable';
import ProcessTableAdmin from '../admin/ProcessTableAdmin';
import './MetricsDashboardWithProcessTable.css';

function MetricsDashboardWithProcessTable({ isAdmin = false }) {
  const [metrics, setMetrics] = useState({
    cpu: 58,
    ram: 76,
    disk: 40,
    status: 'норма',
    alerts: 'нет',
    lastUpdate: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 40) + 40,
        ram: Math.floor(Math.random() * 30) + 60,
        disk: Math.floor(Math.random() * 30) + 30,
        lastUpdate: new Date()
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const renderIndicators = (value) => {
    const filledDots = Math.round((value / 100) * 5);
    return (
      <div className="metric-indicators">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`indicator-dot ${i < filledDots ? 'active' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="combined-card">
      {/* Верхняя часть: метрики */}
      <div className="metrics-section">
        <div className="card-header">
          <span className="server-name">Server 1.0</span>
          <span className="user-role">{isAdmin ? 'Администратор' : 'Пользователь'}</span>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">CPU</span>
              <span className="metric-value">{metrics.cpu}%</span>
            </div>
            {renderIndicators(metrics.cpu)}
          </div>
          
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">RAM</span>
              <span className="metric-value">{metrics.ram}%</span>
            </div>
            {renderIndicators(metrics.ram)}
          </div>
          
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">DISK</span>
              <span className="metric-value">{metrics.disk}%</span>
            </div>
            {renderIndicators(metrics.disk)}
          </div>
        </div>
        
        <div className="system-info">
          <div className="info-row">
            <span className="info-label">Статус системы: </span>
            <span className="status-normal">{metrics.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Активные алерты: </span>
            <span className="info-value">{metrics.alerts}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Последнее обновление: </span>
            <span className="info-value">
              {metrics.lastUpdate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit', second:'2-digit'})} (обновление: 10 сек)
            </span>
          </div>
        </div>
      </div>

      {/* Разделительная линия */}
      <div className="card-divider"></div>

      {/* Нижняя часть: таблица процессов */}
      <div className="table-section">
        {isAdmin ? <ProcessTableAdmin /> : <ProcessTable />}
      </div>
    </div>
  );
}

export default MetricsDashboardWithProcessTable;