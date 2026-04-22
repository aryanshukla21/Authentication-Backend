import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await registerUser(form);
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error("Validation Errors:", err.response?.data?.errors);

            setError(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, border: '1px solid #e2e8f0', width: '100%', maxWidth: 400 }}>
                <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Create account</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Start managing your tasks today</p>
                <form onSubmit={handleSubmit}>
                    {['name', 'email', 'password'].map(field => (
                        <div key={field} style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
                            <input
                                name={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                value={form[field]} onChange={handleChange} required
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '11px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
                <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};
export default Register;