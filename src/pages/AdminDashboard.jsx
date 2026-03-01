import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

/* ════════════════════════════════════════════
   Icons (inline SVGs)
   ════════════════════════════════════════════ */
const I = {
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    zap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    activity: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    dollar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    up: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    down: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>,
    server: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    cpu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09" /></svg>,
    alertTri: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    archive: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    checkCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    menuIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    chevLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
}

/* ════════════════════════════════════════════
   Data
   ════════════════════════════════════════════ */
const metrics = [
    { title: 'Active Agents', value: '47', change: '+5', positive: true, icon: I.zap, accent: '#4E8EFF', rgb: '78,142,255' },
    { title: 'Total Requests', value: '156K', change: '+8%', positive: true, icon: I.activity, accent: '#34D399', rgb: '52,211,153' },
    { title: 'Active Users', value: '2.4K', change: '+12%', positive: true, icon: I.users, accent: '#A78BFA', rgb: '167,139,250' },
    { title: 'Platform Cost', value: '$12,450', change: '-3%', positive: false, icon: I.dollar, accent: '#FBBF24', rgb: '251,191,36' },
]

const health = [
    { name: 'API Gateway', uptime: 99.99, status: 'healthy', icon: I.server },
    { name: 'Model Inference', uptime: 99.95, status: 'healthy', icon: I.cpu },
    { name: 'Data Plane', uptime: 98.50, status: 'degraded', icon: I.layers },
    { name: 'Tool Plane', uptime: 99.90, status: 'healthy', icon: I.settings },
]

const agents = [
    { name: 'Customer Support Bot', requests: '45K', score: 98.5, fill: 95 },
    { name: 'Document Analyzer', requests: '32K', score: 97.2, fill: 78 },
    { name: 'Code Assistant', requests: '28.5K', score: 97.8, fill: 68 },
    { name: 'Data Extractor', requests: '21K', score: 98.3, fill: 55 },
]

const alerts = [
    { text: 'Data Plane latency spike detected', time: '2 min ago', severity: 'warning' },
    { text: 'Model inference auto-scaled to 8 replicas', time: '15 min ago', severity: 'info' },
    { text: 'New governance policy applied', time: '1 hr ago', severity: 'success' },
]

const quickActions = [
    { label: 'Deploy Agent', icon: I.zap, desc: 'Launch a new agent' },
    { label: 'Create API Key', icon: I.key, desc: 'Generate credentials' },
    { label: 'Health Check', icon: I.activity, desc: 'Run diagnostics' },
    { label: 'Review Policies', icon: I.shield, desc: 'Governance rules' },
    { label: 'Workspaces', icon: I.grid, desc: 'Manage spaces' },
    { label: 'View Logs', icon: I.clock, desc: 'Activity timeline' },
]

const sidebarSections = [
    {
        label: 'OVERVIEW',
        items: [{ name: 'Home', icon: I.home, active: true }],
    },
    {
        label: 'PLATFORM MANAGEMENT',
        items: [
            { name: 'Platform Overview', icon: I.grid },
            { name: 'Use Case Management', icon: I.briefcase },
            { name: 'API Keys', icon: I.key },
            { name: 'Model Onboarding', icon: I.box, href: '/persona/admin/models' },
            // { name: 'All Workspaces', icon: I.layers },
            // { name: 'Asset Registry', icon: I.archive },
        ],
    },
    {
        label: 'GOVERNANCE',
        items: [
            { name: 'Policies', icon: I.shield, href: '/persona/admin/policies' },
            { name: 'Templates', icon: I.layers, href: '/persona/admin/templates' },
            // { name: "Guardrails Config", icon: I.settings, href: '/persona/admin/guardrails' },
            // { name: 'Policy Engine', icon: I.cpu },
            // { name: 'Approvals & Gates', icon: I.checkCircle },
        ],
    },
    // {
    //     label: 'INFRASTRUCTURE',
    //     items: [
    //         { name: 'Compute Resources', icon: I.server },
    //         { name: 'Monitoring', icon: I.activity },
    //     ],
    // },
]

const tabs = ['Health Dashboard', 'Management Hub', 'Activity Overview']

/* ════════════════════════════════════════════
   Component
   ════════════════════════════════════════════ */
