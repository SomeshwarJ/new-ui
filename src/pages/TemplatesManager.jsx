import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import '../styles/templates-manager.css'

/* ═══════════════════════════════════
   Inline SVG Icons
   ═══════════════════════════════════ */
const I = {
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    alertTri: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    trendingUp: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    server: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    archive: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
    cpu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /></svg>,
    checkCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>,
    search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
}

/* ═══════════════════════════════════
   Sidebar
   ═══════════════════════════════════ */
const sidebarSections = [
    { label: 'OVERVIEW', items: [{ name: 'Home', icon: I.home, href: '/persona/admin' }] },
    {
        label: 'PLATFORM MANAGEMENT', items: [
            { name: 'Platform Overview', icon: I.grid },
            { name: 'Use Case Management', icon: I.briefcase },
            { name: 'API Keys', icon: I.key },
            { name: 'Model Onboarding', icon: I.box, href: '/persona/admin/models' },
            { name: 'Model Evaluation', icon: I.activity, href: '/persona/admin/evaluate' },
            // { name: 'All Workspaces', icon: I.layers },
            // { name: 'Asset Registry', icon: I.archive },
        ]
    },
    {
        label: 'GOVERNANCE', items: [
            { name: 'Policies', icon: I.shield, href: '/persona/admin/policies' },
            { name: 'Templates', icon: I.layers, active: true, href: '/persona/admin/templates' },
            // { name: "Guardrails Config", icon: I.settings, href: '/persona/admin/guardrails' },
            // { name: 'Policy Engine', icon: I.cpu },
            // { name: 'Approvals & Gates', icon: I.checkCircle },
        ]
    },
    // {
    //     label: 'INFRASTRUCTURE', items: [
    //         { name: 'Compute Resources', icon: I.server },
    //         { name: 'Monitoring', icon: I.activity },
    //     ]
    // },
]

/* ═══════════════════════════════════
   Constants
   ═══════════════════════════════════ */
const ALL_POLICIES = [
    { id: 'p1', name: 'Block Toxic & Hate Speech', category: 'content-safety' },
    { id: 'p2', name: 'PII Detection & Redaction', category: 'data-privacy' },
    { id: 'p3', name: 'Prompt Injection Defense', category: 'security' },
    { id: 'p4', name: 'Credit Card Masking', category: 'data-privacy' },
    { id: 'p5', name: 'Malicious URI Filter', category: 'security' },
    { id: 'p6', name: 'Custom Profanity Filter', category: 'custom' },
]

const DOC_TYPES = ['PDF', 'CSV', 'TXT', 'DOCX', 'JSON', 'XLSX', 'HTML', 'XML']

const ENFORCEMENT_TYPES = [
    { id: 'strict', label: 'Strict', desc: 'Block any violating content' },
    { id: 'moderate', label: 'Moderate', desc: 'Flag and allow with warning' },
    { id: 'audit', label: 'Audit Only', desc: 'Log violations without blocking' },
]

const INITIAL_TEMPLATES = [
    { id: 1, name: 'Enterprise Data Protection', desc: 'Comprehensive data privacy and PII protection template for enterprise workloads', enforcement: 'strict', status: 'active', policyIds: ['p2', 'p4'], docTypes: ['PDF', 'CSV', 'DOCX', 'XLSX'], tags: ['Data Privacy', 'Input/Output'], triggers: 1247, blocked: 1189, accuracy: 95.3, apps: 24, updatedAt: '10 minutes ago', updatedBy: 'Admin' },
    { id: 2, name: 'Content Moderation Suite', desc: 'Full content safety pipeline with toxic speech filtering and profanity detection', enforcement: 'moderate', status: 'active', policyIds: ['p1', 'p6'], docTypes: ['TXT', 'PDF', 'HTML'], tags: ['Content Safety', 'Moderation'], triggers: 3891, blocked: 2455, accuracy: 97.3, apps: 18, updatedAt: '1 hour ago', updatedBy: 'Admin' },
    { id: 3, name: 'Security Hardening Pack', desc: 'Maximum security guards including prompt injection defense and URI filtering', enforcement: 'strict', status: 'active', policyIds: ['p3', 'p5'], docTypes: ['PDF', 'JSON', 'XML'], tags: ['Security', 'Injection Defense'], triggers: 892, blocked: 876, accuracy: 98.2, apps: 12, updatedAt: '3 hours ago', updatedBy: 'Security Lead' },
]

