import { useState, useEffect } from 'react';
import { fetchProcesses } from '../../apiService';
import { config } from '../../config';
import ProcessManagementModal from './ProcessManagementModal';
import './ProcessTableAdmin.css';

function ProcessTableAdmin() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const loadProcesses = async () => {
    try {
      setError('');
      const data = await fetchProcesses({
        filter_name: filter || undefined,
        sort_by: sortConfig.key || undefined
      });
      setProcesses(data);
    } catch (e) {
      setError(e.message || 'Не удалось загрузить процессы');
    }
  };

  useEffect(() => {
    loadProcesses();
    const interval = setInterval(loadProcesses, config.AUTO_REFRESH.PROCESSES || 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sortConfig.key, sortConfig.direction]);

  const handleProcessClick = (process) => {
    setSelectedProcess(process);
    setIsModalOpen(true);
  };

  const handleSort = (key, e) => {
    e.stopPropagation();
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Сортировка отфильтрованных процессов
  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleProcessUpdated = (pid, action, newPriority = null) => {
    if (action === 'terminate' || action === 'terminateTree') {
      setProcesses(processes.filter(p => p.pid !== pid));
    } else if (action === 'priority') {
      setProcesses(processes.map(p => 
        p.pid === pid ? { ...p, priority: newPriority } : p
      ));
    }
    setIsModalOpen(false);
    setSelectedProcess(null);
  };

  return (
    <div className="process-table-admin">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Фильтр по имени процесса..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      
      <div className="table-scroll-wrapper">
        {error && (
          <div className="table-error">
            {error}
          </div>
        )}
        <table className="process-table">
          <thead>
            <tr>
              <th 
                onClick={(e) => handleSort('pid', e)}  // ← Передаем событие
                className="sortable"
              >
                PID ↕
              </th>
              <th 
                onClick={(e) => handleSort('name', e)}  // ← Передаем событие
                className="sortable"
              >
                Имя процесса ↕
              </th>
              <th 
                onClick={(e) => handleSort('cpu', e)}  // ← Передаем событие
                className="sortable"
              >
                %CPU ↕
              </th>
              <th 
                onClick={(e) => handleSort('mem', e)}  // ← Передаем событие
                className="sortable"
              >
                %MEM ↕
              </th>
              <th 
                onClick={(e) => handleSort('status', e)}  // ← Передаем событие
                className="sortable"
              >
                Статус ↕
              </th>
              <th 
                onClick={(e) => handleSort('owner', e)}  // ← Передаем событие
                className="sortable"
              >
                Владелец ↕
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map(process => (
              <tr key={process.pid} className="process-row">
                <td>{process.pid}</td>
                <td 
                  className="process-name clickable"
                  onClick={() => handleProcessClick(process)}
                  title="Кликните для управления процессом"
                >
                  {process.name}
                </td>
                <td>{process.cpu}</td>
                <td>{process.mem}</td>
                <td>{process.status}</td>
                <td>{process.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedProcess && (
        <ProcessManagementModal
          process={selectedProcess}
          processes={processes}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProcess(null);
          }}
          onProcessUpdated={handleProcessUpdated}
        />
      )}
    </div>
  );
}

export default ProcessTableAdmin;
