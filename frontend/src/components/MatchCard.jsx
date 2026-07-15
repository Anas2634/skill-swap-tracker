import SkillChip from './SkillChip';

const MatchCard = ({ match, onRequest, requestState }) => {
  const { user, theyCanTeachYou, youCanTeachThem, experience, availability } = match;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <article className="match-card">
      <div className="match-card-top">
        <span className="avatar-chip avatar-chip--lg">{initials}</span>
        <div>
          <h3>{user?.name}</h3>
          {user?.city && <p className="muted">{user.city}</p>}
        </div>
        <span className="match-badge">Perfect match</span>
      </div>

      {user?.bio && <p className="match-bio">{user.bio}</p>}

      <div className="swap-row">
        <div className="swap-col">
          <p className="swap-label">They teach you</p>
          <div className="chip-row">
            {theyCanTeachYou.map((s) => (
              <SkillChip key={s} label={s} variant="teach" />
            ))}
          </div>
        </div>
        <span className="swap-knot" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="swap-col">
          <p className="swap-label">You teach them</p>
          <div className="chip-row">
            {youCanTeachThem.map((s) => (
              <SkillChip key={s} label={s} variant="learn" />
            ))}
          </div>
        </div>
      </div>

      <div className="match-meta">
        {experience && <span>Level: {experience}</span>}
        {availability && <span>Available: {availability}</span>}
      </div>

      <button
        className="btn btn-primary btn-block"
        disabled={requestState === 'sent' || requestState === 'sending'}
        onClick={() => onRequest(user._id)}
      >
        {requestState === 'sent'
          ? 'Request sent'
          : requestState === 'sending'
          ? 'Sending…'
          : 'Send swap request'}
      </button>
    </article>
  );
};

export default MatchCard;
