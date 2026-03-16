import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ─── Icons ─── */
const I = {
    refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3" /></svg>,
    download: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    alert: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    zap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    dollar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    cpu: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
};

const BASE = 'http://localhost:8000/api/analytics';
const PIE_COLORS = ['#4E8EFF', '#10A37F', '#D97757', '#a78bfa', '#f59e0b', '#ec4899'];
const DAYS_OPTIONS = [1, 7, 14, 30, 90];

const fmt = {
    num: (n) => (n || 0).toLocaleString(),
    ms: (n) => `${(n || 0).toFixed(0)} ms`,
    usd: (n) => `$${(n || 0).toFixed(6)}`,
    date: (s) => s,
};

/* ─── Tiny custom tooltip for recharts ─── */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="pa-tooltip">
            <div className="pa-tooltip-label">{label}</div>
            {payload.map((p, i) => (
                <div key={i} className="pa-tooltip-row" style={{ color: p.color }}>
                    <span>{p.name}</span>
                    <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── KPI Card ─── */
const KPICard = ({ icon, label, value, sub, accent }) => (
    <div className="pa-kpi" style={{ '--kpi-accent': accent }}>
        <div className="pa-kpi-icon">{icon}</div>
        <div className="pa-kpi-body">
            <div className="pa-kpi-val">{value}</div>
            <div className="pa-kpi-label">{label}</div>
            {sub && <div className="pa-kpi-sub">{sub}</div>}
        </div>
    </div>
);

export default function PromptAnalytics({ theme, onToggleTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* ── Filters ── */
    const [days, setDays] = useState(7);
    const [model, setModel] = useState('');
    const [modelSearch, setModelSearch] = useState('');

    /* ── Data ── */
    const [trends, setTrends] = useState([]);
    const [byModel, setByModel] = useState([]);
    const [outliers, setOutliers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ── Drill-down ── */
    const [selected, setSelected] = useState(null);

    /* ── Active tab ── */
    const [tab, setTab] = useState('overview'); // overview | logs | outliers | models | guardrails

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        const qs = `?days=${days}${model ? `&model=${encodeURIComponent(model)}` : ''}`;
        try {
            const [t, bm, ol, lg] = await Promise.all([
                fetch(`${BASE}/trends${qs}`).then(r => r.json()),
                fetch(`${BASE}/by-model?days=${days}`).then(r => r.json()),
                fetch(`${BASE}/outliers?days=${days}`).then(r => r.json()),
                fetch(`${BASE}/logs${qs}&limit=100`).then(r => r.json()),
            ]);
            setTrends(Array.isArray(t) ? t : []);
            setByModel(Array.isArray(bm) ? bm : []);
            setOutliers(Array.isArray(ol) ? ol : []);
            setLogs(Array.isArray(lg) ? lg : []);
        } catch (e) {
            setError('Failed to connect to analytics backend.');
        } finally {
            setLoading(false);
        }
    }, [days, model]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ─── Derived KPIs from trends ─── */
    const kpi = trends.reduce((acc, d) => ({
        requests: acc.requests + (d.requests || 0),
        tokens: acc.tokens + (d.total_tokens || 0),
        cost: acc.cost + (d.total_cost || 0),
        errors: acc.errors + (d.errors || 0),
        latency: acc._cnt > 0
            ? { sum: acc.latency.sum + (d.avg_latency_ms || 0), cnt: acc.latency.cnt + 1 }
            : { sum: d.avg_latency_ms || 0, cnt: 1 },
    }), { requests: 0, tokens: 0, cost: 0, errors: 0, latency: { sum: 0, cnt: 0 } });
    const avgLatency = kpi.latency.cnt > 0 ? (kpi.latency.sum / kpi.latency.cnt).toFixed(0) : 0;

    const exportData = (format) => {
        const qs = `?days=${days}${model ? `&model=${encodeURIComponent(model)}` : ''}&format=${format}`;
        window.open(`${BASE}/export${qs}`, '_blank');
    };

    const filteredModels = byModel.filter(m =>
        !modelSearch || m.model_name?.toLowerCase().includes(modelSearch.toLowerCase())
    );

    const filteredLogs = logs.filter(l =>
        !modelSearch || l.model_name?.toLowerCase().includes(modelSearch.toLowerCase())
    );

    return (
        <div className="dash tk-layout">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="dash__content tk-main">
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="Prompt Analytics" />

                <div className="pa-container">

                    {/* ── Top bar ── */}
                    <div className="pa-topbar">
                        <div className="pa-topbar-left">
                            <div className="pa-days-group">
                                {DAYS_OPTIONS.map(d => (
                                    <button key={d}
                                        className={`pa-day-btn ${days === d ? 'active' : ''}`}
                                        onClick={() => setDays(d)}>
                                        {d}d
                                    </button>
                                ))}
                            </div>
                            <div className="pa-search-wrap">
                                <span className="pa-search-icon">{I.search}</span>
                                <input
                                    className="pa-search"
                                    placeholder="Filter by model..."
                                    value={modelSearch}
                                    onChange={e => setModelSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pa-topbar-right">
                            <button className="pa-btn-ghost" onClick={fetchAll}>{I.refresh} Refresh</button>
                            <button className="pa-btn-ghost" onClick={() => exportData('csv')}>{I.download} CSV</button>
                            <button className="pa-btn-ghost" onClick={() => exportData('json')}>{I.download} JSON</button>
                        </div>
                    </div>

                    {error && <div className="pa-error">{I.alert} {error}</div>}

                    {/* ── KPI Row ── */}
                    <div className="pa-kpi-row">
                        <KPICard icon={I.zap} label="Total Requests" value={fmt.num(kpi.requests)} accent="#4E8EFF" />
                        <KPICard icon={I.cpu} label="Total Tokens" value={fmt.num(kpi.tokens)} sub="in + out" accent="#10A37F" />
                        <KPICard icon={I.dollar} label="Total Cost" value={fmt.usd(kpi.cost)} accent="#a78bfa" />
                        <KPICard icon={I.zap} label="Avg Latency" value={`${avgLatency} ms`} accent="#f59e0b" />
                        <KPICard icon={I.alert} label="Errors" value={fmt.num(kpi.errors)} accent="#ef4444" />
                    </div>

                    {/* ── Tab Nav ── */}
                    <div className="pa-tabs">
                        {[
                            ['overview', 'Overview'],
                            ['models', 'By Model'],
                            ['logs', 'Logs'],
                            ['outliers', 'Outliers'],
                        ].map(([key, label]) => (
                            <button key={key} className={`pa-tab ${tab === key ? 'active' : ''}`}
                                onClick={() => setTab(key)}>{label}</button>
                        ))}
                    </div>

                    {/* ═══════════════════════════ OVERVIEW ═════════════════════════════ */}
                    {tab === 'overview' && (
                        <div className="pa-grid-2">
                            {/* Requests + tokens area chart */}
                            <div className="pa-card pa-card--wide">
                                <h3 className="pa-card-title">Daily Requests &amp; Tokens In/Out</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <AreaChart data={trends}>
                                        <defs>
                                            <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4E8EFF" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4E8EFF" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10A37F" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10A37F" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Area type="monotone" dataKey="tokens_in" name="Tokens In" stroke="#4E8EFF" fill="url(#gIn)" />
                                        <Area type="monotone" dataKey="tokens_out" name="Tokens Out" stroke="#10A37F" fill="url(#gOut)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Latency line chart */}
                            <div className="pa-card">
                                <h3 className="pa-card-title">Avg Latency (ms)</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Line type="monotone" dataKey="avg_latency_ms" name="Latency ms" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Cost bar chart */}
                            <div className="pa-card">
                                <h3 className="pa-card-title">Daily Cost (USD)</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar dataKey="total_cost" name="Cost USD" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Provider pie */}
                            <div className="pa-card">
                                <h3 className="pa-card-title">Requests by Model</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={byModel} dataKey="requests" nameKey="model_name"
                                            cx="50%" cy="50%" outerRadius={80}
                                            label={({ model_name, percent }) =>
                                                `${(model_name || '').slice(0, 12)} ${(percent * 100).toFixed(0)}%`}>
                                            {byModel.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════ BY MODEL ════════════════════════ */}
                    {tab === 'models' && (
                        <div className="pa-card pa-card--wide">
                            <h3 className="pa-card-title">Model Comparison</h3>
                            <div className="pa-table-wrap">
                                <table className="pa-table">
                                    <thead><tr>
                                        <th>Model</th><th>Provider</th><th>Requests</th>
                                        <th>Tokens In</th><th>Tokens Out</th>
                                        <th>Avg Latency</th><th>Total Cost</th>
                                        <th>Errors</th>
                                    </tr></thead>
                                    <tbody>
                                        {filteredModels.length === 0
                                            ? <tr><td colSpan="8" className="pa-empty">No data for selected range.</td></tr>
                                            : filteredModels.map((m, i) => (
                                                <tr key={i}>
                                                    <td className="pa-model-cell">{m.model_name}</td>
                                                    <td><span className="pa-badge">{m.provider}</span></td>
                                                    <td>{fmt.num(m.requests)}</td>
                                                    <td>{fmt.num(m.tokens_in)}</td>
                                                    <td>{fmt.num(m.tokens_out)}</td>
                                                    <td>{fmt.ms(m.avg_latency_ms)}</td>
                                                    <td className="pa-cost">{fmt.usd(m.total_cost)}</td>
                                                    <td>{m.errors > 0 ? <span className="pa-badge pa-badge--err">{m.errors}</span> : '—'}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════ LOGS ════════════════════════════ */}
                    {tab === 'logs' && (
                        <div className="pa-card pa-card--wide">
                            <h3 className="pa-card-title">Prompt Logs <span className="pa-count">{filteredLogs.length}</span></h3>
                            <div className="pa-table-wrap">
                                <table className="pa-table">
                                    <thead><tr>
                                        <th>Timestamp</th><th>Model</th><th>User</th>
                                        <th>Tokens In</th><th>Tokens Out</th>
                                        <th>Latency</th><th>Cost</th><th>Status</th><th></th>
                                    </tr></thead>
                                    <tbody>
                                        {filteredLogs.length === 0
                                            ? <tr><td colSpan="9" className="pa-empty">No logs found.</td></tr>
                                            : filteredLogs.map((l, i) => (
                                                <tr key={i} className={l.error ? 'pa-row--err' : ''}>
                                                    <td className="pa-ts">{l.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                                                    <td className="pa-model-cell">{l.model_name}</td>
                                                    <td>{l.user_email || '—'}</td>
                                                    <td>{fmt.num(l.tokens_in)}</td>
                                                    <td>{fmt.num(l.tokens_out)}</td>
                                                    <td>{fmt.ms(l.latency_ms)}</td>
                                                    <td className="pa-cost">{fmt.usd(l.cost_usd)}</td>
                                                    <td>{l.error
                                                        ? <span className="pa-badge pa-badge--err">Error</span>
                                                        : <span className="pa-badge pa-badge--ok">OK</span>
                                                    }</td>
                                                    <td>
                                                        <button className="pa-view-btn" onClick={() => setSelected(l)}>
                                                            {I.eye}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════ OUTLIERS ════════════════════════ */}
                    {tab === 'outliers' && (
                        <div className="pa-card pa-card--wide">
                            <h3 className="pa-card-title">Outliers — High Latency / Token Usage / Errors</h3>
                            <div className="pa-table-wrap">
                                <table className="pa-table">
                                    <thead><tr>
                                        <th>Timestamp</th><th>Model</th><th>User</th>
                                        <th>Tokens In</th><th>Tokens Out</th>
                                        <th>Latency</th><th>Error</th><th></th>
                                    </tr></thead>
                                    <tbody>
                                        {outliers.length === 0
                                            ? <tr><td colSpan="8" className="pa-empty">No outliers detected.</td></tr>
                                            : outliers.map((l, i) => (
                                                <tr key={i} className="pa-row--warn">
                                                    <td className="pa-ts">{l.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                                                    <td className="pa-model-cell">{l.model_name}</td>
                                                    <td>{l.user_email || '—'}</td>
                                                    <td>{fmt.num(l.tokens_in)}</td>
                                                    <td>{fmt.num(l.tokens_out)}</td>
                                                    <td><span className="pa-badge pa-badge--warn">{fmt.ms(l.latency_ms)}</span></td>
                                                    <td>{l.error ? <span className="pa-badge pa-badge--err" title={l.error}>Yes</span> : '—'}</td>
                                                    <td>
                                                        <button className="pa-view-btn" onClick={() => setSelected(l)}>
                                                            {I.eye}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ═══════════════ DRILL-DOWN MODAL ═══════════════ */}
            {selected && (
                <div className="pa-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="pa-modal" onClick={e => e.stopPropagation()}>
                        <div className="pa-modal-head">
                            <h2>Prompt Detail</h2>
                            <button className="pa-modal-close" onClick={() => setSelected(null)}>{I.close}</button>
                        </div>
                        <div className="pa-modal-meta">
                            <span className="pa-badge">{selected.model_name}</span>
                            <span className="pa-badge">{selected.provider}</span>
                            <span className="pa-badge pa-badge--ok">Tokens In: {selected.tokens_in}</span>
                            <span className="pa-badge pa-badge--ok">Tokens Out: {selected.tokens_out}</span>
                            <span className="pa-badge">{fmt.ms(selected.latency_ms)}</span>
                            <span className="pa-badge pa-badge--cost">{fmt.usd(selected.cost_usd)}</span>
                        </div>
                        <div className="pa-modal-section">
                            <div className="pa-modal-section-title">Prompt</div>
                            <pre className="pa-code">{selected.prompt || '(no prompt captured)'}</pre>
                        </div>
                        <div className="pa-modal-section">
                            <div className="pa-modal-section-title">Response</div>
                            <pre className="pa-code">{selected.response || '(no response captured)'}</pre>
                        </div>
                        {selected.error && (
                            <div className="pa-modal-section">
                                <div className="pa-modal-section-title" style={{ color: 'var(--danger)' }}>Error</div>
                                <pre className="pa-code pa-code--err">{selected.error}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
