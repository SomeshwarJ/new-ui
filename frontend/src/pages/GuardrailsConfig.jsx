import React, { useState, useRef } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../styles/guardrails-config.css'

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
    send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>,
    x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
};

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
            { name: 'Model Evaluation', icon: I.clipboardCheck, href: '/persona/admin/evaluate' },
            { name: 'Monitoring & Metrics', icon: I.barChart2, href: '/persona/admin/observability' },
        ]
    },
    {
        label: 'STUDIO', items: [
            { name: 'AI Playground', icon: I.terminal, href: '/persona/admin/playground' },
        ],
    },
    {
        label: 'GOVERNANCE', items: [
            { name: 'Policies', icon: I.shield, href: '/persona/admin/policies' },
            { name: 'Templates', icon: I.layers, href: '/persona/admin/templates' },
            // { name: "Guardrails Config", icon: I.settings, active: true, href: '/persona/admin/guardrails' },
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
];

/* ═══════════════════════════════════
   Constants
   ═══════════════════════════════════ */
const DOC_TYPES = ['PDFs', 'CSV', 'TXT', 'DOCX', 'DOCM', 'DOTX', 'DOTM', 'PPTX', 'PPTM', 'POTX', 'POTM', 'POT', 'XLSX', 'XLSM', 'XLTX', 'XLTM'];
const ENFORCEMENT_TYPES = ['Audit Only', 'Block Request', 'Block & Transform (Mask)'];
const CATEGORIES = [
    { id: 'all', label: 'All Guardrails' },
    { id: 'data_privacy', label: 'Data Privacy' },
    { id: 'content_safety', label: 'Content Safety' },
    { id: 'security', label: 'Security' },
    { id: 'quality', label: 'Quality Assurance' },
];

const INITIAL_POLICIES = [
    { id: 'p1', name: 'Block Toxic & Hate Speech', type: 'Content Rule', action: 'Block' },
    { id: 'p2', name: 'PII Detection & Redaction', type: 'Data Protection (SDP)', action: 'Mask' },
    { id: 'p3', name: 'Prompt Injection Defense', type: 'Security Detection', action: 'Block' },
    { id: 'p4', name: 'Log Malicious URIs', type: 'Security Detection', action: 'Audit' }
];

const INITIAL_TEMPLATES = [
    { id: 'pii-detection', name: 'PII Detection & Redaction', description: 'Automatically detects and redacts personally identifiable information from inputs and outputs', category: 'data_privacy', tags: ['Data Privacy', 'Input/Output'], policies: ['p2'], docs: ['PDFs', 'TXT', 'DOCX'], enforcement: 'Block & Transform (Mask)', status: 'active', stats: { applications: 24, triggers: 1247, blocked: 1189, accuracy: 95.3, blockRate: 95.3, lastTriggered: '10 minutes ago' } },
    { id: 'toxicity-filter', name: 'Toxicity & Hate Speech Filter', description: 'Blocks content containing toxic language, hate speech, or harassment', category: 'content_safety', tags: ['Content Safety', 'Input/Output'], policies: ['p1'], docs: [], enforcement: 'Block Request', status: 'active', stats: { applications: 24, triggers: 892, blocked: 856, accuracy: 96.0, blockRate: 96.0, lastTriggered: '15 minutes ago' } },
    { id: 'injection-defense', name: 'Prompt Injection Defense', description: 'Blocks malicious system prompt overrides and jailbreak attempts targeting the LLM', category: 'security', tags: ['Security', 'Input Only'], policies: ['p3'], docs: [], enforcement: 'Block Request', status: 'active', stats: { applications: 20, triggers: 421, blocked: 410, accuracy: 98.1, blockRate: 97.4, lastTriggered: '1 hour ago' } },
    { id: 'malicious-uri', name: 'Malicious URI Parsing', description: 'Audits URIs supplied in user prompts for known malware or phishing signatures', category: 'security', tags: ['Security', 'Input Only'], policies: ['p4'], docs: [], enforcement: 'Audit Only', status: 'active', stats: { applications: 14, triggers: 86, blocked: 0, accuracy: 99.9, blockRate: 0.0, lastTriggered: '3 hours ago' } }
];

/* ═══════════════════════════════════
   COMPONENT
   ═══════════════════════════════════ */
export default function GuardrailsConfig({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarPeek, setSidebarPeek] = useState(false);

    // Core State
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [policies, setPolicies] = useState(INITIAL_POLICIES);
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);

    // DRAWER STATE — the config drawer slides from right, just like chatbot
    const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
    const [drawerTab, setDrawerTab] = useState('template'); // 'template' | 'policy'
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [editingPolicy, setEditingPolicy] = useState(null);

    // Chatbot State
    const [chatMenuOpen, setChatMenuOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ id: 1, text: "Attach a file or type a prompt to test your active guardrail configurations.", sender: "sys" }]);
    const [chatInput, setChatInput] = useState('');
    const [activeTestTemplate, setActiveTestTemplate] = useState('pii-detection');
    const [chatFile, setChatFile] = useState(null);

    // Filter
    const filteredTemplates = templates.filter(t => {
        if (activeFilter !== 'all' && t.category !== activeFilter) return false;
        if (searchQuery) { const q = searchQuery.toLowerCase(); return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q); }
        return true;
    });

    // Stats
    const totalTriggers = templates.reduce((a, t) => a + t.stats.triggers, 0);
    const totalBlocked = templates.reduce((a, t) => a + t.stats.blocked, 0);
    const avgAccuracy = (templates.reduce((a, t) => a + t.stats.accuracy, 0) / (templates.length || 1)).toFixed(1);

    /* ── Drawer Openers ── */
    const openCreateTemplate = () => {
        setEditingTemplate({ name: '', description: '', category: 'custom', policies: [], docs: [], enforcement: 'Block Request', status: 'active' });
        setEditingPolicy(null);
        setDrawerTab('template');
        setConfigDrawerOpen(true);
    };
    const openEditTemplate = (tmpl) => {
        setEditingTemplate({ ...tmpl, docs: [...tmpl.docs], policies: [...tmpl.policies] });
        setEditingPolicy(null);
        setDrawerTab('template');
        setConfigDrawerOpen(true);
    };
    const openCreatePolicy = () => {
        setEditingPolicy({ name: '', type: 'Content Rule', action: 'Block' });
        setEditingTemplate(null);
        setDrawerTab('policy');
        setConfigDrawerOpen(true);
    };
    const openEditPolicy = (p) => {
        setEditingPolicy({ ...p });
        setEditingTemplate(null);
        setDrawerTab('policy');
        setConfigDrawerOpen(true);
    };
    const closeConfigDrawer = () => {
        setConfigDrawerOpen(false);
        setEditingTemplate(null);
        setEditingPolicy(null);
    };

    /* ── Save / Delete ── */
    const saveTemplate = () => {
        if (!editingTemplate || !editingTemplate.name.trim()) return;
        const tmpl = { ...editingTemplate };
        if (!tmpl.id) { tmpl.id = tmpl.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(); tmpl.stats = { applications: 0, triggers: 0, blocked: 0, accuracy: 100.0, blockRate: 100.0, lastTriggered: 'Never' }; tmpl.tags = []; }
        setTemplates(prev => { const exists = prev.find(t => t.id === tmpl.id); if (exists) return prev.map(t => t.id === tmpl.id ? tmpl : t); return [...prev, tmpl]; });
        closeConfigDrawer();
    };
    const deleteTemplate = (id) => setTemplates(t => t.filter(x => x.id !== id));
    const savePolicy = () => {
        if (!editingPolicy || !editingPolicy.name.trim()) return;
        const pol = { ...editingPolicy };
        if (!pol.id) { pol.id = 'p' + Date.now(); }
        setPolicies(prev => { const exists = prev.find(p => p.id === pol.id); if (exists) return prev.map(p => p.id === pol.id ? pol : p); return [...prev, pol]; });
        closeConfigDrawer();
    };
    const deletePolicy = (id) => setPolicies(p => p.filter(x => x.id !== id));

    /* ── Chatbot ── */
    const handleSendTestMessage = () => {
        if (!chatInput.trim() && !chatFile) return;
        const newMsg = { id: Date.now(), text: chatInput || "(File Uploaded)", sender: "user", file: chatFile };
        setChatMessages(prev => [...prev, newMsg]); setChatInput(''); setChatFile(null);
        const activeTmpl = templates.find(t => t.id === activeTestTemplate) || templates[0];
        setTimeout(() => {
            let responseText = "✅ Simulated Model Output: The request was processed successfully.";
            let isViolated = false, isRedacted = false;
            const inputLower = newMsg.text.toLowerCase();
            if (activeTmpl.policies.includes('p2') && (inputLower.includes('@') || inputLower.includes('ssn') || /\d{3}-\d{2}-\d{4}/.test(inputLower))) {
                responseText = activeTmpl.enforcement.includes('Block') ? "🚫 BLOCKED: Sensitive Data Protection detected PII." : "⚠️ TRANSFORMED: PII masked [MASKED_EMAIL].";
                isViolated = activeTmpl.enforcement.includes('Block'); isRedacted = !isViolated;
            }
            if (activeTmpl.policies.includes('p1') && (inputLower.includes('hate') || inputLower.includes('harass') || inputLower.includes('toxic'))) { responseText = "🚫 BLOCKED: Toxic language rules triggered."; isViolated = true; }
            if (activeTmpl.policies.includes('p3') && (inputLower.includes('ignore previous') || inputLower.includes('system prompt'))) { responseText = "🚫 BLOCKED: Prompt Injection Attempt detected."; isViolated = true; }
            setChatMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: "sys", violated: isViolated, redacted: isRedacted }]);
        }, 800);
    };

    /* ═══════════════════════════════
       RENDER
       ═══════════════════════════════ */
    return (
        <div className="dash">
            {/* ══ Sidebar ══ */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* ══ Content ══ */}
            <div className="dash__content">
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="GenAI Studio Platform" />

                <main className="dash__main">
                    {/* Page Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em', color: 'var(--text-white)' }}>Guardrails Configuration</h1>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Configure and monitor AI safety and compliance guardrails</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="gc-btn gc-btn--accent" onClick={() => setChatMenuOpen(true)}>{I.activity} Test Settings</button>
                            <button className="gc-btn gc-btn--primary" onClick={openCreateTemplate}>{I.plus} Create Guardrail</button>
                        </div>
                    </div>

                    {/* KPI Row */}
                    <div className="dash__metrics">
                        <div className="mcard" style={{ '--mc': '#4E8EFF', '--mc-rgb': '78, 142, 255' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.shield}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{templates.filter(t => t.status === 'active').length}</div><div className="mcard__label">Active Guardrails</div></div></div>
                        <div className="mcard" style={{ '--mc': '#FBBF24', '--mc-rgb': '251, 191, 36' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.bolt}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{totalTriggers.toLocaleString()}</div><div className="mcard__label">Total Triggers (24h)</div></div></div>
                        <div className="mcard" style={{ '--mc': '#f87171', '--mc-rgb': '248, 113, 113' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.alertTri}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{totalBlocked.toLocaleString()}</div><div className="mcard__label">Blocked Actions</div></div></div>
                        <div className="mcard" style={{ '--mc': '#34D399', '--mc-rgb': '52, 211, 153' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.trendingUp}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{avgAccuracy}%</div><div className="mcard__label">Avg Accuracy</div></div></div>
                    </div>

                    {/* Filter Row */}
                    <div className="gc-filters-row">
                        {CATEGORIES.map(cat => (
                            <button key={cat.id} className={`gc-filter-tab ${activeFilter === cat.id ? 'gc-filter-tab--active' : ''}`} onClick={() => setActiveFilter(cat.id)}>
                                {cat.label} ({cat.id === 'all' ? templates.length : templates.filter(t => t.category === cat.id).length})
                            </button>
                        ))}
                        <input className="gc-search-input" placeholder="Search guardrails..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>

                    {/* Cards Grid */}
                    <div className="gc-card-grid">
                        {filteredTemplates.map(tmpl => {
                            const accentColor = tmpl.category === 'data-privacy' ? '#818cf8' : tmpl.category === 'content-safety' ? '#f472b6' : tmpl.category === 'security' ? '#fb923c' : '#34d399';
                            return (
                                <div className="gc-tile" key={tmpl.id} style={{ '--tile-accent': accentColor }}>
                                    <div className="gc-tile__header">
                                        <div className="gc-tile__title-row">
                                            <span className="gc-tile__icon">{I.shield}</span>
                                            <h3 className="gc-tile__name">{tmpl.name}</h3>
                                            <span className="gc-tile__status">{tmpl.status}</span>
                                        </div>
                                        <div className="gc-tile__actions">
                                            <button className="gc-icon-btn" onClick={() => openEditTemplate(tmpl)}>{I.edit}</button>
                                            <button className="gc-icon-btn gc-icon-btn--danger" onClick={() => deleteTemplate(tmpl.id)}>{I.trash}</button>
                                        </div>
                                    </div>
                                    <p className="gc-tile__desc">{tmpl.description}</p>
                                    <div className="gc-tile__tags">
                                        {tmpl.tags?.map((tag, i) => <span className="gc-tile__tag" key={i}>{tag}</span>)}
                                    </div>
                                    <div className="gc-tile__stats">
                                        <div className="gc-tile__stat">
                                            <span className="gc-tile__stat-val">{tmpl.stats.triggers.toLocaleString()}</span>
                                            <span className="gc-tile__stat-lbl">Triggers</span>
                                        </div>
                                        <div className="gc-tile__stat-divider" />
                                        <div className="gc-tile__stat">
                                            <span className="gc-tile__stat-val">{tmpl.stats.blocked.toLocaleString()}</span>
                                            <span className="gc-tile__stat-lbl">Blocked</span>
                                        </div>
                                        <div className="gc-tile__stat-divider" />
                                        <div className="gc-tile__stat">
                                            <span className="gc-tile__stat-val gc-tile__stat-val--accent">{tmpl.stats.accuracy}%</span>
                                            <span className="gc-tile__stat-lbl">Accuracy</span>
                                        </div>
                                        <div className="gc-tile__stat-divider" />
                                        <div className="gc-tile__stat">
                                            <span className="gc-tile__stat-val">{tmpl.stats.applications}</span>
                                            <span className="gc-tile__stat-lbl">Apps</span>
                                        </div>
                                        <div className="gc-tile__progress">
                                            <div className="gc-tile__progress-track">
                                                <div className="gc-tile__progress-fill" style={{ width: `${tmpl.stats.blockRate}%` }} />
                                            </div>
                                            <span className="gc-tile__progress-label">{tmpl.stats.blockRate}%</span>
                                        </div>
                                    </div>
                                    <div className="gc-tile__footer">
                                        <span>{I.checkCircle} {tmpl.stats.lastTriggered}</span>
                                        <span>Admin</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* ═══════════════════════════════════
               CONFIG DRAWER — slides from right
               ═══════════════════════════════════ */}
            <div className={`gc-config-drawer ${configDrawerOpen ? 'gc-config-drawer--open' : ''}`}>
                {/* Header */}
                <div className="gc-drawer-header">
                    <div className="gc-drawer-header-icon">{I.shield}</div>
                    <div style={{ flex: 1 }}>
                        <div className="gc-drawer-title">{drawerTab === 'template' ? (editingTemplate?.id ? 'Edit Guardrail' : 'Create Guardrail') : (editingPolicy?.id ? 'Edit Policy' : 'Create Policy')}</div>
                        <div className="gc-drawer-desc">Configure guardrail settings and policies</div>
                    </div>
                    <button className="gc-drawer-close" onClick={closeConfigDrawer}>{I.x}</button>
                </div>

                {/* Tabs */}
                <div className="gc-drawer-tabs">
                    <button className={`gc-drawer-tab ${drawerTab === 'template' ? 'gc-drawer-tab--active' : ''}`} onClick={() => { setDrawerTab('template'); if (!editingTemplate) setEditingTemplate({ name: '', description: '', category: 'custom', policies: [], docs: [], enforcement: 'Block Request', status: 'active' }); }}>
                        {I.layers} Template
                    </button>
                    <button className={`gc-drawer-tab ${drawerTab === 'policy' ? 'gc-drawer-tab--active' : ''}`} onClick={() => { setDrawerTab('policy'); if (!editingPolicy) setEditingPolicy({ name: '', type: 'Content Rule', action: 'Block' }); }}>
                        {I.shield} Policy
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="gc-drawer-body">
                    {/* ── Template Form ── */}
                    {drawerTab === 'template' && editingTemplate && (
                        <>
                            <div className="gc-drawer-section">
                                <div className="gc-drawer-section-label">Basic Information</div>
                                <label className="gc-form-row">
                                    <span className="gc-label">Guardrail Name</span>
                                    <input className="gc-input" placeholder="e.g. PII Detection & Redaction" value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} />
                                </label>
                                <label className="gc-form-row">
                                    <span className="gc-label">Description</span>
                                    <textarea className="gc-textarea gc-textarea--form" placeholder="Describe what this guardrail does..." value={editingTemplate.description} onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })} />
                                </label>
                                <label className="gc-form-row">
                                    <span className="gc-label">Enforcement Type</span>
                                    <select className="gc-input" value={editingTemplate.enforcement} onChange={e => setEditingTemplate({ ...editingTemplate, enforcement: e.target.value })}>
                                        {ENFORCEMENT_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
                                    </select>
                                </label>
                            </div>

                            <div className="gc-drawer-section">
                                <div className="gc-drawer-section-label">Attach Policies</div>
                                <div className="gc-drawer-policy-list">
                                    {policies.map(p => (
                                        <label key={p.id} className={`gc-drawer-policy ${editingTemplate.policies.includes(p.id) ? 'gc-drawer-policy--active' : ''}`}>
                                            <input type="checkbox" checked={editingTemplate.policies.includes(p.id)} onChange={(e) => {
                                                const np = e.target.checked ? [...editingTemplate.policies, p.id] : editingTemplate.policies.filter(x => x !== p.id);
                                                setEditingTemplate({ ...editingTemplate, policies: np });
                                            }} />
                                            <div className="gc-drawer-policy-info">
                                                <span className="gc-drawer-policy-name">{p.name}</span>
                                                <span className="gc-drawer-policy-type">{p.type}</span>
                                            </div>
                                            <span className={`gc-drawer-policy-badge gc-drawer-policy-badge--${p.action.toLowerCase()}`}>{p.action}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="gc-drawer-section">
                                <div className="gc-drawer-section-label">Document Screening</div>
                                <div className="gc-drawer-docs-grid">
                                    {DOC_TYPES.map(doc => (
                                        <label key={doc} className={`gc-drawer-doc ${editingTemplate.docs.includes(doc) ? 'gc-drawer-doc--active' : ''}`}>
                                            <input type="checkbox" checked={editingTemplate.docs.includes(doc)} onChange={(e) => {
                                                const nd = e.target.checked ? [...editingTemplate.docs, doc] : editingTemplate.docs.filter(x => x !== doc);
                                                setEditingTemplate({ ...editingTemplate, docs: nd });
                                            }} />
                                            <span>{I.file} {doc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Policy Form ── */}
                    {drawerTab === 'policy' && editingPolicy && (
                        <div className="gc-drawer-section">
                            <div className="gc-drawer-section-label">Policy Configuration</div>
                            <label className="gc-form-row">
                                <span className="gc-label">Policy Name</span>
                                <input className="gc-input" placeholder="e.g. Block Toxic Content" value={editingPolicy.name} onChange={e => setEditingPolicy({ ...editingPolicy, name: e.target.value })} />
                            </label>
                            <label className="gc-form-row">
                                <span className="gc-label">Type</span>
                                <select className="gc-input" value={editingPolicy.type} onChange={e => setEditingPolicy({ ...editingPolicy, type: e.target.value })}>
                                    <option>Content Rule</option>
                                    <option>Data Protection (SDP)</option>
                                    <option>Security Detection</option>
                                </select>
                            </label>
                            <label className="gc-form-row">
                                <span className="gc-label">Action</span>
                                <select className="gc-input" value={editingPolicy.action} onChange={e => setEditingPolicy({ ...editingPolicy, action: e.target.value })}>
                                    <option>Block</option>
                                    <option>Mask</option>
                                    <option>Audit</option>
                                </select>
                            </label>

                            {/* Existing policies list */}
                            <div className="gc-drawer-section-label" style={{ marginTop: 24 }}>Existing Policies</div>
                            <div className="gc-drawer-policy-list">
                                {policies.map(p => (
                                    <div key={p.id} className="gc-drawer-policy" style={{ cursor: 'default' }}>
                                        <div className="gc-drawer-policy-info">
                                            <span className="gc-drawer-policy-name">{p.name}</span>
                                            <span className="gc-drawer-policy-type">{p.type}</span>
                                        </div>
                                        <span className={`gc-drawer-policy-badge gc-drawer-policy-badge--${p.action.toLowerCase()}`}>{p.action}</span>
                                        <button className="gc-icon-btn" onClick={() => openEditPolicy(p)} style={{ marginLeft: 4 }}>{I.edit}</button>
                                        <button className="gc-icon-btn gc-icon-btn--danger" onClick={() => deletePolicy(p.id)}>{I.trash}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="gc-drawer-footer">
                    <button className="gc-btn" onClick={closeConfigDrawer}>Cancel</button>
                    <button className="gc-btn gc-btn--primary" onClick={drawerTab === 'template' ? saveTemplate : savePolicy}>
                        {I.check} {drawerTab === 'template' ? 'Save Guardrail' : 'Save Policy'}
                    </button>
                </div>
            </div>

            {/* ═══ CHATBOT DRAWER ═══ */}
            <div className={`gc-chat-drawer ${chatMenuOpen ? 'gc-chat-drawer--open' : ''}`}>
                <div className="gc-chat-header">
                    {I.activity}
                    <div><div className="gc-chat-title">Simulate Execution</div><div className="gc-chat-desc">Test payload against template filters.</div></div>
                    <button className="gc-chat-close" onClick={() => setChatMenuOpen(false)}>{I.x}</button>
                </div>
                <div className="gc-chat-header" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', padding: '12px 24px' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Target Config:</span>
                    <select className="gc-input" style={{ marginLeft: 'auto', width: 'auto', padding: '4px 8px' }} value={activeTestTemplate} onChange={e => setActiveTestTemplate(e.target.value)}>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="gc-chat-body">
                    {chatMessages.map(m => (
                        <div key={m.id} className={`gc-msg gc-msg--${m.sender}`}>
                            <div className={`gc-bubble ${m.violated ? 'gc-bubble--violation' : ''} ${m.redacted ? 'gc-bubble--redact' : ''}`}>
                                {m.text}
                                {m.file && <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>File: {m.file}</div>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="gc-chat-input">
                    <button className="gc-icon-btn" title="Simulate File" onClick={() => setChatFile('dummy_user_data.pdf')} style={{ position: 'relative' }}>
                        {I.file}
                        {chatFile && <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />}
                    </button>
                    <textarea className="gc-textarea" placeholder="Type prompt to test..." value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendTestMessage(); } }} />
                    <button className="gc-btn gc-btn--accent" style={{ padding: 0, width: 48, height: 48 }} onClick={handleSendTestMessage}>{I.send}</button>
                </div>
            </div>
        </div>
    );
}
