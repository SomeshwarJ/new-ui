import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const I = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    chevLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
    calc: <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>,
    analytics: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H4.6A1.6 1.6 0 0 1 3 19.4V3"/><polyline points="7 14 11 10 14 13 19 7"/></svg>
};

const sidebarSections = [
    { label: 'OVERVIEW', items: [{ name: 'Home', icon: I.home, href: '/persona/admin' }] },
    {
        label: 'PLATFORM MANAGEMENT', items: [
            { name: 'Platform Overview', icon: I.grid },
            { name: 'Use Case Management', icon: I.briefcase },
            { name: 'API Keys', icon: I.key },
            { name: 'Model Onboarding', icon: I.box, href: '/persona/admin/models' },
            { name: 'Model Evaluation', icon: I.clipboardCheck, href: '/persona/admin/evaluate' },
            { name: 'Monitoring & Metrics', icon: I.barChart2, href: '/persona/admin/observability' },
        ]
    },
    {
        label: 'STUDIO', items: [
            { name: 'AI Playground', icon: I.terminal, href: '/persona/admin/playground' },
            { name: 'Token Calculator', icon: I.calc, href: '/persona/admin/calculator' },
            { name: 'Prompt Analytics', icon: I.analytics, href: '/persona/admin/prompt-analytics' },
        ],
    },
    {
        label: 'GOVERNANCE', items: [
            { name: 'Policies', icon: I.shield, href: '/persona/admin/policies' },
            { name: 'Templates', icon: I.layers, href: '/persona/admin/templates' },
        ]
    }
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
    const [sidebarPeek, setSidebarPeek] = useState(false);
    const location = useLocation();

    return (
        <nav className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : ''}`}
            onMouseEnter={() => { if (!sidebarOpen) setSidebarPeek(true) }}
            onMouseLeave={() => setSidebarPeek(false)}>
            <div className="dash__sidebar-top">
                <div className="dash__sidebar-logo">
                    <svg viewBox="0 0 28 28" fill="none"><path d="M14 2L25 8v12l-11 6L3 20V8l11-6z" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(78,142,255,0.1)" /><path d="M14 8l6 6-6 6-6-6 6-6z" fill="var(--accent)" opacity="0.8" /><circle cx="14" cy="14" r="2" fill="var(--bg-navy)" /></svg>
                </div>
                {(sidebarOpen || sidebarPeek) && <span className="dash__sidebar-brand">GenAI Studio</span>}
                <button
                    className={`dash__sidebar-toggle ${sidebarOpen ? 'dash__sidebar-toggle--open' : ''}`}
                    onClick={() => { setSidebarOpen(o => !o); setSidebarPeek(false) }}
                    aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
            </div>
            <div className="dash__sidebar-nav">
                {sidebarSections.map((s, si) => (
                    <div key={si} className="dash__nav-section">
                        <div className="dash__nav-label">
                            {(sidebarOpen || sidebarPeek) ? s.label : <span className="dash__nav-label-dot" />}
                        </div>
                        {s.items.map((it, ii) => {
                            const El = it.href ? Link : 'button';
                            const isActive = it.href && location.pathname.startsWith(it.href) && (it.href !== '/persona/admin' || location.pathname === '/persona/admin');
                            return (
                                <El key={ii} to={it.href} className={`dash__nav-item ${isActive ? 'dash__nav-item--active' : ''}`} title={!(sidebarOpen || sidebarPeek) ? it.name : undefined}>
                                    <span className="dash__nav-icon">{it.icon}</span>
                                    <span className="dash__nav-text">{it.name}</span>
                                </El>
                            );
                        })}
                    </div>
                ))}
            </div>
        </nav>
    );
}
