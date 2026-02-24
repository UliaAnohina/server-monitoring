import MetricsDashboard from '../common/MetricsDashboard';
import ProcessTableAdmin from './ProcessTableAdmin';
import UserManagement from './UserManagement';
import AuditLog from './AuditLog';

function AdminView() {
  return (
    <div className="admin-view">
      {/* ТОЛЬКО метрики (без таблицы процессов) */}
      <MetricsDashboard userRole="Администратор" />
      
      {/* Таблица процессов с управлением */}
      <div className="admin-section">
        <ProcessTableAdmin />
      </div>
      
      {/* Управление пользователями */}
      <div className="admin-section">
        <UserManagement />
      </div>
      
      {/* Журнал аудита */}
      <div className="admin-section">
        <AuditLog />
      </div>
    </div>
  );
}

export default AdminView;