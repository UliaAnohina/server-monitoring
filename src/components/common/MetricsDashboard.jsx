import { useState, useEffect } from 'react';
import { fetchMetrics } from '../../apiService';
import { config } from '../../config';
import './MetricsDashboard.css';

function MetricsDashboard({ userRole = 'Гость', showContainer = true }) {
  const [metrics, setMetrics] = useState({
    cpu: null,
    ram: null,
    disk: null,
    status: 'Загрузка...',
    alerts: 'Загрузка...',
    lastUpdate: null
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        setError('');
        const data = await fetchMetrics();
        if (!isMounted) return;

        setMetrics({
          cpu: data.cpu_percent ?? 0,
          ram: data.mem_percent ?? 0,
          disk: data.disk_percent ?? 0,
          status: data.status || 'норма',
          alerts: (data.alerts && data.alerts.length > 0) ? data.alerts.join(', ') : 'нет',
          lastUpdate: data.last_update ? new Date(data.last_update) : new Date()
        });
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || 'Не удалось загрузить метрики');
      }
    };

    loadMetrics();

    const interval = setInterval(loadMetrics, config.AUTO_REFRESH.METRICS || 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatMetricValue = (value) => {
    if (value === null || value === undefined) {
      return '—';
    }

    return `${value}%`;
  };

  const renderIndicators = (value) => {
    const safeValue = value ?? 0;
    const filledDots = Math.round((safeValue / 100) * 5);
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
    <div className={showContainer ? 'metrics-container' : 'metrics-inner'}>
      <div className="metrics-header">
        <span className="server-name">Server 1.0</span>
        <span className="user-role">{userRole}</span>
      </div>

      {error && (
        <div className="metrics-error">
          {error}
        </div>
      )}
      
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">CPU</span>
            <span className="metric-value">{formatMetricValue(metrics.cpu)}</span>
          </div>
          {renderIndicators(metrics.cpu)}
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">RAM</span>
            <span className="metric-value">{formatMetricValue(metrics.ram)}</span>
          </div>
          {renderIndicators(metrics.ram)}
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">DISK</span>
            <span className="metric-value">{formatMetricValue(metrics.disk)}</span>
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
            {metrics.lastUpdate 
              ? metrics.lastUpdate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit', second:'2-digit'})
              : '—'
            } (обновление: {Math.round((config.AUTO_REFRESH.METRICS || 30000) / 1000)} сек)
          </span>
        </div>
      </div>
    </div>
  );
}

export default MetricsDashboard;
