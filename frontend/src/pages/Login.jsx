import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login nahi ho saka, dobara koshish karein');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <span className="brand-knot brand-knot--xl" aria-hidden="true">
            <svg viewBox="0 0 32 20" width="46" height="29">
              <path d="M2 4 C 12 4, 12 16, 22 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M30 16 C 20 16, 20 4, 10 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
              <circle cx="2" cy="4" r="2.6" fill="currentColor" />
              <circle cx="30" cy="16" r="2.6" fill="currentColor" opacity="0.55" />
            </svg>
          </span>
          <h1>Teach one. Learn one.</h1>
          <p>
            Find a student whose skills complete yours — you teach what you know, they teach what
            you want to learn. When it's a match, jump straight into a Google Meet session.
          </p>
          <div className="auth-visual-tags">
            <span>React ⇄ UI Design</span>
            <span>Python ⇄ DSA</span>
            <span>Figma ⇄ Copywriting</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="auth-sub">Log in to see your matches and swap requests.</p>

          {error && <div className="form-error">{error}</div>}

          <label className="field">
            <span>Email</span>
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="auth-switch">
            New to SkillSwap? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
