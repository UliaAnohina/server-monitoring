import { useState, useEffect } from 'react';
import './ProcessTable.css';

function ProcessTable() {
  const [processes, setProcesses] = useState([
    { pid: 1234, name: 'chrome.exe', cpu: 15.2, mem: 8.5, status: 'Running', owner: 'user1' },
    { pid: 5678, name: 'python.exe', cpu: 2.1, mem: 3.2, status: 'Sleeping', owner: 'admin' },
    { pid: 9012, name: 'code.exe', cpu: 8.7, mem: 12.1, status: 'Running', owner: 'user2' },
  ]);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Number.parseFloat((Math.max(0, p.cpu + (Math.random() - 0.5) * 2)).toFixed(1)),
        mem: Number.parseFloat((Math.max(0, p.mem + (Math.random() - 0.5) * 1)).toFixed(1))
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="process-table-container">
      <h3 className="table-title">Таблица процессов</h3>
      
      <div className="table-header-controls">
        <input
          type="text"
          placeholder="Фильтр по имени процесса..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      
      <div className="table-wrapper">
        <table className="process-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('pid')} className="sortable">PID</th>
              <th onClick={() => handleSort('name')} className="sortable">Имя процесса</th>
              <th onClick={() => handleSort('cpu')} className="sortable">%CPU</th>
              <th onClick={() => handleSort('mem')} className="sortable">%MEM</th>
              <th onClick={() => handleSort('status')} className="sortable">Статус</th>
              <th onClick={() => handleSort('owner')} className="sortable">Владелец</th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.length > 0 ? (
              sortedProcesses.map(process => (
                <tr key={process.pid}>
                  <td>{process.pid}</td>
                  <td>{process.name}</td>
                  <td>{process.cpu}</td>
                  <td>{process.mem}</td>
                  <td>{process.status}</td>
                  <td>{process.owner}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Процессы не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProcessTable;