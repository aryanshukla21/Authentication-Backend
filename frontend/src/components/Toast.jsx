import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = {
        success: { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
        error: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
        info: { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
    };
    const c = colors[type] || colors.info;

    return (
        <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            padding: '12px 20px', borderRadius: 8,
            background: c.bg, border: `1px solid ${c.border}`,
            color: c.text, fontSize: 14, maxWidth: 320,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
            {message}
        </div>
    );
};

export default Toast;