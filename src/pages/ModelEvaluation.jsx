import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import '../styles/model-evaluation.css'

/* ═══════════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════════ */
const I = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    barChart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    server: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    cpu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg>,
    upload: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>,
    fileText: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    filePdf: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    fileExcel: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>,
    x: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    play: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
    download: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    zap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    expandRow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
    sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>,
    chevLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
}

/* ═══════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════ */
const AVAILABLE_MODELS = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', vendor: 'Google', color: '#4285F4' },
    { id: 'gpt-4o', name: 'GPT-4o', vendor: 'OpenAI', color: '#10A37F' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', vendor: 'Anthropic', color: '#CC785C' },
    { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', vendor: 'Meta', color: '#0668E1' },
    { id: 'text-embedding-3-large', name: 'Embedding 3-large', vendor: 'OpenAI', color: '#10A37F' },
]

const sidebarSections = [
    { label: 'OVERVIEW', items: [{ name: 'Home', icon: I.home, href: '/persona/admin' }] },
    {
        label: 'PLATFORM MANAGEMENT', items: [
            { name: 'Platform Overview', icon: I.grid },
            { name: 'Use Case Management', icon: I.briefcase },
            { name: 'API Keys', icon: I.key },
            { name: 'Model Onboarding', icon: I.box, href: '/persona/admin/models' },
            { name: 'Model Evaluation', icon: I.barChart, active: true, href: '/persona/admin/evaluate' },
        ]
    },
    {
        label: 'GOVERNANCE', items: [
            { name: 'Policies', icon: I.shield, href: '/persona/admin/policies' },
            { name: 'Templates', icon: I.layers, href: '/persona/admin/templates' },
            // { name: "Guardrails Config", icon: I.settings, href: '/persona/admin/guardrails' },
            // { name: 'Audit Logs', icon: I.clock },
        ]
    },
    // {
    //     label: 'INFRASTRUCTURE', items: [
    //         { name: 'Deployments', icon: I.server },
    //         { name: 'Monitoring', icon: I.activity },
    //         { name: 'Compute', icon: I.cpu },
    //     ]
    // },
]

const genResults = (n = 8) => Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    prompt: ['Summarize the following contract clause in plain English.', 'What are the key risks outlined in section 3?', 'Extract all dates and deadlines from the document.', 'Generate a concise executive summary of this report.', 'List all obligations of Party A under this agreement.', 'Identify any compliance issues in the attached policy.', 'What is the total financial exposure mentioned in the Q3 report?', 'Translate the technical specifications into business language.'][i % 8],
    output: ['The clause establishes a 30-day notice period for termination without cause, with severance calculated at 2 weeks per year of service.', 'Section 3 identifies three primary risks: regulatory non-compliance (High), data breach exposure ($2M liability cap), and supply chain disruption.', 'Key dates: Contract start: Jan 1, 2024 · Milestone 1: Mar 15 · Final delivery: Sep 30 · Renewal window: Oct 1–Nov 30, 2024.', 'Q3 performance exceeded targets by 12%. Operating margin improved to 23.4%. Key risks include FX headwinds and elevated R&D spend.', 'Party A is obligated to: (1) deliver software by Sept 30, (2) provide 99.9% SLA, (3) maintain ISO 27001 certification throughout.', 'Three compliance gaps identified: missing Data Retention Policy, outdated Privacy Notice (pre-GDPR), unreviewed Third-Party risk assessments.', 'Total financial exposure: $4.2M across three categories: regulatory ($1.8M), litigation ($1.4M), and operational losses ($1M).', 'The system uses a distributed microservices architecture with 99.99% uptime, auto-scaling up to 10K concurrent users, and sub-100ms response times.'][i % 8],
    score: Math.round(68 + Math.random() * 30),
    latency: `${(0.4 + Math.random() * 1.8).toFixed(2)}s`,
    tokens: Math.round(180 + Math.random() * 400),
    status: Math.random() > 0.15 ? 'pass' : 'warn',
}))

const scoreColor = s => s >= 85 ? '#34D399' : s >= 65 ? '#FBBF24' : '#f87171'

/* ═══════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════ */

/* Radar chart SVG */
function RadarChart({ scores }) {
    const cx = 80, cy = 80, r = 58
    const keys = Object.keys(scores)
    const n = keys.length
    const pts = keys.map((k, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2
        const ratio = scores[k] / 100
        return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a), lx: cx + (r + 18) * Math.cos(a), ly: cy + (r + 18) * Math.sin(a), label: k, val: scores[k] }
    })
    const rings = [0.25, 0.5, 0.75, 1]
    return (
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
            {rings.map((c, i) => (
                <polygon key={i}
                    points={keys.map((_, j) => { const a = (Math.PI * 2 * j) / n - Math.PI / 2; return `${cx + r * c * Math.cos(a)},${cy + r * c * Math.sin(a)}` }).join(' ')}
                    fill="none" stroke="rgba(78,142,255,0.08)" strokeWidth="1" />
            ))}
            {keys.map((_, i) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(78,142,255,0.1)" strokeWidth="1" /> })}
            <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(78,142,255,0.18)" stroke="#4E8EFF" strokeWidth="1.5" />
            {pts.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r="3.5" fill="#4E8EFF" /><text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="rgba(148,163,184,0.9)">{p.label}</text></g>)}
        </svg>
    )
}

