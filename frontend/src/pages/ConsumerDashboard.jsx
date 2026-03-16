import React, { useState } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ConsumerSidebar from '../components/ConsumerSidebar';
import ConsumerHeader from '../components/ConsumerHeader';

/* ─── Icons ─── */
const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
)
const LaunchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const CommandIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
)
const ObsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
)
const InsightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)
const BoltIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
)
const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

/* ─── Mock data ─── */
const apps = [
    { id: 1, name: 'Contract Analyzer Pro', category: 'Legal', rating: 4.9, uses: '12.4k', accent: '#34D399', desc: 'AI-powered contract review and risk flagging.', tag: 'Featured' },
    { id: 2, name: 'HR Policy Bot', category: 'HR', rating: 4.7, uses: '8.2k', accent: '#4E8EFF', desc: 'Instant answers to employee policy questions.', tag: 'New' },
    { id: 3, name: 'Code Review Agent', category: 'Engineering', rating: 4.8, uses: '21k', accent: '#F59E0B', desc: 'Automated PR review with style & security checks.', tag: 'Popular' },
    { id: 4, name: 'Market Intel Assistant', category: 'Sales', rating: 4.6, uses: '5.7k', accent: '#A78BFA', desc: 'Real-time competitive intelligence & insights.', tag: '' },
    { id: 5, name: 'Support Triage AI', category: 'Support', rating: 4.9, uses: '34k', accent: '#F87171', desc: 'Automatically routes and prioritizes tickets.', tag: 'Popular' },
    { id: 6, name: 'Data Summarizer', category: 'Analytics', rating: 4.5, uses: '9.1k', accent: '#38BDF8', desc: 'Transforms raw reports into executive summaries.', tag: '' },
]

const stats = [
    { label: 'Apps Available', value: '24', delta: '+3 this week', color: '#34D399' },
    { label: 'Queries Today', value: '1,847', delta: '+12%', color: '#4E8EFF' },
    { label: 'Avg. Latency', value: '342ms', delta: '−18ms', color: '#A78BFA' },
    { label: 'Tokens Used', value: '2.1M', delta: 'of 5M limit', color: '#F59E0B' },
]

const activityLog = [
    { time: '2 min ago', event: 'Ran Contract Analyzer on Q1_Agreement.pdf', model: 'gemini-1.5-pro', tokens: '4,120' },
    { time: '18 min ago', event: 'HR Policy Bot answered 3 questions', model: 'gpt-4o', tokens: '890' },
    { time: '1 hr ago', event: 'Code Review Agent reviewed PR #441', model: 'claude-3-opus', tokens: '7,340' },
    { time: '3 hr ago', event: 'Generated market brief for APAC region', model: 'gemini-1.5-flash', tokens: '2,210' },
]



