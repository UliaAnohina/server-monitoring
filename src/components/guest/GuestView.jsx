import MetricsDashboard from '../common/MetricsDashboard';

function GuestView() {
  return (
    <div className="guest-view">
      <MetricsDashboard userRole="Гость" />
    </div>
  );
}

export default GuestView;