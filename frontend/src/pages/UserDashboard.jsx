import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4' }}>
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #bbf7d0',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        background: '#22c55e',
                        color: '#fff',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600
                    }}>USER</span>
                    <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>User Dashboard</h1>
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

            <main style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
                <div style={{
                    background: '#fff',
                    border: '1px solid #bbf7d0',
                    borderRadius: 12,
                    padding: '2rem',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                        Welcome, {user?.name || 'User'}! 👋
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 14 }}>
                        You are logged in as a <strong>regular user</strong>.
                    </p>
                </div>

                <div style={{
                    background: '#fff',
                    border: '1px solid #bbf7d0',
                    borderRadius: 12,
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Your Account Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: 'Name', value: user?.name || '—' },
                            { label: 'Email', value: user?.email || user?.id || '—' },
                            { label: 'Role', value: user?.role || 'user' },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
                                <span style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: label === 'Role' ? '#22c55e' : '#1e293b',
                                    textTransform: label === 'Role' ? 'capitalize' : 'none'
                                }}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem 1.25rem',
                    background: '#fef9c3',
                    border: '1px solid #fde047',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#854d0e'
                }}>
                    ⚠️ You do not have access to the Admin Dashboard. Admin routes are restricted to administrators only.
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