const TEMPLATE_APPS = {
    1: [
        { id: 'a1', name: 'Customer Support Bot', type: 'Chatbot', env: 'Production', status: 'active', lastActive: '2 min ago', icon: '🤖' },
        { id: 'a2', name: 'HR Document Analyzer', type: 'RAG Pipeline', env: 'Production', status: 'active', lastActive: '5 min ago', icon: '📄' },
        { id: 'a3', name: 'Financial Report Generator', type: 'Agent', env: 'Production', status: 'active', lastActive: '12 min ago', icon: '💰' },
        { id: 'a4', name: 'Legal Contract Review', type: 'RAG Pipeline', env: 'Staging', status: 'active', lastActive: '1 hr ago', icon: '⚖️' },
        { id: 'a5', name: 'Internal Knowledge Base', type: 'Chatbot', env: 'Production', status: 'active', lastActive: '3 hr ago', icon: '📚' },
        { id: 'a6', name: 'Email Drafting Assistant', type: 'Agent', env: 'Production', status: 'warning', lastActive: '6 hr ago', icon: '✉️' },
        { id: 'a7', name: 'Data Migration Tool', type: 'Batch', env: 'Staging', status: 'inactive', lastActive: '2 days ago', icon: '💾' },
    ],
    2: [
        { id: 'b1', name: 'Public Forum Moderator', type: 'Agent', env: 'Production', status: 'active', lastActive: '1 min ago', icon: '🛡️' },
        { id: 'b2', name: 'Social Media Monitor', type: 'Streaming', env: 'Production', status: 'active', lastActive: '3 min ago', icon: '📱' },
        { id: 'b3', name: 'Comment Filter API', type: 'REST API', env: 'Production', status: 'active', lastActive: '8 min ago', icon: '💬' },
        { id: 'b4', name: 'Review Screening Bot', type: 'Chatbot', env: 'Production', status: 'active', lastActive: '15 min ago', icon: '⭐' },
        { id: 'b5', name: 'User Report Analyzer', type: 'Batch', env: 'Staging', status: 'warning', lastActive: '1 hr ago', icon: '📊' },
    ],
    3: [
        { id: 'c1', name: 'API Gateway Shield', type: 'Middleware', env: 'Production', status: 'active', lastActive: '30 sec ago', icon: '🔒' },
        { id: 'c2', name: 'Prompt Sanitizer', type: 'Middleware', env: 'Production', status: 'active', lastActive: '2 min ago', icon: '🧹' },
        { id: 'c3', name: 'Code Gen Assistant', type: 'Agent', env: 'Production', status: 'active', lastActive: '10 min ago', icon: '💻' },
        { id: 'c4', name: 'DevOps Copilot', type: 'Chatbot', env: 'Staging', status: 'active', lastActive: '45 min ago', icon: '⚙️' },
    ],
}

const catColor = (cat) => ({ 'content-safety': '#f472b6', 'data-privacy': '#818cf8', 'security': '#fb923c', 'custom': '#34d399' }[cat] || '#4E8EFF')

/* ═══════════════════════════════════
   Component
   ═══════════════════════════════════ */
