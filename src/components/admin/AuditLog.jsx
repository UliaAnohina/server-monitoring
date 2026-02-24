import { useState } from 'react';
import './AuditLog.css';

function AuditLog() {
  const [logs] = useState([
    { id: 1, time: '2026-02-24 10:30:15', user: 'admin', action: 'Завершение процесса', object: 'chrome.exe (PID: 1234)', ip: '192.168.1.100' },
    { id: 2, time: '2026-02-24 09:15:22', user: 'admin', action: 'Добавление пользователя', object: 'user2', ip: '192.168.1.100' },
    { id: 3, time: '2026-02-23 16:45:10', user: 'user1', action: 'Просмотр метрик', object: '-', ip: '192.168.1.105' },
  ]);

  return (
    <div className="audit-log">
      <h3 className="table-title">Журнал аудита</h3>
      
      <div className="table-wrapper">
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
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.object}</td>
                <td>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;