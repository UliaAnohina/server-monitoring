import { useState, useEffect } from 'react';
import { fetchAuditLog, exportAuditLog } from '../../apiService';

import './AuditLog.css';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAuditLog();
        setLogs(data);
      } catch (e) {
        setError(e.message || 'Не удалось загрузить журнал аудита');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const handleExport = async () => {
    try {
      setError('');
      await exportAuditLog('csv');
    } catch (e) {
      setError(e.message || 'Не удалось экспортировать журнал');
    }
  };

  return (
    <div className="audit-log">
      <div className="audit-header">
        <button className="btn btn-primary" onClick={handleExport}>
          Экспорт в CSV
        </button>
      </div>

      {error && (
        <div className="audit-error">
          {error}
        </div>
      )}

      <div className="table-scroll-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Время</th>
              <th>Пользователь</th>
              <th>Действие</th>
              <th>Объект</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Загрузка записей аудита...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Записей аудита нет
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{log.timestamp || log.time}</td>
                  <td>{log.username || log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.object_name || log.object || '-'}</td>
                  <td>{log.ip_address || log.ip}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;