export default function ConsumerDashboard({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)
    const [activeTab, setActiveTab] = useState('launchpad')
    const [search, setSearch] = useState('')

    const filtered = apps.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="dash">
            {/* ══ Sidebar ══ */}
            <ConsumerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="dash__content consumer-dash" style={{ minHeight: 'auto', height: '100%' }}>
                {/* Top bar */}
                <ConsumerHeader theme={theme} onToggleTheme={onToggleTheme} title="GenAI Studio" />

                {/* Hero greeting */}
                <header className="consumer-hero">
                    <div className="consumer-hero__inner">
                        <div className="consumer-hero__label">
                            <span className="consumer-hero__pulse" />
                            Platform Live · 24 apps available
                        </div>
                        <h1 className="consumer-hero__title">
                            Good Evening,<br />
                            <span>What can AI do for you today?</span>
                        </h1>
                        <p className="consumer-hero__sub">Explore enterprise AI apps, run commands, or review your usage — all in one place.</p>

                        {/* Quick search */}
                        <div className="consumer-hero__search">
                            <svg className="consumer-hero__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search apps, commands, or insights…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="consumer-hero__search-input"
                                id="consumer-search"
                            />
                            {search && (
                                <button className="consumer-hero__search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="consumer-stats">
                        {stats.map(s => (
                            <div key={s.label} className="consumer-stat" style={{ '--stat-color': s.color }}>
                                <div className="consumer-stat__value">{s.value}</div>
                                <div className="consumer-stat__label">{s.label}</div>
                                <div className="consumer-stat__delta">{s.delta}</div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Tabs */}
                <div className="consumer-tabs" role="tablist">
                    {[
                        { id: 'launchpad', label: 'Launchpad', icon: <LaunchIcon /> },
                        { id: 'command', label: 'Command Center', icon: <CommandIcon /> },
                        { id: 'observability', label: 'Observability', icon: <ObsIcon /> },
                        { id: 'insights', label: 'Usage Insights', icon: <InsightIcon /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`consumer-tab ${activeTab === tab.id ? 'consumer-tab--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="consumer-tab__icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <main className="consumer-content" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
                    {/* ── LAUNCHPAD ── */}
                    {activeTab === 'launchpad' && (
                        <div className="consumer-launchpad">
                            <div className="consumer-section-header">
                                <h2 className="consumer-section-title">App Launchpad</h2>
                                <p className="consumer-section-sub">Browse and launch enterprise AI applications deployed on the platform</p>
                            </div>
                            <div className="consumer-app-grid">
                                {filtered.map(app => (
                                    <article key={app.id} className="consumer-app-card" style={{ '--app-accent': app.accent, '--app-accent-rgb': app.accent.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(', ') }}>
                                        {app.tag && <span className="consumer-app-card__tag">{app.tag}</span>}
                                        <div className="consumer-app-card__glow" aria-hidden="true" />
                                        <div className="consumer-app-card__icon">
                                            <BoltIcon />
                                        </div>
                                        <div className="consumer-app-card__body">
                                            <div className="consumer-app-card__meta">
                                                <span className="consumer-app-card__cat">{app.category}</span>
                                                <span className="consumer-app-card__rating">
                                                    <StarIcon /> {app.rating}
                                                </span>
                                            </div>
                                            <h3 className="consumer-app-card__name">{app.name}</h3>
                                            <p className="consumer-app-card__desc">{app.desc}</p>
                                            <div className="consumer-app-card__footer">
                                                <span className="consumer-app-card__uses">{app.uses} runs</span>
                                                <button className="consumer-app-card__launch" aria-label={`Launch ${app.name}`}>
                                                    Launch <ChevronRight />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="consumer-empty">
                                        <p>No apps match "<strong>{search}</strong>"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── COMMAND CENTER ── */}
                    {activeTab === 'command' && (
                        <div className="consumer-command">
                            <div className="consumer-section-header">
                                <h2 className="consumer-section-title">Command Center</h2>
                                <p className="consumer-section-sub">Run AI queries directly against any available model or application</p>
                            </div>
                            <div className="consumer-cmd-panel">
                                <div className="consumer-cmd-terminal">
                                    <div className="consumer-cmd-terminal__header">
                                        <span className="cmd-dot cmd-dot--red" />
                                        <span className="cmd-dot cmd-dot--yellow" />
                                        <span className="cmd-dot cmd-dot--green" />
                                        <span className="consumer-cmd-terminal__label">GenAI Command Terminal</span>
                                    </div>
                                    <div className="consumer-cmd-terminal__body">
                                        <div className="consumer-cmd-line">
                                            <span className="consumer-cmd-prompt">$</span>
                                            <span className="consumer-cmd-text consumer-cmd-text--accent">genai run</span>
                                            <span className="consumer-cmd-text"> --model gemini-1.5-pro --app contract-analyzer</span>
                                        </div>
                                        <div className="consumer-cmd-line consumer-cmd-line--output">
                                            ✓ Connected to Contract Analyzer v2.1
                                        </div>
                                        <div className="consumer-cmd-line consumer-cmd-line--output">
                                            ✓ Model: gemini-1.5-pro (context: 1M tokens)
                                        </div>
                                        <div className="consumer-cmd-line consumer-cmd-line--output consumer-cmd-line--ready">
                                            ▸ Ready. Enter your prompt below.
                                        </div>
                                        <div className="consumer-cmd-line">
                                            <span className="consumer-cmd-prompt">›</span>
                                            <span className="consumer-cmd-cursor" />
                                        </div>
                                    </div>
                                </div>
                                <div className="consumer-cmd-recent">
                                    <h3 className="consumer-cmd-recent__title">Recent Commands</h3>
                                    <ul className="consumer-cmd-recent__list">
                                        {activityLog.map((a, i) => (
                                            <li key={i} className="consumer-cmd-recent__item">
                                                <div className="consumer-cmd-recent__event">{a.event}</div>
                                                <div className="consumer-cmd-recent__meta">
                                                    <span>{a.model}</span>
                                                    <span>·</span>
                                                    <span>{a.tokens} tokens</span>
                                                    <span>·</span>
                                                    <span>{a.time}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── OBSERVABILITY ── */}
                    {activeTab === 'observability' && (
                        <div className="consumer-obs">
                            <div className="consumer-section-header">
                                <h2 className="consumer-section-title">Observability</h2>
                                <p className="consumer-section-sub">Real-time monitoring of your AI workloads across all applications</p>
                            </div>
                            <div className="consumer-obs-grid">
                                {/* Latency chart (mock sparklines) */}
                                {[
                                    { label: 'Request Latency', value: '342ms', color: '#34D399', bars: [40, 55, 48, 62, 45, 58, 42, 50, 38, 52, 44, 48] },
                                    { label: 'Token Throughput', value: '8.4k/min', color: '#4E8EFF', bars: [30, 45, 60, 50, 70, 55, 65, 48, 72, 60, 55, 68] },
                                    { label: 'Error Rate', value: '0.12%', color: '#F59E0B', bars: [5, 3, 8, 2, 4, 6, 3, 1, 5, 2, 4, 3] },
                                    { label: 'Active Sessions', value: '47', color: '#A78BFA', bars: [20, 25, 30, 28, 35, 32, 40, 38, 44, 42, 47, 47] },
                                ].map(metric => (
                                    <div key={metric.label} className="consumer-obs-card" style={{ '--obs-color': metric.color }}>
                                        <div className="consumer-obs-card__header">
                                            <span className="consumer-obs-card__label">{metric.label}</span>
                                            <span className="consumer-obs-card__value">{metric.value}</span>
                                        </div>
                                        <div className="consumer-obs-card__chart" aria-hidden="true">
                                            {metric.bars.map((h, i) => (
                                                <span key={i} className="obs-bar" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="consumer-obs-card__foot">Live · updated 10s ago</div>
                                    </div>
                                ))}
                            </div>
                            {/* Activity log */}
                            <div className="consumer-activity">
                                <h3 className="consumer-activity__title">Activity Log</h3>
                                <table className="consumer-activity__table">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                            <th>Model</th>
                                            <th>Tokens</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityLog.map((a, i) => (
                                            <tr key={i}>
                                                <td className="consumer-activity__time">{a.time}</td>
                                                <td>{a.event}</td>
                                                <td><span className="consumer-activity__model">{a.model}</span></td>
                                                <td className="consumer-activity__tokens">{a.tokens}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── USAGE INSIGHTS ── */}
                    {activeTab === 'insights' && (
                        <div className="consumer-insights">
                            <div className="consumer-section-header">
                                <h2 className="consumer-section-title">Usage Insights</h2>
                                <p className="consumer-section-sub">Understand your AI consumption patterns and optimize accordingly</p>
                            </div>
                            <div className="consumer-insights-grid">
                                <div className="consumer-insights-big">
                                    <h3 className="consumer-insights-big__title">Token Usage — Last 7 Days</h3>
                                    <div className="consumer-insights-bar-chart" aria-label="Token usage chart">
                                        {[
                                            { day: 'Mon', val: 65 }, { day: 'Tue', val: 82 }, { day: 'Wed', val: 48 },
                                            { day: 'Thu', val: 91 }, { day: 'Fri', val: 76 }, { day: 'Sat', val: 33 }, { day: 'Sun', val: 58 }
                                        ].map(d => (
                                            <div key={d.day} className="ibar-col">
                                                <div className="ibar-wrap">
                                                    <div className="ibar-fill" style={{ height: `${d.val}%` }}>
                                                        <span className="ibar-tip">{d.val}%</span>
                                                    </div>
                                                </div>
                                                <span className="ibar-label">{d.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="consumer-insights-side">
                                    <h3 className="consumer-insights-side__title">Top Apps by Usage</h3>
                                    {[
                                        { name: 'Code Review Agent', pct: 34, color: '#F59E0B' },
                                        { name: 'Support Triage AI', pct: 28, color: '#F87171' },
                                        { name: 'Contract Analyzer', pct: 18, color: '#34D399' },
                                        { name: 'HR Policy Bot', pct: 12, color: '#4E8EFF' },
                                        { name: 'Others', pct: 8, color: '#A78BFA' },
                                    ].map(a => (
                                        <div key={a.name} className="usage-row">
                                            <span className="usage-row__name">{a.name}</span>
                                            <div className="usage-row__bar-wrap">
                                                <div className="usage-row__bar" style={{ width: `${a.pct}%`, background: a.color }} />
                                            </div>
                                            <span className="usage-row__pct">{a.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
