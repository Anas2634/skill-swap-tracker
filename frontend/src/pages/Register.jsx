import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', email: '', password: '', confirm: '' };

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Force-clear the form on every mount so browser autofill
  // cannot silently pre-populate old user data.
  useEffect(() => {
    setForm(emptyForm);
    setError('');
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Password and confirm password do not match ');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      // Clear the form immediately after successful registration
      setForm(emptyForm);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create the account. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual auth-visual--alt">
        <div className="auth-visual-inner">
          <span className="brand-knot brand-knot--xl" aria-hidden="true">
            <svg viewBox="0 0 32 20" width="46" height="29">
              <path d="M2 4 C 12 4, 12 16, 22 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M30 16 C 20 16, 20 4, 10 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
              <circle cx="2" cy="4" r="2.6" fill="currentColor" />
              <circle cx="30" cy="16" r="2.6" fill="currentColor" opacity="0.55" />
            </svg>
          </span>
          <h1>Every skill you know is someone's next lesson.</h1>
          <p>
            Add what you can teach and what you want to learn. We'll match you with a student
            heading the opposite way, then hand you both a video call link to get started.
          </p>
          <ul className="auth-visual-steps">
            <li>List your teach &amp; learn skills</li>
            <li>Get matched automatically</li>
            <li>Accept a request → meet on a video call</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
          <h2>Create your account</h2>
          <p className="auth-sub">Takes less than a minute.</p>

          {error && <div className="form-error">{error}</div>}

          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder=""
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="You can also use a dummy email"
              autoComplete="off"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder=""
                autoComplete="new-password"
              />
            </label>
            <label className="field">
              <span>Confirm</span>
              <input
                type="password"
                name="confirm"
                required
                value={form.confirm}
                onChange={handleChange}
                placeholder=""
                autoComplete="new-password"
              />
            </label>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;