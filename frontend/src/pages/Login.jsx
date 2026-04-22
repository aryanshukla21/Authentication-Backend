import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await loginUser(form);
            login(data.token);
            const role = data.data?.role;
            const destination = role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
            navigate(from === '/dashboard' ? destination : from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, border: '1px solid #e2e8f0', width: '100%', maxWidth: 400 }}>
                <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Welcome back</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Sign in to your account</p>
                <form onSubmit={handleSubmit}>
                    {['email', 'password'].map(field => (
                        <div key={field} style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
                            <input
                                name={field} type={field === 'password' ? 'password' : 'email'}
                                value={form[field]} onChange={(e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} required
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '11px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: '#64748b' }}>
                    No account? <Link to="/register" style={{ color: '#3b82f6' }}>Create one</Link>
                </p>
            </div>
        </div>
    );
};
export default Login;