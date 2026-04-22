import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/users')
            .then(({ data }) => setUsers(data.data || []))
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fef2f2' }}>
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #fecaca',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600
                    }}>ADMIN</span>
                    <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Admin Dashboard</h1>
                </div>
                <button
                    onClick={logout}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'transparent',
                        border: '1px solid #e2e8f0',
                        fontSize: 13,
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </header>

            <main style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
                <div style={{
                    background: '#fff',
                    border: '1px solid #fecaca',
                    borderRadius: 12,
                    padding: '2rem',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                        Welcome, {user?.name || 'Admin'}! 🛡️
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 14 }}>
                        You are logged in as an <strong>administrator</strong>. You have full access to system management.
                    </p>
                </div>

                <div style={{
                    background: '#fff',
                    border: '1px solid #fecaca',
                    borderRadius: 12,
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                        All Registered Users
                    </h3>

                    {loading && (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
                            Loading users...
                        </p>
                    )}

                    {error && (
                        <p style={{ color: '#dc2626', fontSize: 13, padding: '1rem', background: '#fef2f2', borderRadius: 8 }}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
                            No users found.
                        </p>
                    )}

                    {!loading && users.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: '#fef2f2' }}>
                                    {['Name', 'Email', 'Role', 'Status'].map(col => (
                                        <th key={col} style={{
                                            padding: '10px 12px',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            color: '#374151',
                                            borderBottom: '1px solid #fecaca'
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px 12px', color: '#1e293b', fontWeight: 500 }}>{u.name}</td>
                                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{u.email}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                background: u.role === 'admin' ? '#fee2e2' : '#dcfce7',
                                                color: u.role === 'admin' ? '#dc2626' : '#16a34a'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                fontSize: 11,
                                                background: u.isActive ? '#dcfce7' : '#f1f5f9',
                                                color: u.isActive ? '#16a34a' : '#64748b'
                                            }}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem 1.25rem',
                    background: '#dbeafe',
                    border: '1px solid #93c5fd',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#1e40af'
                }}>
                    🔐 This page is restricted to administrators only. Regular users cannot access this dashboard.
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