export default function AdminDashboard({ theme, onToggleTheme }) {
    const [activeTab, setActiveTab] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)

    return (
        <div className="dash">
            {/* ─── Sidebar ─── */}
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
                    {sidebarSections.map((section, si) => (
                        <div key={si} className="dash__nav-section">
                            <div className="dash__nav-label">
                                {(sidebarOpen || sidebarPeek) ? section.label : <span className="dash__nav-label-dot" />}
                            </div>
                            {section.items.map((item, ii) => {
                                const cls = `dash__nav-item ${item.active ? 'dash__nav-item--active' : ''}`
                                const inner = <><span className="dash__nav-icon">{item.icon}</span><span className="dash__nav-text">{item.name}</span></>
                                return item.href ? (
                                    <Link key={ii} to={item.href} className={cls} title={!(sidebarOpen || sidebarPeek) ? item.name : undefined}>{inner}</Link>
                                ) : (
                                    <button key={ii} className={cls} title={!(sidebarOpen || sidebarPeek) ? item.name : undefined}>{inner}</button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </nav>

            {/* ─── Right content area ─── */}
            <div className="dash__content">
                {/* ─── Top Bar ─── */}
                <header className="dash__header">
                    <div className="dash__header-left">
                        <Link to="/enter" className="dash__persona-link">
                            {I.chevDown}
                            <span>Change Persona</span>
                        </Link>
                    </div>
                    <div className="dash__header-center">
                        <span className="dash__header-title">GenAI Studio</span>
                        <span className="dash__persona-tag">Platform Admin</span>
                    </div>
                    <div className="dash__header-right">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                        <button className="dash__icon-btn" aria-label="Notifications">
                            {I.bell}
                            <span className="dash__notif-dot" />
                        </button>
                        <div className="dash__avatar">PA</div>
                    </div>
                </header>

                {/* ─── Tab Bar ─── */}
                <div className="dash__tabbar">
                    <div className="dash__tabs">
                        {tabs.map((t, i) => (
                            <button key={t} className={`dash__tab ${activeTab === i ? 'dash__tab--active' : ''}`} onClick={() => setActiveTab(i)}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <span className="dash__time">{I.clock} Last updated: just now</span>
                </div>

                {/* ─── Scrollable Main ─── */}
                <main className="dash__main">
                    {/* Metrics row */}
                    <section className="dash__metrics">
                        {metrics.map((m, i) => (
                            <div key={i} className="mcard" style={{ '--mc': m.accent, '--mc-rgb': m.rgb }}>
                                <div className="mcard__top">
                                    <div className="mcard__icon-ring">{m.icon}</div>
                                    <span className={`mcard__badge ${m.positive ? 'mcard__badge--up' : 'mcard__badge--down'}`}>
                                        {m.positive ? I.up : I.down}
                                        {m.change}
                                    </span>
                                </div>
                                <div className="mcard__value">{m.value}</div>
                                <div className="mcard__label">{m.title}</div>
                            </div>
                        ))}
                    </section>

                    {/* Bento grid */}
                    <section className="dash__bento">
                        {/* System Health — spans 7 cols */}
                        <div className="bcard bcard--health">
                            <div className="bcard__head">
                                <h3 className="bcard__title">System Health</h3>
                                <button className="bcard__link">View Details {I.arrowRight}</button>
                            </div>
                            <div className="health-grid">
                                {health.map((h, i) => (
                                    <div key={i} className={`health-tile health-tile--${h.status}`}>
                                        <div className="health-tile__top">
                                            <span className="health-tile__icon">{h.icon}</span>
                                            <span className={`health-tile__pill health-tile__pill--${h.status}`}>{h.status}</span>
                                        </div>
                                        <div className="health-tile__name">{h.name}</div>
                                        <div className="health-tile__bar-track">
                                            <div className="health-tile__bar-fill" style={{ width: `${h.uptime}%` }} />
                                        </div>
                                        <div className="health-tile__uptime">{h.uptime.toFixed(2)}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Agents — spans 5 cols */}
                        <div className="bcard bcard--agents">
                            <div className="bcard__head">
                                <h3 className="bcard__title">Top Performing Agents</h3>
                                <button className="bcard__link">View All {I.arrowRight}</button>
                            </div>
                            <div className="agents-list">
                                {agents.map((a, i) => (
                                    <div key={i} className="agent">
                                        <div className="agent__rank">{i + 1}</div>
                                        <div className="agent__info">
                                            <div className="agent__top">
                                                <span className="agent__name">{a.name}</span>
                                                <span className="agent__score">{a.score}%</span>
                                            </div>
                                            <div className="agent__bar">
                                                <div className="agent__fill" style={{ width: `${a.fill}%` }} />
                                            </div>
                                            <span className="agent__reqs">{a.requests} requests</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Alerts — spans 5 cols */}
                        <div className="bcard bcard--alerts">
                            <div className="bcard__head">
                                <h3 className="bcard__title">Recent Alerts</h3>
                                <button className="bcard__link">View All {I.arrowRight}</button>
                            </div>
                            <div className="alerts-list">
                                {alerts.map((a, i) => (
                                    <div key={i} className="alert-item">
                                        <span className={`alert-item__dot alert-item__dot--${a.severity}`} />
                                        <div className="alert-item__body">
                                            <span className="alert-item__text">{a.text}</span>
                                            <span className="alert-item__time">{a.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions — spans 7 cols */}
                        <div className="bcard bcard--actions">
                            <div className="bcard__head">
                                <h3 className="bcard__title">Quick Actions</h3>
                            </div>
                            <div className="qa-grid">
                                {quickActions.map((qa, i) => (
                                    <button key={i} className="qa-btn">
                                        <span className="qa-btn__icon">{qa.icon}</span>
                                        <span className="qa-btn__label">{qa.label}</span>
                                        <span className="qa-btn__desc">{qa.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
