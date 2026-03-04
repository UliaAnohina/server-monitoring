import { useState } from 'react';
import MetricsDashboardWithProcessTable from '../user/MetricsDashboardWithProcessTable';
import UserManagement from './UserManagement';
import AuditLog from './AuditLog';

function AdminView() {
  const [isUserTableVisible, setIsUserTableVisible] = useState(false);
  const [isAuditLogVisible, setIsAuditLogVisible] = useState(false);

  return (
    <div className="admin-view">
      {/* Метрики + таблица процессов с управлением (в ОДНОЙ карточке) */}
      <MetricsDashboardWithProcessTable isAdmin={true} />
      
      {/* Контейнер для кнопок и таблиц */}
      <div className="tables-container">
        {/* Кнопки управления */}
        <div className="buttons-row">
          {!isUserTableVisible && !isAuditLogVisible && (
            <>
              <button 
                className="btn btn-show-table"
                onClick={() => setIsUserTableVisible(true)}
              >
                👥 Таблица пользователей
              </button>
              <button 
                className="btn btn-show-table"
                onClick={() => setIsAuditLogVisible(true)}
              >
                📋 Журнал аудитов
              </button>
            </>
          )}
        </div>

        {/* Таблица пользователей */}
        {isUserTableVisible && (
          <div className="table-section">
            <UserManagement 
              isVisible={isUserTableVisible}
              onClose={() => setIsUserTableVisible(false)}
            />
            {/* Кнопка журнала аудитов под таблицей пользователей */}
            {!isAuditLogVisible && (
              <div className="button-below">
                <button 
                  className="btn btn-show-table"
                  onClick={() => setIsAuditLogVisible(true)}
                >
                  📋 Журнал аудитов
                </button>
              </div>
            )}
          </div>
        )}

        {/* Журнал аудитов */}
        {isAuditLogVisible && (
          <div className="table-section">
            <AuditLog 
              isVisible={isAuditLogVisible}
              onClose={() => setIsAuditLogVisible(false)}
            />
            {/* Кнопка таблицы пользователей под журналом */}
            {!isUserTableVisible && (
              <div className="button-below">
                <button 
                  className="btn btn-show-table"
                  onClick={() => setIsUserTableVisible(true)}
                >
                  👥 Таблица пользователей
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminView;