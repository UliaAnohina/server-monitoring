import MetricsDashboard from '../common/MetricsDashboard';
import ProcessTable from './ProcessTable';
import ProcessTableAdmin from '../admin/ProcessTableAdmin';
import './MetricsDashboardWithProcessTable.css';

function MetricsDashboardWithProcessTable({ isAdmin = false }) {
  return (
    <div className="combined-card">
      <div className="metrics-section">
        <MetricsDashboard 
          userRole={isAdmin ? 'Администратор' : 'Пользователь'} 
          showContainer={false} 
        />
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