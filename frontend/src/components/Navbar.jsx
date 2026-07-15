import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="brand">
          <span className="brand-knot" aria-hidden="true">
            <svg viewBox="0 0 32 20" width="30" height="19">
              <path d="M2 4 C 12 4, 12 16, 22 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M30 16 C 20 16, 20 4, 10 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
              <circle cx="2" cy="4" r="2.6" fill="currentColor" />
              <circle cx="30" cy="16" r="2.6" fill="currentColor" opacity="0.45" />
            </svg>
          </span>
          SkillSwap
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
          <NavLink to="/matches" className={({ isActive }) => (isActive ? 'active' : '')}>
            Matches
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => (isActive ? 'active' : '')}>
            Requests
          </NavLink>
        </nav>

        <div className="navbar-user">
          <span className="avatar-chip">{initials}</span>
          <span className="navbar-username">{user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
