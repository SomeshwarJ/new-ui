import React from 'react';
import ThemeToggle from './ThemeToggle';
import UserProfileDrop from './UserProfileDrop';
import { useNavigate } from 'react-router-dom';

const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
)

export default function ConsumerHeader({ theme, onToggleTheme, title = "GenAI Studio" }) {
    const navigate = useNavigate();
    return (
        <nav className="consumer-topbar" aria-label="Navigation">
            <button className="consumer-topbar__back" onClick={() => navigate('/')}>
                <ArrowLeft />
                Change Persona
            </button>
            <div className="consumer-topbar__center">
                <span className="consumer-topbar__persona-pill" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                    <span className="consumer-topbar__persona-dot" style={{ backgroundColor: '#34D399' }} />
                    Consumer
                </span>
                <span className="consumer-topbar__name">{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                <UserProfileDrop />
            </div>
        </nav>
    );
}
