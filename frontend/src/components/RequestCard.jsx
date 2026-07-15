const statusLabel = {
  pending: 'Pending',
  accepted: 'Matched',
  rejected: 'Declined',
};

const RequestCard = ({ request, direction, onAccept, onReject, busy }) => {
  const person = direction === 'sent' ? request.receiverId : request.senderId;
  const initials = person?.name
    ? person.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <article className={`request-card request-card--${request.status}`}>
      <div className="request-card-main">
        <span className="avatar-chip">{initials}</span>
        <div className="request-card-info">
          <h4>{person?.name}</h4>
          {person?.city && <p className="muted">{person.city}</p>}
        </div>
        <span className={`status-pill status-pill--${request.status}`}>
          {statusLabel[request.status]}
        </span>
      </div>

      {request.status === 'pending' && direction === 'received' && (
        <div className="request-card-actions">
          <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => onAccept(request._id)}>
            Accept
          </button>
          <button className="btn btn-outline btn-sm" disabled={busy} onClick={() => onReject(request._id)}>
            Decline
          </button>
        </div>
      )}

      {request.status === 'pending' && direction === 'sent' && (
        <p className="request-waiting">Waiting for {person?.name?.split(' ')[0]} to respond…</p>
      )}

      {request.status === 'accepted' && request.meetLink && (
        <a
          className="btn btn-meet btn-block"
          href={request.meetLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="live-dot" aria-hidden="true" />
          Join Google Meet
        </a>
      )}

      {request.status === 'rejected' && <p className="request-waiting muted">This swap didn't go ahead.</p>}
    </article>
  );
};

export default RequestCard;
