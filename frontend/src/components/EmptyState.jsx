const EmptyState = ({ title, message, action }) => (
  <div className="empty-state">
    <div className="empty-state-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" width="40" height="40">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" />
        <path d="M17 24h14M24 17v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
    <h3>{title}</h3>
    <p>{message}</p>
    {action}
  </div>
);

export default EmptyState;
