import { useState } from 'react';
import { manageProcess } from '../../apiService';
import './ProcessManagementModal.css';

function ProcessManagementModal({ process, onClose, onProcessUpdated }) {
  const [action, setAction] = useState(null); // 'terminate', 'terminateTree', 'priority'
  const [newPriority, setNewPriority] = useState(process.priority || 0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleTerminate = (terminateTree = false) => {
    setAction(terminateTree ? 'terminateTree' : 'terminate');
    setShowConfirm(true);
    setError('');
  };

  const handleChangePriority = () => {
    setAction('priority');
    setShowConfirm(true);
    setError('');
  };

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const apiAction = action === 'terminate'
        ? 'kill'
        : action === 'terminateTree'
          ? 'kill_tree'
          : 'priority';

      await manageProcess(process.pid, apiAction, true, {
        priority: apiAction === 'priority' ? newPriority : undefined
      });

      if (action === 'terminate') {
        onProcessUpdated(process.pid, 'terminate');
      } else if (action === 'terminateTree') {
        onProcessUpdated(process.pid, 'terminateTree');
      } else if (action === 'priority') {
        onProcessUpdated(process.pid, 'priority', newPriority);
      }

      setShowConfirm(false);
      onClose();
    } catch (e) {
      setError(e.message || 'Ошибка управления процессом');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!showConfirm ? (
          <>
            <div className="modal-header">
              <h3>Управление процессом</h3>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>
            
            <div className="process-info">
              <p><strong>Процесс:</strong> {process.name} (PID: {process.pid})</p>
              <p><strong>Текущий приоритет:</strong> {process.priority || 0}</p>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-danger"
                onClick={() => handleTerminate(false)}
              >
                Завершить процесс
              </button>
              
              <button 
                className="btn btn-warning"
                onClick={() => handleTerminate(true)}
              >
                Завершить дерево процессов
              </button>
              
              <div className="priority-section">
                <label>Изменить приоритет:</label>
                <div className="priority-input-group">
                  <input
                    type="number"
                    min="-20"
                    max="19"
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value))}
                    className="priority-input"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleChangePriority}
                  >
                    Применить
                  </button>
                </div>
                <small>Допустимый диапазон: от -20 до 19</small>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Отмена
              </button>
            </div>
          </>
        ) : (
          // Окно подтверждения
          <div className="confirm-dialog">
            <h3>Подтверждение действия</h3>
            <p className="confirm-message">
              {action === 'terminate' && `Вы действительно хотите завершить процесс ${process.name}?`}
              {action === 'terminateTree' && `Вы действительно хотите завершить дерево процессов ${process.name}? Это затронет все дочерние процессы.`}
              {action === 'priority' && `Вы действительно хотите изменить приоритет процесса ${process.name} на ${newPriority}?`}
            </p>
            <p className="confirm-warning">
              ⚠️ Это действие может повлиять на работу системы!
            </p>

            {error && (
              <p className="confirm-error">
                {error}
              </p>
            )}
            
            <div className="confirm-buttons">
              <button className="btn btn-danger" onClick={handleConfirm} disabled={isProcessing}>
                {isProcessing ? 'Выполнение...' : 'Подтвердить'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessManagementModal;