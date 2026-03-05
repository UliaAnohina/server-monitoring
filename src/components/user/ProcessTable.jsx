import { useState, useEffect } from 'react';
import { fetchProcesses } from '../../apiService';
import { config } from '../../config';
import './ProcessTable.css';

function ProcessTable() {
  const [processes, setProcesses] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProcesses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchProcesses({
        filter_name: filter || undefined,
        sort_by: sortConfig.key || undefined
      });
      setProcesses(data);
    } catch (e) {
      setError(e.message || 'Не удалось загрузить процессы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcesses();
    const interval = setInterval(loadProcesses, config.AUTO_REFRESH.PROCESSES || 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sortConfig.key, sortConfig.direction]);

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
        {error && (
          <div className="table-error">
            {error}
          </div>
        )}
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
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Загрузка процессов...
                </td>
              </tr>
            ) : sortedProcesses.length > 0 ? (
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