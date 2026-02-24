import Header from '../components/common/Header';
import MetricsDashboard from '../components/common/MetricsDashboard';
import GuestView from '../components/guest/GuestView';
import UserView from '../components/user/UserView';
import AdminView from '../components/admin/AdminView';

function MonitoringPage({ user, onLogout }) {
  return (
    <div className="monitoring-page">
      <Header role={user.role} userName={user.username} onLogout={onLogout} />
      <MetricsDashboard />
      
      {user.role === 'guest' && <GuestView />}
      {user.role === 'user' && <UserView />}
      {user.role === 'admin' && <AdminView />}
    </div>
  );
}

export default MonitoringPage;