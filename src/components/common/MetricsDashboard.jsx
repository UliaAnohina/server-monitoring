import { useState, useEffect } from 'react';
import { fetchMetrics } from '../../apiService';
import { config } from '../../config';
import './MetricsDashboard.css';

function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMetrics();
    
    if (config.AUTO_REFRESH.ENABLED) {
      const interval = setInterval(loadMetrics, config.AUTO_REFRESH.METRICS);
      return () => clearInterval(interval);
    }
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return <div className="metrics-loading">Загрузка метрик... {config.USE_MOCKS && '(MOCK)'}</div>;
  }

  if (error) {
    return (
      <div className="metrics-error">
        <p>Ошибка загрузки метрик: {error}</p>
        <button onClick={loadMetrics}>Повторить</button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'ok': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#f44336';
      default: return '#2196F3';
    }
  };

  return (
    <div className="metrics-dashboard">
      <div className="metrics-header">
        <h2>Метрики сервера {config.USE_MOCKS && '(MOCK MODE)'}</h2>
        {metrics?.hostname && <span className="hostname">{metrics.hostname}</span>}
        {metrics?.status && (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(metrics.status) }}
          >
            {metrics.status}
          </span>
        )}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🖥️</div>
          <div className="metric-info">
            <div className="metric-value">{metrics?.cpu_percent}%</div>
            <div className="metric-label">CPU Usage</div>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${metrics?.cpu_percent}%`,
                backgroundColor: metrics?.cpu_percent > 90 ? '#f44336' : metrics?.cpu_percent > 70 ? '#FF9800' : '#4CAF50'
              }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💾</div>
          <div className="metric-info">
            <div className="metric-value">{metrics?.mem_percent}%</div>
            <div className="metric-label">Memory Usage</div>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${metrics?.mem_percent}%`,
                backgroundColor: metrics?.mem_percent > 90 ? '#f44336' : metrics?.mem_percent > 70 ? '#FF9800' : '#4CAF50'
              }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💿</div>
          <div className="metric-info">
            <div className="metric-value">{metrics?.disk_percent}%</div>
            <div className="metric-label">Disk Usage</div>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${metrics?.disk_percent}%`,
                backgroundColor: metrics?.disk_percent > 90 ? '#f44336' : metrics?.disk_percent > 70 ? '#FF9800' : '#4CAF50'
              }}
            />
          </div>
        </div>

        {metrics?.alerts && metrics.alerts.length > 0 && (
          <div className="alerts-section">
            <h3>⚠️ Предупреждения</h3>
            <ul>
              {metrics.alerts.map((alert, index) => (
                <li key={index} className="alert-item">
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {metrics?.last_update && (
        <div className="last-update">
          Последнее обновление: {new Date(metrics.last_update).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default MetricsDashboard;