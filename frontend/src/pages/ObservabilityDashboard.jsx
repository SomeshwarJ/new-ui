import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie, LineChart, Line,
    ComposedChart, ScatterChart, Scatter, ZAxis,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import '../styles/observability.css';
import {
    fetchUsageTotals,
    fetchUsageByModel,
    fetchUsageByUser,
    fetchUsageByProvider,
    fetchUsageByDepartment,
    fetchUsageSummary,
    fetchUsageTimeline,
} from '../api/usage';

/* ─── Icons ─── */
const I = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    refresh: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    dollar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M3 9h6" /><path d="M3 15h6" /><path d="M15 3v18" /><path d="M15 9h6" /><path d="M15 15h6" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
};

/* ─── Color Palette ─── */
const PALETTE = [
    '#4E8EFF', '#34D399', '#F59E0B', '#A78BFA', '#F472B6',
    '#22D3EE', '#FB923C', '#86EFAC', '#FDE68A', '#C4B5FD',
];
const getColor = (i) => PALETTE[i % PALETTE.length];

/* ─── Provider badge colors ─── */
const PROVIDER_COLORS = {
    openai: '#10B981', anthropic: '#A78BFA', google: '#F59E0B',
    ollama: '#4E8EFF', azure: '#22D3EE', mistral: '#F472B6', unknown: '#6B7280',
};
const providerColor = (name) => PROVIDER_COLORS[(name || '').toLowerCase()] || '#6B7280';

/* ─── Department colors (stable index mapping) ─── */
const DEPT_COLORS = [
    '#4E8EFF', '#34D399', '#F59E0B', '#A78BFA', '#F472B6',
    '#22D3EE', '#FB923C', '#86EFAC', '#FDE68A', '#C4B5FD',
];
const deptColor = (i) => DEPT_COLORS[i % DEPT_COLORS.length];

/* ─── Helpers ─── */
const formatTokens = (n) => {
    if (!n && n !== 0) return '—';
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)} K`;
    return n.toLocaleString();
};

const formatCost = (n) => {
    if (!n && n !== 0) return '—';
    return `$${n.toFixed(4)}`;
};

const formatCostShort = (n) => {
    if (!n && n !== 0) return '—';
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n.toFixed(3)}`;
};

/* ─── Custom tooltip ─── */
const CostTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(10,15,28,0.97)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, minWidth: 160,
        }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 7, fontSize: 11 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color || '#fff', display: 'flex', justifyContent: 'space-between', gap: 20, lineHeight: 1.7 }}>
                    <span>{p.name}</span>
                    <strong>{typeof p.value === 'number' ? `$${p.value.toFixed(4)}` : p.value}</strong>
                </div>
            ))}
        </div>
    );
};

