import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/task.api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const STATUSES = ['pending', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const statusColors = { pending: '#fef9c3', in_progress: '#dbeafe', done: '#dcfce7' };
const statusText = { pending: '#854d0e', in_progress: '#1e40af', done: '#166534' };

const Dashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });
    const [filter, setFilter] = useState({ status: '', priority: '' });

    const showToast = (message, type = 'success') => setToast({ message, type });

    const fetchTasks = useCallback(async () => {
        try {
            const params = {};
            if (filter.status) params.status = filter.status;
            if (filter.priority) params.priority = filter.priority;
            const { data } = await getTasks(params);
            setTasks(data.data);
        } catch { showToast('Failed to load tasks', 'error'); }
        finally { setLoading(false); }
    }, [filter]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const openCreate = () => { setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' }); setModal('create'); };
    const openEdit = (task) => { setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority }); setModal({ type: 'edit', id: task.id }); };

    const handleSave = async () => {
        try {
            if (modal === 'create') { await createTask(form); showToast('Task created'); }
            else { await updateTask(modal.id, form); showToast('Task updated'); }
            setModal(null);
            fetchTasks();
        } catch (err) { showToast(err.response?.data?.message || 'Error saving task', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try { await deleteTask(id); showToast('Task deleted'); fetchTasks(); }
        catch { showToast('Failed to delete task', 'error'); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 600 }}>TaskManager</h1>
                    <p style={{ fontSize: 12, color: '#64748b' }}>{user?.role === 'admin' ? 'Admin — all tasks' : `${user?.name || 'User'}'s tasks`}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={openCreate} style={{ padding: '8px 16px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontSize: 13, cursor: 'pointer' }}>+ New task</button>
                    <button onClick={logout} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #e2e8f0', fontSize: 13, cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            <main style={{ padding: '1.5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {['status', 'priority'].map(key => (
                        <select key={key} value={filter[key]} onChange={e => setFilter(p => ({ ...p, [key]: e.target.value }))}
                            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }}>
                            <option value="">All {key}</option>
                            {(key === 'status' ? STATUSES : PRIORITIES).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                        </select>
                    ))}
                </div>

                {loading ? <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 60 }}>Loading tasks...</p> :
                    tasks.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 60 }}>No tasks yet. Create one to get started.</p> :
                        tasks.map(task => (
                            <div key={task.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{task.title}</h3>
                                        {task.description && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{task.description}</p>}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: statusColors[task.status], color: statusText[task.status] }}>{task.status.replace('_', ' ')}</span>
                                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#475569' }}>{task.priority}</span>
                                            {isAdmin && task.owner && <span style={{ fontSize: 11, color: '#94a3b8' }}>by {task.owner.name}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(task)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff' }}>Edit</button>
                                        <button onClick={() => handleDelete(task.id)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #fca5a5', color: '#dc2626', cursor: 'pointer', background: '#fff' }}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
            </main>

            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: '100%', maxWidth: 480 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>{modal === 'create' ? 'Create task' : 'Edit task'}</h2>
                        {['title', 'description'].map(field => (
                            <div key={field} style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
                                {field === 'description'
                                    ? <textarea name={field} value={form[field]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, resize: 'vertical' }} />
                                    : <input name={field} value={form[field]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} required={field === 'title'} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                                }
                            </div>
                        ))}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                            {['status', 'priority'].map(field => (
                                <div key={field}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
                                    <select name={field} value={form[field]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
                                        {(field === 'status' ? STATUSES : PRIORITIES).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                            <button onClick={() => setModal(null)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, cursor: 'pointer', background: '#fff' }}>Cancel</button>
                            <button onClick={handleSave} style={{ padding: '9px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontSize: 13, cursor: 'pointer' }}>Save task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Dashboard;