/* Drop Zone */
function DropZone({ label, hint, accept, icon, badge, files, onAdd, onRemove, single = false, accentColor = '#4E8EFF' }) {
    const inp = useRef()
    const [drag, setDrag] = useState(false)
    const add = list => { const a = Array.from(list); single ? onAdd(a.slice(0, 1)) : onAdd(a) }
    return (
        <div className={`evz ${drag ? 'evz--drag' : ''} ${files.length ? 'evz--has-files' : ''}`}
            style={{ '--z-color': accentColor }}
            onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files) }}
            onClick={() => inp.current.click()}>
            <input ref={inp} type="file" multiple={!single} accept={accept} style={{ display: 'none' }} onChange={e => add(e.target.files)} />
            {files.length === 0 ? (
                <>
                    <div className="evz__icon" style={{ color: accentColor }}>{icon}</div>
                    <div className="evz__label">{label}</div>
                    <div className="evz__badge">{badge}</div>
                    <div className="evz__hint">{hint}</div>
                </>
            ) : (
                <div className="evz__files" onClick={e => e.stopPropagation()}>
                    {files.map((f, i) => (
                        <div key={i} className="evz__chip">
                            <span className="evz__chip-icon" style={{ color: accentColor }}>{I.fileText}</span>
                            <span className="evz__chip-name">{f.name}</span>
                            <span className="evz__chip-size">{(f.size / 1024).toFixed(0)}KB</span>
                            <button className="evz__chip-rm" onClick={e => { e.stopPropagation(); onRemove(i) }}>{I.x}</button>
                        </div>
                    ))}
                    <div className="evz__add-more">
                        <span style={{ color: accentColor }}>{I.upload}</span>
                        <span>Add more files</span>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════ */
export default function ModelEvaluation({ theme, onToggleTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)

    // config
    const [selectedModel, setSelectedModel] = useState('')
    const [temperature, setTemperature] = useState(0.3)
    const [maxTokens, setMaxTokens] = useState(1024)
    const [systemPrompt, setSystemPrompt] = useState('')
    const [promptFiles, setPromptFiles] = useState([])
    const [docFiles, setDocFiles] = useState([])

    // eval
    const [evalState, setEvalState] = useState('idle')   // idle | running | done
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState([])
    const [expandedRow, setExpandedRow] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    const canRun = selectedModel && promptFiles.length > 0
    const modelMeta = AVAILABLE_MODELS.find(m => m.id === selectedModel)

    const runEval = () => {
        if (!canRun) return
        setEvalState('running'); setProgress(0); setResults([]); setExpandedRow(null); setActiveTab('overview')
        const data = genResults(8)
        let i = 0
        const tick = setInterval(() => {
            i++; setProgress(Math.round(i / 8 * 100)); setResults(prev => [...prev, data[i - 1]])
            if (i >= 8) { clearInterval(tick); setEvalState('done') }
        }, 450)
    }

    const downloadCsv = () => {
        const header = ['#', 'Prompt', 'Model Output', 'Score', 'Latency', 'Tokens', 'Status']
        const rows = results.map(r => [r.id, `"${r.prompt}"`, `"${r.output}"`, r.score, r.latency, r.tokens, r.status])
        const csv = [header, ...rows].map(r => r.join(',')).join('\n')
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
        a.download = `eval-${selectedModel}-${Date.now()}.csv`; a.click()
    }

    // Metrics
    const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : null
    const avgLat = results.length ? (results.reduce((s, r) => s + parseFloat(r.latency), 0) / results.length).toFixed(2) : null
    const totalTok = results.length ? results.reduce((s, r) => s + r.tokens, 0) : null
    const passRate = results.length ? Math.round(results.filter(r => r.status === 'pass').length / results.length * 100) : null
    const radarData = avgScore ? { Faithfulness: Math.min(100, avgScore + 4), Relevance: Math.min(100, avgScore - 2), Coherence: Math.min(100, avgScore + 7), Safety: 96, Conciseness: Math.min(100, avgScore - 5), Grounded: Math.min(100, avgScore + 2) } : null

    return (
        <div className="dash">

            {/* ══ Sidebar ══ */}
            <nav className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : ''}`}
                onMouseEnter={() => { if (!sidebarOpen) setSidebarPeek(true) }} onMouseLeave={() => setSidebarPeek(false)}>
                <div className="dash__sidebar-top">
                    <div className="dash__sidebar-logo">
                        <svg viewBox="0 0 28 28" fill="none"><path d="M14 2L25 8v12l-11 6L3 20V8l11-6z" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(78,142,255,0.1)" /><path d="M14 8l6 6-6 6-6-6 6-6z" fill="var(--accent)" opacity="0.8" /><circle cx="14" cy="14" r="2" fill="var(--bg-navy)" /></svg>
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
                                const El = it.href ? Link : 'button'
                                return (
                                    <El key={ii} to={it.href} className={`dash__nav-item ${it.active ? 'dash__nav-item--active' : ''}`} title={!(sidebarOpen || sidebarPeek) ? it.name : undefined}>
                                        <span className="dash__nav-icon">{it.icon}</span>
                                        <span className="dash__nav-text">{it.name}</span>
                                    </El>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </nav>

            {/* ══ Content ══ */}
            <div className="dash__content">

                {/* Top bar */}
                <header className="dash__header">
                    <div className="dash__header-left">
                        <Link to="/enter" className="dash__persona-link">{I.chevDown}<span>Change Persona</span></Link>
                    </div>
                    <div className="dash__header-center">
                        <span className="dash__header-title">GenAI Studio Platform</span>
                        <span className="dash__persona-tag">Platform Admin</span>
                    </div>
                    <div className="dash__header-right">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                        <button className="dash__icon-btn">{I.settings}</button>
                        <button className="dash__icon-btn">{I.bell}<span className="dash__notif-dot" /></button>
                        <div className="dash__avatar">PA</div>
                    </div>
                </header>

                {/* ═══ Page ═══ */}
                <main className="ev2">

                    {/* ─── Hero ─── */}
                    <section className="ev2__hero">
                        <div className="ev2__hero-orb ev2__hero-orb--1" />
                        <div className="ev2__hero-orb ev2__hero-orb--2" />
                        <div className="ev2__hero-orb ev2__hero-orb--3" />
                        <div className="ev2__hero-inner">
                            <div className="ev2__breadcrumb">
                                <Link to="/persona/admin" className="ev2__bc-link">Admin</Link>
                                <span className="ev2__bc-sep"> / </span>
                                <span className="ev2__bc-current">Model Evaluation</span>
                            </div>
                            <div className="ev2__hero-row">
                                <div>
                                    <div className="ev2__hero-badge">{I.sparkles} AI Evaluation Engine</div>
                                    <h1 className="ev2__hero-title">Model Evaluation</h1>
                                    <p className="ev2__hero-sub">Upload your prompt set &amp; documents · Run evaluations · Download results with quality metrics</p>
                                </div>
                                {evalState === 'done' && (
                                    <button className="ev2__dl-btn" onClick={downloadCsv}>
                                        {I.download} Export Results (.csv)
                                    </button>
                                )}
                            </div>
                            {evalState === 'done' && (
                                <div className="ev2__hero-kpis">
                                    {[
                                        { label: 'Avg Score', val: avgScore, unit: '/100', color: scoreColor(avgScore) },
                                        { label: 'Pass Rate', val: `${passRate}`, unit: '%', color: passRate >= 80 ? '#34D399' : '#FBBF24' },
                                        { label: 'Avg Latency', val: avgLat, unit: 's', color: '#94A3B8' },
                                        { label: 'Total Tokens', val: totalTok?.toLocaleString(), unit: '', color: '#94A3B8' },
                                        { label: 'Prompts Run', val: results.length, unit: '', color: '#94A3B8' },
                                    ].map((k, i) => (
                                        <div key={i} className="ev2__hero-kpi">
                                            <span className="ev2__hero-kpi-val" style={{ color: k.color }}>{k.val}<span>{k.unit}</span></span>
                                            <span className="ev2__hero-kpi-label">{k.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ─── Setup Cards Bento ─── */}
                    <section className="ev2__setup">

                        {/* Model Picker Card */}
                        <div className="ev2__card ev2__card--model">
                            <div className="ev2__card-head">
                                <div className="ev2__card-icon ev2__card-icon--blue">{I.cpu}</div>
                                <div>
                                    <div className="ev2__card-title">Select Model</div>
                                    <div className="ev2__card-sub">Choose the model to evaluate</div>
                                </div>
                            </div>
                            <div className="ev2__model-grid">
                                {AVAILABLE_MODELS.map(m => (
                                    <button key={m.id}
                                        className={`ev2__model-tile ${selectedModel === m.id ? 'ev2__model-tile--active' : ''}`}
                                        onClick={() => setSelectedModel(m.id)}
                                        style={{ '--mc': m.color }}>
                                        <div className="ev2__model-dot" style={{ background: m.color }} />
                                        <div className="ev2__model-name">{m.name}</div>
                                        <div className="ev2__model-vendor">{m.vendor}</div>
                                        {selectedModel === m.id && <div className="ev2__model-check">{I.check}</div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Config Card */}
                        <div className="ev2__card ev2__card--config">
                            <div className="ev2__card-head">
                                <div className="ev2__card-icon ev2__card-icon--purple">{I.settings}</div>
                                <div>
                                    <div className="ev2__card-title">Configuration</div>
                                    <div className="ev2__card-sub">Model parameters &amp; instructions</div>
                                </div>
                            </div>
                            <div className="ev2__config-body">
                                <label className="ev2__label">
                                    <span>Temperature <em className="ev2__param-chip">{temperature}</em></span>
                                    <input type="range" min="0" max="1" step="0.05" value={temperature}
                                        onChange={e => setTemperature(+e.target.value)} className="ev2__slider" />
                                    <div className="ev2__slider-row"><span>Precise</span><span>Creative</span></div>
                                </label>
                                <label className="ev2__label">
                                    <span>Max Output Tokens <em className="ev2__param-chip">{maxTokens.toLocaleString()}</em></span>
                                    <input type="range" min="128" max="8192" step="128" value={maxTokens}
                                        onChange={e => setMaxTokens(+e.target.value)} className="ev2__slider" />
                                    <div className="ev2__slider-row"><span>128</span><span>8,192</span></div>
                                </label>
                                <label className="ev2__label ev2__label--full">
                                    <span>System Prompt <em className="ev2__opt">optional</em></span>
                                    <textarea rows={3} placeholder="You are an expert document analyst..."
                                        value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} />
                                </label>
                            </div>
                        </div>

                        {/* Prompt Upload */}
                        <div className="ev2__card ev2__card--upload">
                            <div className="ev2__card-head">
                                <div className="ev2__card-icon ev2__card-icon--green">{I.fileExcel}</div>
                                <div>
                                    <div className="ev2__card-title">Prompts File <span className="ev2__req">*</span></div>
                                    <div className="ev2__card-sub">Excel or CSV — one prompt per row</div>
                                </div>
                            </div>
                            <DropZone label="Drop prompts file here" hint="or click to browse" badge=".xlsx · .xls · .csv"
                                accept=".xlsx,.xls,.csv" icon={I.fileExcel} accentColor="#34D399"
                                files={promptFiles} single onAdd={f => setPromptFiles(f)} onRemove={() => setPromptFiles([])} />
                        </div>

                        {/* Doc Upload */}
                        <div className="ev2__card ev2__card--upload">
                            <div className="ev2__card-head">
                                <div className="ev2__card-icon ev2__card-icon--amber">{I.filePdf}</div>
                                <div>
                                    <div className="ev2__card-title">Context Documents <span className="ev2__opt">optional</span></div>
                                    <div className="ev2__card-sub">PDFs, DOCX, TXT — passed as context</div>
                                </div>
                            </div>
                            <DropZone label="Drop documents here" hint="or click to browse" badge=".pdf · .docx · .txt · .csv · .json"
                                accept=".pdf,.docx,.txt,.csv,.json,.xml,.md" icon={I.filePdf} accentColor="#F59E0B"
                                files={docFiles} onAdd={f => setDocFiles(p => [...p, ...f])} onRemove={i => setDocFiles(p => p.filter((_, j) => j !== i))} />
                        </div>

                    </section>

                    {/* ─── Run Bar ─── */}
                    <div className="ev2__runbar">
                        <div className="ev2__runbar-info">
                            {modelMeta && <><div className="ev2__runbar-dot" style={{ background: modelMeta.color }} /><span className="ev2__runbar-model">{modelMeta.name}</span></>}
                            {promptFiles.length > 0 && <span className="ev2__runbar-file">{I.fileText} {promptFiles[0]?.name}</span>}
                            {docFiles.length > 0 && <span className="ev2__runbar-docs">{docFiles.length} doc{docFiles.length > 1 ? 's' : ''}</span>}
                        </div>
                        <div className="ev2__runbar-actions">
                            {evalState === 'done' && (
                                <button className="ev2__runbar-export" onClick={downloadCsv}>{I.download} Export</button>
                            )}
                            <button
                                className={`ev2__run-btn ${!canRun ? 'ev2__run-btn--off' : ''} ${evalState === 'running' ? 'ev2__run-btn--busy' : ''}`}
                                onClick={runEval} disabled={!canRun || evalState === 'running'}>
                                {evalState === 'running'
                                    ? <><span className="ev2__spin" /><span>Running… {progress}%</span></>
                                    : <>{I.play} Run Evaluation</>}
                            </button>
                        </div>
                    </div>

                    {/* ─── Progress ─── */}
                    {evalState === 'running' && (
                        <div className="ev2__progbar">
                            <div className="ev2__progbar-fill" style={{ width: `${progress}%` }} />
                        </div>
                    )}

                    {/* ─── Results Section ─── */}
                    {results.length > 0 && (
                        <section className="ev2__results">

                            {/* Tab bar */}
                            <div className="ev2__tabs">
                                {[['overview', 'Overview'], ['table', 'Results Table'], ['output', 'Output Viewer']].map(([k, l]) => (
                                    <button key={k} className={`ev2__tab ${activeTab === k ? 'ev2__tab--active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
                                ))}
                            </div>

                            {/* ── Overview tab ── */}
                            {activeTab === 'overview' && (
                                <div className="ev2__overview">

                                    {/* Four score cards */}
                                    <div className="ev2__score-cards">
                                        {[
                                            { label: 'Quality Score', val: avgScore, unit: '/100', sub: 'Average across all prompts', color: scoreColor(avgScore), big: true },
                                            { label: 'Pass Rate', val: `${passRate}%`, sub: `${results.filter(r => r.status === 'pass').length} of ${results.length} passed`, color: passRate >= 80 ? '#34D399' : '#FBBF24' },
                                            { label: 'Avg Latency', val: `${avgLat}s`, sub: 'Mean response time', color: '#60A5FA' },
                                            { label: 'Total Tokens', val: totalTok?.toLocaleString(), sub: 'Across all completions', color: '#A78BFA' },
                                        ].map((c, i) => (
                                            <div key={i} className={`ev2__score-card ${c.big ? 'ev2__score-card--big' : ''}`}>
                                                <div className="ev2__sc-val" style={{ color: c.color }}>{c.val}{c.unit && <span>{c.unit}</span>}</div>
                                                <div className="ev2__sc-label">{c.label}</div>
                                                <div className="ev2__sc-sub">{c.sub}</div>
                                                <div className="ev2__sc-glow" style={{ background: c.color }} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Radar + bars */}
                                    <div className="ev2__charts">

                                        {/* Radar */}
                                        <div className="ev2__glass-card ev2__glass-card--radar">
                                            <div className="ev2__gc-title">Quality Dimensions</div>
                                            <div className="ev2__radar-wrap">
                                                {radarData && <RadarChart scores={radarData} />}
                                                <div className="ev2__radar-legend">
                                                    {radarData && Object.entries(radarData).map(([k, v]) => (
                                                        <div key={k} className="ev2__rl-row">
                                                            <span>{k}</span>
                                                            <div className="ev2__rl-bar-wrap">
                                                                <div className="ev2__rl-bar" style={{ width: `${v}%`, background: scoreColor(v) }} />
                                                            </div>
                                                            <span style={{ color: scoreColor(v) }} className="ev2__rl-num">{v}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Per-prompt bars */}
                                        <div className="ev2__glass-card ev2__glass-card--bars">
                                            <div className="ev2__gc-title">Per-Prompt Scores</div>
                                            <div className="ev2__prompt-bars">
                                                {results.map(r => (
                                                    <div key={r.id} className="ev2__pb-row">
                                                        <span className="ev2__pb-lbl">P{r.id}</span>
                                                        <div className="ev2__pb-track">
                                                            <div className="ev2__pb-fill" style={{ width: `${r.score}%`, background: scoreColor(r.score) }} />
                                                        </div>
                                                        <span className="ev2__pb-val" style={{ color: scoreColor(r.score) }}>{r.score}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Latency view */}
                                        <div className="ev2__glass-card ev2__glass-card--lat">
                                            <div className="ev2__gc-title">Latency &amp; Tokens</div>
                                            <div className="ev2__lat-list">
                                                {results.map(r => (
                                                    <div key={r.id} className="ev2__lat-row">
                                                        <span className="ev2__lat-id">P{r.id}</span>
                                                        <div className="ev2__lat-bars">
                                                            <div className="ev2__lat-bar ev2__lat-bar--lat" style={{ width: `${(parseFloat(r.latency) / 2.5) * 100}%` }} />
                                                            <div className="ev2__lat-bar ev2__lat-bar--tok" style={{ width: `${(r.tokens / 600) * 100}%` }} />
                                                        </div>
                                                        <div className="ev2__lat-meta">
                                                            <span>{r.latency}</span>
                                                            <span>{r.tokens}t</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="ev2__lat-legend">
                                                <span><span style={{ background: '#60A5FA' }} />Latency</span>
                                                <span><span style={{ background: '#A78BFA' }} />Tokens</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* ── Results Table tab ── */}
                            {activeTab === 'table' && (
                                <div className="ev2__table-wrap">
                                    <div className="ev2__table-topbar">
                                        <span className="ev2__table-ttl">{results.length} prompts evaluated</span>
                                        <button className="ev2__export-btn" onClick={downloadCsv}>{I.download} Export to Excel</button>
                                    </div>
                                    <table className="ev2__table">
                                        <thead>
                                            <tr>
                                                <th>#</th><th>Prompt</th><th>Score</th><th>Latency</th><th>Tokens</th><th>Status</th><th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map(r => (
                                                <React.Fragment key={r.id}>
                                                    <tr className={`ev2__row ${expandedRow === r.id ? 'ev2__row--open' : ''}`}
                                                        onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                                                        <td className="ev2__td-n">{r.id}</td>
                                                        <td className="ev2__td-p">{r.prompt}</td>
                                                        <td>
                                                            <div className="ev2__inline-bar">
                                                                <div className="ev2__ib-track">
                                                                    <div className="ev2__ib-fill" style={{ width: `${r.score}%`, background: scoreColor(r.score) }} />
                                                                </div>
                                                                <span style={{ color: scoreColor(r.score) }}>{r.score}</span>
                                                            </div>
                                                        </td>
                                                        <td className="ev2__td-s">{r.latency}</td>
                                                        <td className="ev2__td-s">{r.tokens}</td>
                                                        <td>
                                                            <span className={`ev2__badge ${r.status === 'pass' ? 'ev2__badge--pass' : 'ev2__badge--warn'}`}>
                                                                {r.status === 'pass' ? <>{I.check}Pass</> : <>⚠ Review</>}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`ev2__chevron ${expandedRow === r.id ? 'ev2__chevron--open' : ''}`}>{I.expandRow}</span>
                                                        </td>
                                                    </tr>
                                                    {expandedRow === r.id && (
                                                        <tr className="ev2__detail-row">
                                                            <td colSpan={7}>
                                                                <div className="ev2__detail">
                                                                    <div className="ev2__detail-half ev2__detail-half--in">
                                                                        <div className="ev2__dh-label">Prompt</div>
                                                                        <p>{r.prompt}</p>
                                                                    </div>
                                                                    <div className="ev2__detail-half ev2__detail-half--out">
                                                                        <div className="ev2__dh-label">{I.zap} Model Output</div>
                                                                        <p>{r.output}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ── Output Viewer tab ── */}
                            {activeTab === 'output' && (
                                <div className="ev2__viewer">
                                    {results.map(r => (
                                        <div key={r.id} className="ev2__vcard">
                                            <div className="ev2__vcard-head">
                                                <span className="ev2__vcard-num">Prompt {r.id}</span>
                                                <span className={`ev2__badge ${r.status === 'pass' ? 'ev2__badge--pass' : 'ev2__badge--warn'}`}>
                                                    {r.status === 'pass' ? <>{I.check}Pass</> : <>⚠ Review</>}
                                                </span>
                                                <span className="ev2__vcard-meta">{r.latency} · {r.tokens} tokens</span>
                                                <span className="ev2__vcard-score" style={{ color: scoreColor(r.score) }}>{r.score}/100</span>
                                            </div>
                                            <div className="ev2__vcard-body">
                                                <div className="ev2__vcard-col ev2__vcard-col--in">
                                                    <div className="ev2__vcard-lbl">Prompt</div>
                                                    <div className="ev2__vcard-txt">{r.prompt}</div>
                                                </div>
                                                <div className="ev2__vcard-divider" />
                                                <div className="ev2__vcard-col ev2__vcard-col--out">
                                                    <div className="ev2__vcard-lbl">{I.zap} Output</div>
                                                    <div className="ev2__vcard-txt">{r.output}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </section>
                    )}

                    {/* Empty state */}
                    {evalState === 'idle' && (
                        <div className="ev2__empty">
                            <div className="ev2__empty-icon">{I.barChart}</div>
                            <h3>Ready to evaluate</h3>
                            <p>Configure your model above, upload a prompts file, and click <strong>Run Evaluation</strong></p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}
