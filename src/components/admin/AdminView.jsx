import { useState } from 'react';
import MetricsDashboard from '../common/MetricsDashboard';
import ProcessTableAdmin from './ProcessTableAdmin';
import UserManagement from './UserManagement';
import AuditLog from './AuditLog';
import './AdminView.css';

function AdminView() {
  const [expandedSections, setExpandedSections] = useState({
    processes: false,
    users: false,
    audit: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="admin-view">
      {/* Единая карточка для всех секций */}
      <div className="admin-unified-card">
        {/* Метрики (всегда видны) */}
        <div className="metrics-section">
          <MetricsDashboard userRole="Администратор" showContainer={false} />
        </div>

        {/* Разделительная линия */}
        <div className="section-divider"></div>

        {/* Таблица процессов */}
        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('processes')}>
            <h3 className="section-title">
              Таблица процессов
              <span className="toggle-indicator">{expandedSections.processes ? '▲' : '▼'}</span>
            </h3>
          </div>
          
          {expandedSections.processes && (
            <div className="section-content">
              <ProcessTableAdmin />
            </div>
          )}
        </div>

        {/* Разделительная линия */}
        <div className="section-divider"></div>

        {/* Таблица пользователей */}
        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('users')}>
            <h3 className="section-title">
              Список пользователей
              <span className="toggle-indicator">{expandedSections.users ? '▲' : '▼'}</span>
            </h3>
          </div>
          
          {expandedSections.users && (
            <div className="section-content">
              <UserManagement />
            </div>
          )}
        </div>

        {/* Разделительная линия */}
        <div className="section-divider"></div>

        {/* Журнал аудита */}
        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('audit')}>
            <h3 className="section-title">
              Журнал аудита
              <span className="toggle-indicator">{expandedSections.audit ? '▲' : '▼'}</span>
            </h3>
          </div>
          
          {expandedSections.audit && (
            <div className="section-content">
              <AuditLog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminView;