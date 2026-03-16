import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ─── Icons ─── */
const I = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    calc: <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>
};

const getSidebarSections = (pathname) => [
    {
        label: 'OVERVIEW', items: [
            { name: 'Home', icon: I.home, active: pathname === '/persona/consumer', href: '/persona/consumer' }
        ]
    },
    {
        label: 'TOOLS', items: [
            { name: 'Token Calculator', icon: I.calc, active: pathname === '/calculator', href: '/calculator' }
        ]
    }
];

export default function ConsumerSidebar({ sidebarOpen, setSidebarOpen }) {
    const [sidebarPeek, setSidebarPeek] = React.useState(false);
    const location = useLocation();
    const sidebarSections = getSidebarSections(location.pathname);

    return (
        <nav className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : ''}`}
            onMouseEnter={() => { if (!sidebarOpen) setSidebarPeek(true) }}
            onMouseLeave={() => setSidebarPeek(false)}>
            <div className="dash__sidebar-top">
                <div className="dash__sidebar-logo">
                    <svg viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L25 8v12l-11 6L3 20V8l11-6z" stroke="#34D399" strokeWidth="1.5" fill="rgba(52, 211, 153, 0.1)" />
                        <path d="M14 8l6 6-6 6-6-6 6-6z" fill="#34D399" opacity="0.8" />
                        <circle cx="14" cy="14" r="2" fill="var(--bg-navy)" />
                    </svg>
                </div>
                {(sidebarOpen || sidebarPeek) && <span className="dash__sidebar-brand">GenAI Studio</span>}
                <button className={`dash__sidebar-toggle ${sidebarOpen ? 'dash__sidebar-toggle--open' : ''}`} onClick={() => { setSidebarOpen(o => !o); setSidebarPeek(false) }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
            </div>
            <div className="dash__sidebar-nav">
                {sidebarSections.map((s, si) => (
                    <div key={si} className="dash__nav-section">
                        <div className="dash__nav-label">{(sidebarOpen || sidebarPeek) ? s.label : <span className="dash__nav-label-dot" />}</div>
                        {s.items.map((it, ii) => {
                            const El = it.href ? Link : 'button';
                            return <El key={ii} to={it.href} className={`dash__nav-item ${it.active ? 'dash__nav-item--active' : ''}`} title={!(sidebarOpen || sidebarPeek) ? it.name : undefined}><span className="dash__nav-icon">{it.icon}</span><span className="dash__nav-text">{it.name}</span></El>;
                        })}
                    </div>
                ))}
            </div>
        </nav>
    );
}