/* ─── Skeleton loader ─── */
const Skeleton = ({ h = 24, w = '100%', radius = 6 }) => (
    <div style={{
        height: h, width: w, borderRadius: radius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
        backgroundSize: '200% 100%', animation: 'obs-shimmer 1.5s infinite',
    }} />
);

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function ObservabilityDashboard({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('Models');
    const [days, setDays] = useState(30);

    /* ─── Live data state ─── */
    const [totals, setTotals] = useState(null);
    const [byModel, setByModel] = useState([]);
    const [byUser, setByUser] = useState([]);
    const [byProvider, setByProvider] = useState([]);
    const [byDepartment, setByDepartment] = useState([]);
    const [summary, setSummary] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);

    /* ─── Fetch all data ─── */
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [t, m, u, p, d, s, tl] = await Promise.all([
                fetchUsageTotals(days),
                fetchUsageByModel(days),
                fetchUsageByUser(days),
                fetchUsageByProvider(days),
                fetchUsageByDepartment(days),
                fetchUsageSummary(days),
                fetchUsageTimeline(days),
            ]);
            setTotals(t);
            setByModel(m || []);
            setByUser(u || []);
            setByProvider(p || []);
            setByDepartment(d || []);
            setSummary(s || []);
            setTimeline(tl || []);
            setLastRefresh(new Date());
        } catch (e) {
            console.error('Usage data fetch failed:', e);
            setError('Failed to load usage data. Check backend connection.');
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => { loadData(); }, [loadData]);

    /* ─── Build cost chart data for the "Cost of Inference" bar chart ─── */
    const buildCostChartData = () => {
        if (activeView === 'Models') {
            return byModel.slice(0, 10).map((m, i) => ({
                name: (m.model_name || 'Unknown').split('/').pop(),
                cost: m.total_cost_usd,
                fill: getColor(i),
            }));
        }
        if (activeView === 'Providers') {
            return byProvider.map((p, i) => ({
                name: p.provider,
                cost: p.total_cost_usd,
                fill: providerColor(p.provider),
            }));
        }
        if (activeView === 'Users') {
            return byUser.slice(0, 10).map((u, i) => ({
                name: (u.user_email || '').split('@')[0],
                cost: u.total_cost_usd,
                fill: getColor(i),
            }));
        }
        if (activeView === 'Departments') {
            return byDepartment.slice(0, 10).map((d, i) => ({
                name: d.department,
                cost: d.total_cost_usd,
                fill: deptColor(i),
            }));
        }
        return [];
    };

    /* ─── Timeline chart ─── */
    const timelineChartData = timeline.map(d => ({
        date: d.date,
        'Input Cost': d.input_cost_usd,
        'Output Cost': d.output_cost_usd,
    }));

    /* ─── CSV export ─── */
    const handleDownloadCSV = () => {
        const headers = ['Username', 'Department', 'Model', 'Provider', 'Persona', 'Requests', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Input Cost (USD)', 'Output Cost (USD)', 'Total Cost (USD)', 'Last Used'];
        const rows = summary.map(r => [
            `"${r.user_email || ''}"`,
            `"${r.user_department || ''}"`,
            `"${r.model_name || ''}"`,
            `"${r.provider || ''}"`,
            `"${r.user_persona || ''}"`,
            r.request_count || 0,
            r.prompt_tokens || 0,
            r.completion_tokens || 0,
            r.total_tokens || 0,
            r.input_cost_usd || 0,
            r.output_cost_usd || 0,
            r.total_cost_usd || 0,
            `"${r.last_used || ''}"`,
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `cost-metrics-${days}d.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const grandTotal = byProvider.reduce((s, p) => s + (p.total_cost_usd || 0), 0);
    const costChartData = buildCostChartData();

    /* ─── Department totals for the static cards ─── */
    const deptGrandTotal = byDepartment.reduce((s, d) => s + (d.total_cost_usd || 0), 0);

    return (
        <div className="dash obs-layout">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="dash__content">
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="LLM Gateway Observatory" />

                <div className="obs-main">
                    <div className="obs-container">

                    {/* ── Filters Row ── */}
                    <div className="obs-filters">
                        <div className="obs-filter-group">
                            <span className="obs-filter-label">View by</span>
                            {['Providers', 'Models', 'Users', 'Departments'].map(view => (
                                <button key={view}
                                    className={`obs-filter-pill ${activeView === view ? 'obs-filter-pill--active' : ''}`}
                                    onClick={() => setActiveView(view)}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                        <div className="obs-filter-group">
                            <button className="obs-btn-select" onClick={loadData} title="Refresh data">
                                {I.refresh}
                                {lastRefresh && <span style={{ fontSize: 11, marginLeft: 4, color: 'var(--text-muted)' }}>
                                    {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>}
                            </button>
                            <select
                                className="obs-range-select"
                                value={days}
                                onChange={e => setDays(Number(e.target.value))}
                            >
                                <option value={1}>Last 24 hours</option>
                                <option value={7}>Last 7 days</option>
                                <option value={30}>Last 30 days</option>
                                <option value={90}>Last 90 days</option>
                                <option value={365}>Last year</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Error Banner ── */}
                    {error && (
                        <div className="obs-error-banner">
                            <span>⚠ {error}</span>
                            <button onClick={loadData}>Retry</button>
                        </div>
                    )}

                    {/* ── KPI Cards ── */}
                    <div className="obs-kpi-grid">
                        <div className="obs-kpi-card">
                            <div className="obs-kpi-title">Total Tokens</div>
                            <div className="obs-kpi-value">
                                {loading
                                    ? <Skeleton h={32} w={120} />
                                    : <>{formatTokens(totals?.total_tokens).split(' ')[0]} <span className="obs-kpi-unit">{formatTokens(totals?.total_tokens).split(' ').slice(1).join(' ') || 'tokens'}</span></>
                                }
                            </div>
                            {!loading && totals && <div className="obs-kpi-sub">{(totals.total_tokens || 0).toLocaleString()} raw tokens</div>}
                        </div>
                        <div className="obs-kpi-card">
                            <div className="obs-kpi-title">Total Requests</div>
                            <div className="obs-kpi-value">
                                {loading ? <Skeleton h={32} w={80} /> : <>{(totals?.total_requests || 0).toLocaleString()}</>}
                            </div>
                            {!loading && totals && <div className="obs-kpi-sub">{totals.unique_users} users · {totals.unique_models} models</div>}
                        </div>
                        <div className="obs-kpi-card">
                            <div className="obs-kpi-title">Total Cost</div>
                            <div className="obs-kpi-value obs-kpi-value--cost">
                                {loading
                                    ? <Skeleton h={32} w={120} />
                                    : <>${(totals?.total_cost_usd || 0).toFixed(4)} <span className="obs-kpi-unit">USD</span></>
                                }
                            </div>
                            {!loading && totals && (
                                <div className="obs-kpi-sub">
                                    In: ${(totals.total_input_cost_usd || 0).toFixed(4)} · Out: ${(totals.total_output_cost_usd || 0).toFixed(4)}
                                </div>
                            )}
                        </div>
                        <div className="obs-kpi-card">
                            <div className="obs-kpi-title">Departments Active</div>
                            <div className="obs-kpi-value">
                                {loading ? <Skeleton h={32} w={60} /> : byDepartment.length}
                            </div>
                            {!loading && byDepartment.length > 0 && (
                                <div className="obs-kpi-sub">
                                    {byDepartment.slice(0, 3).map(d => d.department).join(' · ')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Department Cost Cards ── */}
                    {activeView === 'Departments' && !loading && byDepartment.length > 0 && (
                        <div className="obs-dept-section">
                            <div className="obs-section-header">
                                <h2 className="obs-section-title">{I.building} Cost by Department</h2>
                                <span className="obs-section-subtitle">
                                    Last {days} day{days !== 1 ? 's' : ''} · {byDepartment.length} department{byDepartment.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="obs-dept-grid">
                                {byDepartment.map((d, i) => {
                                    const pct = deptGrandTotal > 0 ? (d.total_cost_usd / deptGrandTotal) * 100 : 0;
                                    const col = deptColor(i);
                                    return (
                                        <div key={d.department} className="obs-dept-card">
                                            <div className="obs-dept-card-header">
                                                <div className="obs-dept-badge" style={{ background: col + '22', borderColor: col + '55' }}>
                                                    <span className="obs-dept-dot" style={{ background: col }} />
                                                    <span className="obs-dept-name">{d.department}</span>
                                                </div>
                                                <span className="obs-dept-pct">{pct.toFixed(1)}%</span>
                                            </div>
                                            <div className="obs-dept-cost">{formatCost(d.total_cost_usd)}</div>
                                            <div className="obs-dept-meta">
                                                <span>{d.request_count.toLocaleString()} req</span>
                                                <span>{formatTokens(d.total_tokens)}</span>
                                                <span>{d.unique_users} user{d.unique_users !== 1 ? 's' : ''}</span>
                                                <span>{d.unique_models} model{d.unique_models !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="obs-dept-bar-track">
                                                <div className="obs-dept-bar-fill" style={{ width: `${pct}%`, background: col }} />
                                            </div>
                                            <div className="obs-dept-cost-split">
                                                <span>In: {formatCost(d.input_cost_usd)}</span>
                                                <span>Out: {formatCost(d.output_cost_usd)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Provider Stats Section ── */}
                    {activeView === 'Providers' && !loading && byProvider.length > 0 && (
                        <div className="obs-provider-section">
                            <div className="obs-section-header">
                                <h2 className="obs-section-title">{I.dollar} Cost by Provider</h2>
                                <span className="obs-section-subtitle">Last {days} day{days !== 1 ? 's' : ''} · {byProvider.length} provider{byProvider.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="obs-provider-grid">
                                {byProvider.map((p) => {
                                    const pct = grandTotal > 0 ? (p.total_cost_usd / grandTotal) * 100 : 0;
                                    const col = providerColor(p.provider);
                                    return (
                                        <div key={p.provider} className="obs-provider-card">
                                            <div className="obs-provider-card-header">
                                                <div className="obs-provider-badge" style={{ background: col + '22', borderColor: col + '55' }}>
                                                    <span className="obs-provider-dot-sm" style={{ background: col }} />
                                                    <span className="obs-provider-name">{p.provider}</span>
                                                </div>
                                                <span className="obs-provider-pct">{pct.toFixed(1)}%</span>
                                            </div>
                                            <div className="obs-provider-cost">{formatCost(p.total_cost_usd)}</div>
                                            <div className="obs-provider-meta">
                                                <span>{p.request_count.toLocaleString()} requests</span>
                                                <span>{formatTokens(p.total_tokens)}</span>
                                                <span>{p.unique_models} model{p.unique_models !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="obs-provider-bar-track">
                                                <div className="obs-provider-bar-fill" style={{ width: `${pct}%`, background: col }} />
                                            </div>
                                            <div className="obs-provider-cost-split">
                                                <span>In: {formatCost(p.input_cost_usd)}</span>
                                                <span>Out: {formatCost(p.output_cost_usd)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Model Stats Section ── */}
                    {activeView === 'Models' && !loading && byModel.length > 0 && (
                        <div className="obs-provider-section">
                            <div className="obs-section-header">
                                <h2 className="obs-section-title">{I.box} Cost by Model</h2>
                                <span className="obs-section-subtitle">Last {days} day{days !== 1 ? 's' : ''} · {byModel.length} model{byModel.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="obs-provider-grid">
                                {byModel.slice(0, 8).map((m, i) => {
                                    const maxCost = byModel[0]?.total_cost_usd || 1;
                                    const pct = (m.total_cost_usd / maxCost) * 100;
                                    const col = getColor(i);
                                    return (
                                        <div key={i} className="obs-provider-card">
                                            <div className="obs-provider-card-header">
                                                <div className="obs-provider-badge" style={{ background: col + '22', borderColor: col + '55' }}>
                                                    <span className="obs-provider-dot-sm" style={{ background: col }} />
                                                    <span className="obs-provider-name">{(m.model_name || 'Unknown').split('/').pop()}</span>
                                                </div>
                                            </div>
                                            <div className="obs-provider-cost">{formatCost(m.total_cost_usd)}</div>
                                            <div className="obs-provider-meta">
                                                <span>{m.request_count.toLocaleString()} requests</span>
                                                <span>{formatTokens(m.total_tokens)}</span>
                                                <span className="obs-model-provider-tag" style={{ border: `1px solid ${providerColor(m.provider)}55`, color: providerColor(m.provider) }}>{m.provider}</span>
                                            </div>
                                            <div className="obs-provider-bar-track">
                                                <div className="obs-provider-bar-fill" style={{ width: `${pct}%`, background: col }} />
                                            </div>
                                            <div className="obs-provider-cost-split">
                                                <span>In: {formatCost(m.input_cost_usd)}</span>
                                                <span>Out: {formatCost(m.output_cost_usd)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── User Stats Section ── */}
                    {activeView === 'Users' && !loading && byUser.length > 0 && (
                        <div className="obs-provider-section">
                            <div className="obs-section-header">
                                <h2 className="obs-section-title">{I.users} Cost by User</h2>
                                <span className="obs-section-subtitle">Last {days} day{days !== 1 ? 's' : ''} · {byUser.length} user{byUser.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="obs-provider-grid">
                                {byUser.slice(0, 8).map((u, i) => {
                                    const maxCost = byUser[0]?.total_cost_usd || 1;
                                    const pct = (u.total_cost_usd / maxCost) * 100;
                                    const col = getColor(i);
                                    return (
                                        <div key={i} className="obs-provider-card">
                                            <div className="obs-provider-card-header">
                                                <div className="obs-provider-badge" style={{ background: col + '22', borderColor: col + '55' }}>
                                                    <span className="obs-user-avatar" style={{ background: col, width: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>
                                                        {(u.user_email || '?')[0].toUpperCase()}
                                                    </span>
                                                    <span className="obs-provider-name">{(u.user_email || '').split('@')[0]}</span>
                                                </div>
                                            </div>
                                            <div className="obs-provider-cost">{formatCost(u.total_cost_usd)}</div>
                                            <div className="obs-provider-meta">
                                                <span>{u.request_count.toLocaleString()} req</span>
                                                <span>{formatTokens(u.total_tokens)}</span>
                                                <span>{u.models_used} model{u.models_used !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="obs-provider-bar-track">
                                                <div className="obs-provider-bar-fill" style={{ width: `${pct}%`, background: col }} />
                                            </div>
                                            <div className="obs-provider-cost-split">
                                                <span>In: {formatCost(u.input_cost_usd)}</span>
                                                <span>Out: {formatCost(u.output_cost_usd)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Chart Grid ── */}
                    <div className="obs-chart-grid">

                        {/* Cost of Inference — dynamic view */}
                        <div className="obs-chart-card">
                            <div className="obs-chart-header">
                                <h3 className="obs-chart-title">
                                    Cost of Inference <span>($)</span>
                                    <span className="obs-chart-view-badge">{activeView}</span>
                                </h3>
                                {totals && <div className="obs-chart-meta">Total <strong>{formatCostShort(totals.total_cost_usd)}</strong></div>}
                            </div>
                            <div className="obs-chart-body">
                                {loading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
                                        <Skeleton h={18} /><Skeleton h={18} w="80%" /><Skeleton h={18} w="60%" />
                                    </div>
                                ) : costChartData.length === 0 ? (
                                    <div className="obs-empty-state">No cost data for selected period</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={costChartData} layout="vertical" margin={{ top: 4, left: 8, right: 28, bottom: 4 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                            <XAxis
                                                type="number"
                                                stroke="rgba(255,255,255,0.25)"
                                                fontSize={10}
                                                tickFormatter={v => `$${v.toFixed(3)}`}
                                                tick={{ fill: 'rgba(255,255,255,0.45)' }}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                stroke="rgba(255,255,255,0.25)"
                                                fontSize={10}
                                                width={100}
                                                tick={{ fill: 'rgba(255,255,255,0.65)' }}
                                            />
                                            <Tooltip content={<CostTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                            <Bar dataKey="cost" radius={[0, 4, 4, 0]} name="Total Cost" maxBarSize={22}>
                                                {costChartData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Cost Timeline */}
                        <div className="obs-chart-card">
                            <div className="obs-chart-header">
                                <h3 className="obs-chart-title">Cost Timeline <span>(daily)</span></h3>
                                {timeline.length > 0 && <div className="obs-chart-meta">{timeline.length} day{timeline.length !== 1 ? 's' : ''} of data</div>}
                            </div>
                            <div className="obs-chart-body">
                                {loading ? (
                                    <div style={{ padding: '8px 0' }}><Skeleton h={255} /></div>
                                ) : timelineChartData.length === 0 ? (
                                    <div className="obs-empty-state">No timeline data</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <AreaChart data={timelineChartData} margin={{ top: 4, left: 8, right: 12, bottom: 4 }}>
                                            <defs>
                                                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4E8EFF" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#4E8EFF" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickMargin={8} />
                                            <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={v => `$${v.toFixed(2)}`} />
                                            <Tooltip content={<CostTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                            <Area type="monotone" dataKey="Input Cost" stroke="#4E8EFF" fill="url(#gIn)" strokeWidth={2} dot={false} />
                                            <Area type="monotone" dataKey="Output Cost" stroke="#34D399" fill="url(#gOut)" strokeWidth={2} dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* ── Dynamic Analytics based on Tab ── */}
                        {activeView === 'Models' && (
                            <>
                                {/* Models: Token Volume Stacked Bar */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Token Volume <span>(Prompt vs Completion)</span></h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={byModel.slice(0, 10)} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                                <XAxis type="number" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={formatTokens} />
                                                <YAxis dataKey="model_name" type="category" stroke="rgba(255,255,255,0.25)" fontSize={10} width={100} tickFormatter={(name) => (name||'').split('/').pop()} tick={{ fill: 'rgba(255,255,255,0.65)' }} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text)' }} formatter={(value) => formatTokens(value)} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                                <Bar dataKey="prompt_tokens" name="Input Tokens" stackId="a" fill="#4E8EFF" />
                                                <Bar dataKey="completion_tokens" name="Output Tokens" stackId="a" fill="#34D399" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {/* Models: Request Frequency Line Chart */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Hit Count <span>(Models)</span></h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <AreaChart data={byModel.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="model_name" stroke="rgba(255,255,255,0.25)" fontSize={10} tickFormatter={(name) => (name||'').split('/').pop()} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={formatTokens} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                                <Area type="monotone" dataKey="request_count" name="API Calls" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeView === 'Providers' && (
                            <>
                                {/* Providers: Cost Split Pie Chart */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Cost Distribution <span>(Providers)</span></h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={byProvider} dataKey="total_cost_usd" nameKey="provider" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4}>
                                                    {byProvider.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={providerColor(entry.provider)} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `$${value.toFixed(4)}`} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {/* Providers: Composed Chart */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Provider Efficiency</h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <ComposedChart data={byProvider} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="provider" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={formatTokens} />
                                                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={formatTokens} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                                <Bar yAxisId="left" dataKey="total_tokens" name="Total Tokens" fill="#A78BFA" barSize={20} radius={[4, 4, 0, 0]}>
                                                    {byProvider.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={providerColor(entry.provider)} />
                                                    ))}
                                                </Bar>
                                                <Line yAxisId="right" type="monotone" dataKey="request_count" name="API Calls" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeView === 'Users' && (
                            <>
                                {/* Users: Request Frequency Bar Chart */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Request Volume <span>(Users)</span></h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={byUser.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="user_email" stroke="rgba(255,255,255,0.25)" fontSize={10} tickFormatter={(name) => (name||'').split('@')[0]} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={formatTokens} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                                <Bar dataKey="request_count" name="Total APIs Called" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {/* Users: Scatter Chart View */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Cost vs Tokens Matrix</h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis type="number" dataKey="total_tokens" name="Tokens" stroke="rgba(255,255,255,0.25)" fontSize={10} tickFormatter={formatTokens} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <YAxis type="number" dataKey="total_cost_usd" name="Cost" stroke="rgba(255,255,255,0.25)" fontSize={10} tickFormatter={v => `$${v.toFixed(2)}`} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <ZAxis type="category" dataKey="user_email" name="User" />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Scatter name="Users" data={[...byUser].sort((a,b)=>b.total_tokens - a.total_tokens).slice(0, 20)} fill="#F472B6">
                                                    {[...byUser].sort((a,b)=>b.total_tokens - a.total_tokens).slice(0, 20).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={getColor(index)} />
                                                    ))}
                                                </Scatter>
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeView === 'Departments' && (
                            <>
                                {/* Dept: Radar Chart Ratio */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Operations Profile <span>(Cost)</span></h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={byDepartment.slice(0, 6)}>
                                                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                                                <PolarAngleAxis dataKey="department" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} tickFormatter={v => `$${v.toFixed(0)}`} />
                                                <Radar name="Total Cost" dataKey="total_cost_usd" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.5} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {/* Dept: Cost Split Stacked Bar */}
                                <div className="obs-chart-card">
                                    <div className="obs-chart-header">
                                        <h3 className="obs-chart-title">Cost Breakdown</h3>
                                    </div>
                                    <div className="obs-chart-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={byDepartment.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="department" stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} />
                                                <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.45)' }} tickFormatter={v => `$${v.toFixed(2)}`} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                                <Legend wrapperStyle={{ fontSize: 11, opacity: 0.7, paddingTop: 10 }} />
                                                <Bar dataKey="input_cost_usd" name="Input Cost" stackId="cost" fill="#4E8EFF" />
                                                <Bar dataKey="output_cost_usd" name="Output Cost" stackId="cost" fill="#34D399" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>

                    {/* ── Raw Telemetry Table ── */}
                    <div className="obs-table-card">
                        <div className="obs-table-header">
                            <div>
                                <h3 className="obs-chart-title">Raw Telemetry Data</h3>
                                {!loading && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{summary.length} records · last {days} days</span>}
                            </div>
                            <button className="obs-btn-export" onClick={handleDownloadCSV} disabled={summary.length === 0}>
                                {I.download} Download CSV
                            </button>
                        </div>
                        <div className="obs-table-wrapper">
                            {loading ? (
                                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} h={18} />)}
                                </div>
                            ) : summary.length === 0 ? (
                                <div className="obs-empty-state" style={{ padding: 48 }}>No records for selected time range</div>
                            ) : (
                                <table className="obs-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Department</th>
                                            <th>Model</th>
                                            <th>Provider</th>
                                            <th>Persona</th>
                                            <th>Requests</th>
                                            <th>Input Tokens</th>
                                            <th>Output Tokens</th>
                                            <th>Input Cost</th>
                                            <th>Output Cost</th>
                                            <th>Total Cost</th>
                                            <th>Last Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.map((row, i) => (
                                            <tr key={i}>
                                                <td className="obs-td-light">{row.user_email || '—'}</td>
                                                <td>
                                                    {row.user_department
                                                        ? <span className="obs-td-dept">{row.user_department}</span>
                                                        : <span className="obs-td-light">—</span>
                                                    }
                                                </td>
                                                <td>{(row.model_name || '—').split('/').pop()}</td>
                                                <td>
                                                    <span className="obs-td-provider" style={{ '--pcolor': providerColor(row.provider) }}>
                                                        {row.provider || '—'}
                                                    </span>
                                                </td>
                                                <td className="obs-td-light">{row.user_persona || '—'}</td>
                                                <td>{(row.request_count || 0).toLocaleString()}</td>
                                                <td>{(row.prompt_tokens || 0).toLocaleString()}</td>
                                                <td>{(row.completion_tokens || 0).toLocaleString()}</td>
                                                <td className="obs-td-cost">{formatCost(row.input_cost_usd || 0)}</td>
                                                <td className="obs-td-cost">{formatCost(row.output_cost_usd || 0)}</td>
                                                <td className="obs-td-cost obs-td-cost--total">{formatCost(row.total_cost_usd || 0)}</td>
                                                <td className="obs-td-light">{row.last_used ? new Date(row.last_used).toLocaleDateString() : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
                </div>
            </div>
        </div>
    );
}
