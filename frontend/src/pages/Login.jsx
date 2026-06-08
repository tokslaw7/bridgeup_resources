import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmit(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
            setSubmit(false);
        }
    }

    return (
        <section className="form-page form-page--narrow">
            <h1>Log in</h1>
            <p className="muted">
                Welcome back. Don’t have an account? <Link to="/register">Sign up</Link>.
            </p>
            <form className="form" onSubmit={handleSubmit}>
                {error && <div className="alert alert--error">{error}</div>}
                <label className="field">
                    <span className="field__label">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="field">
                    <span className="field__label">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <div className="form__actions">
                    <button type="submit" className="btn btn--primary" disabled={submit}>
                        {submit ? 'Logging in…' : 'Log in'}
                    </button>
                </div>
            </form>
            <p className="muted demo-hint">
                Demo account: <code>toks@bridgeup.local</code> / <code>password123</code>
            </p>
        </section>
    );
}