export default function TemplatesManager({ theme, onToggleTheme }) {
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
    const [searchQuery, setSearchQuery] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)
    const [appsModal, setAppsModal] = useState(null) // template id or null

    // form state
    const [formName, setFormName] = useState('')
    const [formDesc, setFormDesc] = useState('')
    const [formEnforcement, setFormEnforcement] = useState('strict')
    const [formPolicies, setFormPolicies] = useState([])
    const [formDocTypes, setFormDocTypes] = useState([])
    const [policySearch, setPolicySearch] = useState('')

    const resetForm = () => {
        setFormName(''); setFormDesc(''); setFormEnforcement('strict')
        setFormPolicies([]); setFormDocTypes([]); setPolicySearch('')
        setEditingTemplate(null)
    }

    const openCreate = () => { resetForm(); setDrawerOpen(true) }
    const openEdit = (tmpl) => {
        setEditingTemplate(tmpl)
        setFormName(tmpl.name); setFormDesc(tmpl.desc); setFormEnforcement(tmpl.enforcement)
        setFormPolicies([...tmpl.policyIds]); setFormDocTypes([...tmpl.docTypes])
        setDrawerOpen(true)
    }
    const closeDrawer = () => { setDrawerOpen(false); resetForm() }

    const togglePolicy = (id) => {
        setFormPolicies(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
    }
    const toggleDocType = (dt) => {
        setFormDocTypes(prev => prev.includes(dt) ? prev.filter(d => d !== dt) : [...prev, dt])
    }

    const saveTemplate = () => {
        const data = { name: formName, desc: formDesc, enforcement: formEnforcement, status: 'active', policyIds: formPolicies, docTypes: formDocTypes }
        if (editingTemplate) {
            setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...data } : t))
        } else {
            setTemplates(prev => [...prev, { ...data, id: Date.now() }])
        }
        closeDrawer()
    }
    const deleteTemplate = (id) => setTemplates(prev => prev.filter(t => t.id !== id))
    const toggleTemplateStatus = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'disabled' : 'active' } : t))

    const filtered = templates.filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const filteredPolicies = ALL_POLICIES.filter(p => !policySearch || p.name.toLowerCase().includes(policySearch.toLowerCase()))

    const enforcementColor = (e) => ({ strict: '#f87171', moderate: '#fbbf24', audit: '#60a5fa' }[e] || '#4E8EFF')

    return (
        <div className="dash" data-theme={theme}>
            {/* ══ Sidebar ══ */}
            <nav className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : ''}`}
                onMouseEnter={() => { if (!sidebarOpen) setSidebarPeek(true) }}
                onMouseLeave={() => setSidebarPeek(false)}>
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
                                const El = it.href ? Link : 'button';
                                return <El key={ii} to={it.href} className={`dash__nav-item ${it.active ? 'dash__nav-item--active' : ''}`} title={!(sidebarOpen || sidebarPeek) ? it.name : undefined}><span className="dash__nav-icon">{it.icon}</span><span className="dash__nav-text">{it.name}</span></El>
                            })}
                        </div>
                    ))}
                </div>
            </nav>

            {/* ══ Content ══ */}
            <div className="dash__content">
                <header className="dash__header">
                    <div className="dash__header-left"><Link to="/enter" className="dash__persona-link">{I.chevDown}<span>Change Persona</span></Link></div>
                    <div className="dash__header-center"><span className="dash__header-title">GenAI Studio Platform</span><span className="dash__persona-tag">Platform Admin</span></div>
                    <div className="dash__header-right">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                        <button className="dash__icon-btn">{I.settings}</button>
                        <button className="dash__icon-btn">{I.bell}<span className="dash__notif-dot" /></button>
                        <div className="dash__avatar">PA</div>
                    </div>
                </header>

                <main className="dash__main">
                    {/* Page Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="dash__page-title">Templates</h1>
                            <p className="dash__page-subtitle">Group policies into reusable templates for consistent guardrail enforcement</p>
                        </div>
                        <button className="tm-btn tm-btn--primary" onClick={openCreate}>{I.plus} Create Template</button>
                    </div>

                    {/* KPI */}
                    <div className="dash__metrics">
                        <div className="mcard" style={{ '--mc': '#4E8EFF', '--mc-rgb': '78, 142, 255' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.shield}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{templates.filter(t => t.status === 'active').length}</div><div className="mcard__label">Active Guardrails</div></div></div>
                        <div className="mcard" style={{ '--mc': '#FBBF24', '--mc-rgb': '251, 191, 36' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.bolt}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">2,646</div><div className="mcard__label">Total Triggers (24H)</div></div></div>
                        <div className="mcard" style={{ '--mc': '#f87171', '--mc-rgb': '248, 113, 113' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.alertTri}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">2,455</div><div className="mcard__label">Blocked Actions</div></div></div>
                        <div className="mcard" style={{ '--mc': '#34D399', '--mc-rgb': '52, 211, 153' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.trendingUp}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">97.3%</div><div className="mcard__label">Avg Accuracy</div></div></div>
                    </div>

                    {/* Search Bar */}
                    <div className="tm-search-bar">
                        {I.search}
                        <input className="tm-search-input" placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>

                    {/* Template Cards */}
                    <div className="tm-card-list">
                        {filtered.map(tmpl => {
                            const accColor = tmpl.accuracy >= 95 ? '#34d399' : tmpl.accuracy >= 85 ? '#fbbf24' : '#f87171'
                            return (
                                <div className={`tm-card2 ${tmpl.status === 'disabled' ? 'tm-card2--disabled' : ''}`} key={tmpl.id}>
                                    {/* Gradient top accent */}
                                    <div className="tm-card2__accent" style={{ '--acc-from': enforcementColor(tmpl.enforcement), '--acc-to': accColor }} />

                                    <div className="tm-card2__body">
                                        {/* Left panel - Info */}
                                        <div className="tm-card2__left">
                                            <div className="tm-card2__header">
                                                <div className="tm-card2__title-area">
                                                    <span className="tm-card2__icon">{I.layers}</span>
                                                    <div>
                                                        <h3 className="tm-card2__name">{tmpl.name}</h3>
                                                        <p className="tm-card2__desc">{tmpl.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="tm-card2__actions">
                                                    <label className="pm-toggle pm-toggle--card" title={tmpl.status === 'active' ? 'Disable' : 'Enable'}>
                                                        <input type="checkbox" checked={tmpl.status === 'active'} onChange={() => toggleTemplateStatus(tmpl.id)} />
                                                        <span className="pm-toggle__slider" />
                                                    </label>
                                                    <button className="gc-icon-btn" onClick={() => openEdit(tmpl)}>{I.edit}</button>
                                                    <button className="gc-icon-btn gc-icon-btn--danger" onClick={() => deleteTemplate(tmpl.id)}>{I.trash}</button>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="tm-card2__tags">
                                                {(tmpl.tags || []).map(tag => (
                                                    <span className="tm-card2__tag" key={tag}>{tag}</span>
                                                ))}
                                                <span className="tm-card2__enforcement" style={{ '--enf-c': enforcementColor(tmpl.enforcement) }}>{tmpl.enforcement}</span>
                                            </div>

                                            {/* Stats */}
                                            <div className="tm-card2__stats">
                                                <div className="tm-card2__stat">
                                                    <span className="tm-card2__stat-val">{(tmpl.triggers || 0).toLocaleString()}</span>
                                                    <span className="tm-card2__stat-lbl">Triggers</span>
                                                </div>
                                                <div className="tm-card2__stat">
                                                    <span className="tm-card2__stat-val">{(tmpl.blocked || 0).toLocaleString()}</span>
                                                    <span className="tm-card2__stat-lbl">Blocked</span>
                                                </div>
                                                <div className="tm-card2__stat tm-card2__stat--click" onClick={(e) => { e.stopPropagation(); setAppsModal(tmpl.id) }}>
                                                    <span className="tm-card2__stat-val">{tmpl.apps || 0}</span>
                                                    <span className="tm-card2__stat-lbl">Apps ↗</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right panel - Accuracy gauge */}
                                        <div className="tm-card2__right">
                                            <div className="tm-card2__gauge">
                                                <svg viewBox="0 0 100 100" className="tm-card2__gauge-svg">
                                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                                                    <circle cx="50" cy="50" r="42" fill="none" stroke={accColor} strokeWidth="7"
                                                        strokeDasharray={`${(tmpl.accuracy / 100) * 264} 264`}
                                                        strokeLinecap="round" transform="rotate(-90 50 50)"
                                                        style={{ filter: `drop-shadow(0 0 6px ${accColor}40)` }} />
                                                </svg>
                                                <div className="tm-card2__gauge-text">
                                                    <span className="tm-card2__gauge-val" style={{ color: accColor }}>{tmpl.accuracy}%</span>
                                                    <span className="tm-card2__gauge-lbl">Accuracy</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="tm-card2__footer">
                                        <span className="tm-card2__updated">{I.checkCircle} {tmpl.updatedAt || 'Just now'}</span>
                                        <span className="tm-card2__author">{tmpl.updatedBy || 'System'}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </main>
            </div>

            {/* ══════ DRAWER ══════ */}
            {drawerOpen && <div className="tm-overlay" onClick={closeDrawer} />}
            <div className={`tm-drawer ${drawerOpen ? 'tm-drawer--open' : ''}`}>
                <div className="tm-drawer__header">
                    <div className="tm-drawer__header-info">
                        <span className="tm-drawer__header-icon">{I.layers}</span>
                        <div>
                            <h2 className="tm-drawer__title">{editingTemplate ? 'Edit Template' : 'Create Template'}</h2>
                            <p className="tm-drawer__subtitle">Group policies into a reusable guardrail template</p>
                        </div>
                    </div>
                    <button className="tm-drawer__close" onClick={closeDrawer}>{I.x}</button>
                </div>

                <div className="tm-drawer__body">
                    {/* Basic Info */}
                    <div className="tm-drawer__section">
                        <h3 className="tm-drawer__section-title"><span className="tm-drawer__dot" />Basic Information</h3>
                        <div className="tm-form-row">
                            <label className="tm-label">Template Name</label>
                            <input className="tm-input" placeholder="e.g. Enterprise Security Suite" value={formName} onChange={e => setFormName(e.target.value)} />
                        </div>
                        <div className="tm-form-row">
                            <label className="tm-label">Description</label>
                            <textarea className="tm-textarea" placeholder="Describe the purpose of this template..." value={formDesc} onChange={e => setFormDesc(e.target.value)} />
                        </div>
                    </div>

                    {/* Enforcement Type */}
                    <div className="tm-drawer__section">
                        <h3 className="tm-drawer__section-title"><span className="tm-drawer__dot" />Enforcement Type</h3>
                        <div className="tm-enforcement-grid">
                            {ENFORCEMENT_TYPES.map(et => (
                                <button key={et.id} className={`tm-enforcement-btn ${formEnforcement === et.id ? 'tm-enforcement-btn--active' : ''}`} onClick={() => setFormEnforcement(et.id)} style={{ '--enf-c': enforcementColor(et.id) }}>
                                    <span className="tm-enforcement-btn__label">{et.label}</span>
                                    <span className="tm-enforcement-btn__desc">{et.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Attach Policies */}
                    <div className="tm-drawer__section">
                        <h3 className="tm-drawer__section-title">
                            <span className="tm-drawer__dot" />Attach Policies
                            <span className="tm-drawer__section-badge">{formPolicies.length} selected</span>
                        </h3>
                        <div className="tm-policy-search">
                            {I.search}
                            <input placeholder="Search policies..." value={policySearch} onChange={e => setPolicySearch(e.target.value)} />
                        </div>
                        <div className="tm-policy-list">
                            {filteredPolicies.map(pol => (
                                <label className={`tm-policy-item ${formPolicies.includes(pol.id) ? 'tm-policy-item--checked' : ''}`} key={pol.id}>
                                    <input type="checkbox" checked={formPolicies.includes(pol.id)} onChange={() => togglePolicy(pol.id)} />
                                    <span className="tm-policy-item__check" />
                                    <span className="tm-policy-item__name">{pol.name}</span>
                                    <span className="tm-policy-item__cat" style={{ color: catColor(pol.category) }}>{pol.category.replace('-', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Document Screening */}
                    <div className="tm-drawer__section">
                        <h3 className="tm-drawer__section-title">
                            <span className="tm-drawer__dot" />Document Screening
                            <span className="tm-drawer__section-badge">{formDocTypes.length} types</span>
                        </h3>
                        <div className="tm-doc-grid">
                            {DOC_TYPES.map(dt => (
                                <button key={dt} className={`tm-doc-chip ${formDocTypes.includes(dt) ? 'tm-doc-chip--active' : ''}`} onClick={() => toggleDocType(dt)}>
                                    {I.file} {dt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="tm-drawer__footer">
                    <button className="tm-btn tm-btn--ghost" onClick={closeDrawer}>Cancel</button>
                    <button className="tm-btn tm-btn--primary" onClick={saveTemplate} disabled={!formName.trim()}>
                        {I.check} {editingTemplate ? 'Update Template' : 'Save Template'}
                    </button>
                </div>
            </div>

            {/* ══════ APPS MODAL ══════ */}
            {appsModal && (() => {
                const tmpl = templates.find(t => t.id === appsModal)
                const apps = TEMPLATE_APPS[appsModal] || []
                const activeApps = apps.filter(a => a.status === 'active').length
                return (
                    <>
                        <div className="tm-apps-overlay" onClick={() => setAppsModal(null)} />
                        <div className="tm-apps-modal">
                            <div className="tm-apps-modal__header">
                                <div className="tm-apps-modal__header-info">
                                    <div className="tm-apps-modal__icon-ring">{I.layers}</div>
                                    <div>
                                        <h2 className="tm-apps-modal__title">Connected Apps</h2>
                                        <p className="tm-apps-modal__subtitle">{tmpl?.name}</p>
                                    </div>
                                </div>
                                <div className="tm-apps-modal__header-stats">
                                    <span className="tm-apps-modal__badge tm-apps-modal__badge--active">{activeApps} Active</span>
                                    <span className="tm-apps-modal__badge">{apps.length} Total</span>
                                </div>
                                <button className="tm-drawer__close" onClick={() => setAppsModal(null)}>{I.x}</button>
                            </div>
                            <div className="tm-apps-modal__body">
                                {apps.map(app => (
                                    <div className={`tm-app-item ${app.status === 'inactive' ? 'tm-app-item--inactive' : ''}`} key={app.id}>
                                        <span className="tm-app-item__icon">{app.icon}</span>
                                        <div className="tm-app-item__info">
                                            <span className="tm-app-item__name">{app.name}</span>
                                            <span className="tm-app-item__meta">{app.type} &middot; {app.env}</span>
                                        </div>
                                        <div className="tm-app-item__right">
                                            <span className={`tm-app-item__status tm-app-item__status--${app.status}`}>
                                                <span className="tm-app-item__dot" />{app.status}
                                            </span>
                                            <span className="tm-app-item__time">{app.lastActive}</span>
                                        </div>
                                    </div>
                                ))}
                                {apps.length === 0 && (
                                    <div className="tm-apps-modal__empty">
                                        <span style={{ fontSize: 32 }}>📭</span>
                                        <p>No apps connected to this template yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )
            })()}
        </div>
    )
}
