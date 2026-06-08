import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submit, setSubmit] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmit(true);
    try {
      await signup(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmit(false);
    }
  }

  return (
    <section className="form-page form-page--narrow">
      <h1>Create an account</h1>
      <p className="muted">
        Already have an existing account? <Link to="/login">Log in</Link>.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="alert alert--error">{error}</div>}
        <label className="field">
          <span className="field-label">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            placeholder="At least 8 characters"
          />
        </label>
        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={submit}>
            {submit ? 'Creating…' : 'Sign up'}
          </button>
        </div>
      </form>
    </section>
  );
}
