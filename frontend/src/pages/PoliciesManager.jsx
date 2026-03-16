import React, { useState } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../styles/policies-manager.css'

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
    eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
}

/* ═══════════════════════════════════
   Sidebar (shared with guardrails)
   ═══════════════════════════════════ */


/* ═══════════════════════════════════
   Constants
   ═══════════════════════════════════ */
const CATEGORIES = [
    { id: 'all', label: 'All Policies' },
    { id: 'content-safety', label: 'Content Safety', color: '#f472b6' },
    { id: 'data-privacy', label: 'Data Privacy', color: '#818cf8' },
    { id: 'security', label: 'Security', color: '#fb923c' },
    { id: 'custom', label: 'Custom', color: '#34d399' },
]

const DETECTORS = [
    { id: 'llamaguard', name: 'LlamaGuard', desc: "Meta's safety classifier for LLM outputs", icon: '🦙' },
    { id: 'regex', name: 'Regex Engine', desc: 'Pattern-matching rules for custom detections', icon: '⚙️' },
    { id: 'gptoss', name: 'GPToss', desc: 'OpenAI-based content safety detector', icon: '🤖' },
    { id: 'presidio', name: 'Microsoft Presidio', desc: 'PII detection and anonymization engine', icon: '🔐' },
    { id: 'googledlp', name: 'Google DLP', desc: 'Cloud DLP for sensitive data detection', icon: '☁️' },
    { id: 'customregex', name: 'Custom Regex', desc: 'User-defined regex patterns', icon: '📝' },
]

const DEIDENTIFY_METHODS = [
    { id: 'bucket', name: 'Bucket Values', desc: 'Group numeric values into ranges' },
    { id: 'dateshift', name: 'Date Shift', desc: 'Shift dates by random interval' },
    { id: 'extracttime', name: 'Extract Time Data', desc: 'Strip date components' },
    { id: 'mask', name: 'Mask with Character', desc: 'Replace with *** or custom char' },
    { id: 'redact', name: 'Redact', desc: 'Remove sensitive content entirely' },
    { id: 'replace', name: 'Replace with Dictionary', desc: 'Swap with predefined substitution values' },
    { id: 'tokenize', name: 'Tokenize', desc: 'Format-preserving reversible token' },
    { id: 'hash', name: 'Hash', desc: 'Replace with cryptographic hash' },
]

const ENTITY_TYPES = [
    { id: 'ssn', name: 'SSN', icon: '🆔' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'phone', name: 'Phone Number', icon: '📱' },
    { id: 'credit_card', name: 'Credit Card', icon: '💳' },
    { id: 'address', name: 'Address', icon: '📍' },
    { id: 'ip_address', name: 'IP Address', icon: '🌐' },
    { id: 'date_of_birth', name: 'Date of Birth', icon: '📅' },
    { id: 'passport', name: 'Passport No.', icon: '🛂' },
    { id: 'medical_id', name: 'Medical Record', icon: '🏥' },
    { id: 'bank_account', name: 'Bank Account', icon: '🏦' },
    { id: 'drivers_license', name: "Driver's License", icon: '🪪' },
    { id: 'api_key', name: 'API Key / Secret', icon: '🔑' },
]

const INITIAL_POLICIES = [
    { id: 1, name: 'Block Toxic & Hate Speech', desc: 'Detects and blocks toxic language, hate speech, harassment, and harmful content in model I/O', category: 'content-safety', mode: 'inspect', status: 'active', detectors: { llamaguard: { enabled: true, weight: 40 }, gptoss: { enabled: true, weight: 35 }, regex: { enabled: true, weight: 25 } }, deidentifyMethod: null },
    { id: 2, name: 'PII Detection & Redaction', desc: 'Identifies and masks personally identifiable information like names, emails, SSNs, and phone numbers', category: 'data-privacy', mode: 'deidentify', status: 'active', detectors: { presidio: { enabled: true, weight: 50 }, googledlp: { enabled: true, weight: 30 }, regex: { enabled: true, weight: 20 } }, deidentifyMethod: 'mask' },
    { id: 3, name: 'Prompt Injection Defense', desc: 'Blocks malicious system prompt overrides and jailbreak attempts targeting the LLM', category: 'security', mode: 'inspect', status: 'active', detectors: { llamaguard: { enabled: true, weight: 45 }, gptoss: { enabled: true, weight: 35 }, customregex: { enabled: true, weight: 20 } }, deidentifyMethod: null },
    { id: 4, name: 'Credit Card Masking', desc: 'Detects credit card numbers in all formats and replaces them with masked versions', category: 'data-privacy', mode: 'deidentify', status: 'active', detectors: { presidio: { enabled: true, weight: 60 }, regex: { enabled: true, weight: 40 } }, deidentifyMethod: 'mask' },
    { id: 5, name: 'Malicious URI Filter', desc: 'Scans and blocks known phishing, malware, and suspicious URLs in prompts and responses', category: 'security', mode: 'inspect', status: 'active', detectors: { regex: { enabled: true, weight: 50 }, customregex: { enabled: true, weight: 30 }, googledlp: { enabled: true, weight: 20 } }, deidentifyMethod: null },
    { id: 6, name: 'Custom Profanity Filter', desc: 'Filters custom list of restricted words and phrases specific to your organization', category: 'custom', mode: 'inspect', status: 'draft', detectors: { regex: { enabled: true, weight: 70 }, customregex: { enabled: true, weight: 30 } }, deidentifyMethod: null },
]

/* ═══════════════════════════════════
   Component
   ═══════════════════════════════════ */
export default function PoliciesManager({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const [policies, setPolicies] = useState(INITIAL_POLICIES)
    const [activeFilter, setActiveFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)

    // drawer form state
    const [formName, setFormName] = useState('')
    const [formDesc, setFormDesc] = useState('')
    const [formCategory, setFormCategory] = useState('content-safety')
    const [formMode, setFormMode] = useState('inspect')
    const [formDeidentifyMethod, setFormDeidentifyMethod] = useState('mask')
    const [formDetectors, setFormDetectors] = useState(() => {
        const d = {}
        DETECTORS.forEach(det => { d[det.id] = { enabled: false, weight: 0 } })
        return d
    })

    // detection rules state
    const [formKeywords, setFormKeywords] = useState('')
    const [formRegexPatterns, setFormRegexPatterns] = useState([{ pattern: '', label: '' }])
    const [formEntities, setFormEntities] = useState([])
    const [formPromptRule, setFormPromptRule] = useState('')

    // test panel state
    const [testInput, setTestInput] = useState('')
    const [testResults, setTestResults] = useState(null)
    const [testRunning, setTestRunning] = useState(false)

    const resetForm = () => {
        setFormName(''); setFormDesc(''); setFormCategory('content-safety')
        setFormMode('inspect'); setFormDeidentifyMethod('mask')
        const d = {}
        DETECTORS.forEach(det => { d[det.id] = { enabled: false, weight: 0 } })
        setFormDetectors(d)
        setFormKeywords(''); setFormRegexPatterns([{ pattern: '', label: '' }])
        setFormEntities([]); setFormPromptRule('')
        setTestInput(''); setTestResults(null)
        setEditingPolicy(null)
    }

    const openCreate = () => { resetForm(); setDrawerOpen(true) }

    const openEdit = (pol) => {
        setEditingPolicy(pol)
        setFormName(pol.name); setFormDesc(pol.desc); setFormCategory(pol.category)
        setFormMode(pol.mode); setFormDeidentifyMethod(pol.deidentifyMethod || 'mask')
        const d = {}
        DETECTORS.forEach(det => { d[det.id] = pol.detectors[det.id] || { enabled: false, weight: 0 } })
        setFormDetectors(d)
        setDrawerOpen(true)
    }

    const closeDrawer = () => { setDrawerOpen(false); resetForm() }

    const toggleDetector = (id) => {
        setFormDetectors(prev => ({ ...prev, [id]: { ...prev[id], enabled: !prev[id].enabled, weight: !prev[id].enabled ? 25 : 0 } }))
    }

    const setDetectorWeight = (id, w) => {
        setFormDetectors(prev => ({ ...prev, [id]: { ...prev[id], weight: Math.max(0, Math.min(100, Number(w))) } }))
    }

    // regex pattern helpers
    const addRegexPattern = () => setFormRegexPatterns(prev => [...prev, { pattern: '', label: '' }])
    const updateRegexPattern = (i, field, val) => setFormRegexPatterns(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
    const removeRegexPattern = (i) => setFormRegexPatterns(prev => prev.filter((_, idx) => idx !== i))

    // entity toggle
    const toggleEntity = (id) => setFormEntities(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])

    // test simulation
    const runTest = () => {
        if (!testInput.trim()) return
        setTestRunning(true); setTestResults(null)
        setTimeout(() => {
            const keywords = formKeywords.split('\n').filter(k => k.trim())
            const foundKeywords = keywords.filter(k => testInput.toLowerCase().includes(k.trim().toLowerCase()))
            const matchedRegex = formRegexPatterns.filter(r => r.pattern && (() => { try { return new RegExp(r.pattern, 'gi').test(testInput) } catch { return false } })())
            const detectedEntities = formEntities.filter(() => Math.random() > 0.4)
            const overallScore = Math.min(100, (foundKeywords.length * 25 + matchedRegex.length * 30 + detectedEntities.length * 15 + (formPromptRule ? 20 : 0)))
            setTestResults({ score: overallScore, foundKeywords, matchedRegex, detectedEntities, promptMatch: formPromptRule ? Math.random() > 0.3 : false })
            setTestRunning(false)
        }, 800)
    }

    const savePolicy = () => {
        const data = { name: formName, desc: formDesc, category: formCategory, mode: formMode, status: 'active', detectors: formDetectors, deidentifyMethod: formMode === 'deidentify' ? formDeidentifyMethod : null }
        if (editingPolicy) {
            setPolicies(prev => prev.map(p => p.id === editingPolicy.id ? { ...p, ...data } : p))
        } else {
            setPolicies(prev => [...prev, { ...data, id: Date.now() }])
        }
        closeDrawer()
    }

    const deletePolicy = (id) => setPolicies(prev => prev.filter(p => p.id !== id))
    const togglePolicyStatus = (id) => setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'disabled' : 'active' } : p))

    const filtered = policies.filter(p => {
        if (activeFilter !== 'all' && p.category !== activeFilter) return false
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const catColor = (cat) => CATEGORIES.find(c => c.id === cat)?.color || '#4E8EFF'
    const enabledDetectorCount = Object.values(formDetectors).filter(d => d.enabled).length
    const totalWeight = Object.values(formDetectors).filter(d => d.enabled).reduce((sum, d) => sum + d.weight, 0)

    return (
        <div className="dash" data-theme={theme}>
            {/* ══ Sidebar ══ */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* ══ Content ══ */}
            <div className="dash__content">
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="GenAI Studio Platform" />

                <main className="dash__main">
                    {/* Page Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="dash__page-title">Policies</h1>
                            <p className="dash__page-subtitle">Create and manage individual detection policies with detectors and weights</p>
                        </div>
                        <button className="pm-btn pm-btn--primary" onClick={openCreate}>{I.plus} Create Policy</button>
                    </div>

                    {/* KPI */}
                    <div className="dash__metrics">
                        <div className="mcard" style={{ '--mc': '#4E8EFF', '--mc-rgb': '78, 142, 255' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.shield}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{policies.length}</div><div className="mcard__label">Total Policies</div></div></div>
                        <div className="mcard" style={{ '--mc': '#34D399', '--mc-rgb': '52, 211, 153' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.checkCircle}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{policies.filter(p => p.status === 'active').length}</div><div className="mcard__label">Active Policies</div></div></div>
                        <div className="mcard" style={{ '--mc': '#FBBF24', '--mc-rgb': '251, 191, 36' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.bolt}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{new Set(policies.flatMap(p => Object.entries(p.detectors).filter(([, v]) => v.enabled).map(([k]) => k))).size}</div><div className="mcard__label">Active Detectors</div></div></div>
                        <div className="mcard" style={{ '--mc': '#f87171', '--mc-rgb': '248, 113, 113' }}><div className="mcard__top"><div className="mcard__icon-ring">{I.alertTri}</div></div><div style={{ marginTop: 'auto' }}><div className="mcard__value">{CATEGORIES.length - 1}</div><div className="mcard__label">Categories</div></div></div>
                    </div>

                    {/* Filter Row */}
                    <div className="pm-filters-row">
                        {CATEGORIES.map(cat => (
                            <button key={cat.id} className={`pm-filter-tab ${activeFilter === cat.id ? 'pm-filter-tab--active' : ''}`} onClick={() => setActiveFilter(cat.id)} style={cat.color ? { '--fc': cat.color } : {}}>
                                {cat.label} ({cat.id === 'all' ? policies.length : policies.filter(p => p.category === cat.id).length})
                            </button>
                        ))}
                        <div className="pm-search-wrap">
                            {I.search}
                            <input className="pm-search-input" placeholder="Search policies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    {/* Policy Cards */}
                    <div className="pm-card-grid">
                        {filtered.map(pol => (
                            <div className={`pm-card ${pol.status === 'disabled' ? 'pm-card--disabled' : ''}`} key={pol.id} style={{ '--card-accent': catColor(pol.category) }}>
                                <div className="pm-card__header">
                                    <div className="pm-card__title-row">
                                        <span className="pm-card__icon">{I.shield}</span>
                                        <h3 className="pm-card__name">{pol.name}</h3>
                                        <span className={`pm-card__status pm-card__status--${pol.status}`}>{pol.status}</span>
                                    </div>
                                    <div className="pm-card__actions">
                                        <label className="pm-toggle pm-toggle--card" title={pol.status === 'active' ? 'Disable policy' : 'Enable policy'}>
                                            <input type="checkbox" checked={pol.status === 'active'} onChange={() => togglePolicyStatus(pol.id)} />
                                            <span className="pm-toggle__slider" />
                                        </label>
                                        <button className="gc-icon-btn" onClick={() => openEdit(pol)}>{I.edit}</button>
                                        <button className="gc-icon-btn gc-icon-btn--danger" onClick={() => deletePolicy(pol.id)}>{I.trash}</button>
                                    </div>
                                </div>
                                <p className="pm-card__desc">{pol.desc}</p>
                                <div className="pm-card__meta-row">
                                    <span className="pm-card__cat-tag" style={{ '--tag-c': catColor(pol.category) }}>{CATEGORIES.find(c => c.id === pol.category)?.label}</span>
                                    <span className={`pm-card__mode-badge pm-card__mode-badge--${pol.mode}`}>
                                        {pol.mode === 'inspect' ? I.eye : I.eyeOff} {pol.mode}
                                    </span>
                                    {pol.deidentifyMethod && <span className="pm-card__deid-badge">{pol.deidentifyMethod}</span>}
                                </div>
                                <div className="pm-card__detectors">
                                    <span className="pm-card__det-label">Detectors</span>
                                    <div className="pm-card__det-list">
                                        {Object.entries(pol.detectors).filter(([, v]) => v.enabled).map(([k, v]) => {
                                            const det = DETECTORS.find(d => d.id === k)
                                            return det ? (
                                                <div className="pm-card__det-chip" key={k}>
                                                    <span className="pm-card__det-emoji">{det.icon}</span>
                                                    <span className="pm-card__det-name">{det.name}</span>
                                                    <span className="pm-card__det-weight">{v.weight}%</span>
                                                </div>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* ══════ CREATE / EDIT DRAWER ══════ */}
            {drawerOpen && <div className="pm-overlay" onClick={closeDrawer} />}
            <div className={`pm-drawer ${drawerOpen ? 'pm-drawer--open' : ''}`}>
                <div className="pm-drawer__header">
                    <div className="pm-drawer__header-info">
                        <span className="pm-drawer__header-icon">{I.shield}</span>
                        <div>
                            <h2 className="pm-drawer__title">{editingPolicy ? 'Edit Policy' : 'Create Policy'}</h2>
                            <p className="pm-drawer__subtitle">Configure detection rules and detectors</p>
                        </div>
                    </div>
                    <button className="pm-drawer__close" onClick={closeDrawer}>{I.x}</button>
                </div>

                <div className="pm-drawer__body">
                    {/* Section: Basic Info */}
                    <div className="pm-drawer__section">
                        <h3 className="pm-drawer__section-title"><span className="pm-drawer__dot" />Basic Information</h3>
                        <div className="pm-form-row">
                            <label className="pm-label">Policy Name</label>
                            <input className="pm-input" placeholder="e.g. Block Toxic Content" value={formName} onChange={e => setFormName(e.target.value)} />
                        </div>
                        <div className="pm-form-row">
                            <label className="pm-label">Description</label>
                            <textarea className="pm-textarea" placeholder="Describe what this policy does..." value={formDesc} onChange={e => setFormDesc(e.target.value)} />
                        </div>
                        <div className="pm-form-row">
                            <label className="pm-label">Category</label>
                            <select className="pm-select" value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Section: Mode */}
                    <div className="pm-drawer__section">
                        <h3 className="pm-drawer__section-title"><span className="pm-drawer__dot" />Policy Mode</h3>
                        <div className="pm-mode-toggle">
                            <button className={`pm-mode-btn ${formMode === 'inspect' ? 'pm-mode-btn--active' : ''}`} onClick={() => setFormMode('inspect')}>
                                {I.eye} <span>Inspect</span>
                                <small>Detect & flag content</small>
                            </button>
                            <button className={`pm-mode-btn ${formMode === 'deidentify' ? 'pm-mode-btn--active' : ''}`} onClick={() => setFormMode('deidentify')}>
                                {I.eyeOff} <span>Deidentify</span>
                                <small>Transform sensitive data</small>
                            </button>
                        </div>

                        {formMode === 'deidentify' && (
                            <div className="pm-deid-methods">
                                <label className="pm-label" style={{ marginBottom: 10 }}>Deidentification Method</label>
                                <div className="pm-deid-grid">
                                    {DEIDENTIFY_METHODS.map(m => (
                                        <button key={m.id} className={`pm-deid-chip ${formDeidentifyMethod === m.id ? 'pm-deid-chip--active' : ''}`} onClick={() => setFormDeidentifyMethod(m.id)}>
                                            <span className="pm-deid-chip__name">{m.name}</span>
                                            <span className="pm-deid-chip__desc">{m.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section: Detectors */}
                    <div className="pm-drawer__section">
                        <h3 className="pm-drawer__section-title">
                            <span className="pm-drawer__dot" />Detector Models
                            <span className="pm-drawer__section-badge">{enabledDetectorCount} active</span>
                        </h3>
                        {totalWeight > 0 && totalWeight !== 100 && (
                            <div className={`pm-weight-warning ${totalWeight === 100 ? 'pm-weight-warning--ok' : ''}`}>
                                {totalWeight < 100 ? '⚠️' : '⚠️'} Total weight: {totalWeight}% — {totalWeight < 100 ? `${100 - totalWeight}% remaining` : `${totalWeight - 100}% over limit`}
                            </div>
                        )}
                        {totalWeight === 100 && enabledDetectorCount > 0 && (
                            <div className="pm-weight-warning pm-weight-warning--ok">✅ Total weight: 100% — perfectly balanced</div>
                        )}
                        <div className="pm-detector-list">
                            {DETECTORS.map(det => {
                                const d = formDetectors[det.id]
                                return (
                                    <div className={`pm-detector-card ${d.enabled ? 'pm-detector-card--active' : ''}`} key={det.id}>
                                        <div className="pm-detector-card__top">
                                            <span className="pm-detector-card__emoji">{det.icon}</span>
                                            <div className="pm-detector-card__info">
                                                <span className="pm-detector-card__name">{det.name}</span>
                                                <span className="pm-detector-card__desc">{det.desc}</span>
                                            </div>
                                            <label className="pm-toggle">
                                                <input type="checkbox" checked={d.enabled} onChange={() => toggleDetector(det.id)} />
                                                <span className="pm-toggle__slider" />
                                            </label>
                                        </div>
                                        {d.enabled && (
                                            <div className="pm-detector-card__weight">
                                                <label className="pm-label">Weight</label>
                                                <div className="pm-weight-input-row">
                                                    <input type="range" min="0" max="100" value={d.weight} onChange={e => setDetectorWeight(det.id, e.target.value)} className="pm-weight-slider" />
                                                    <div className="pm-weight-number">
                                                        <input type="number" min="0" max="100" value={d.weight} onChange={e => setDetectorWeight(det.id, e.target.value)} className="pm-weight-num-input" />
                                                        <span>%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Section: Detection Rules */}
                    <div className="pm-drawer__section">
                        <h3 className="pm-drawer__section-title"><span className="pm-drawer__dot" style={{ background: '#f59e0b' }} />Detection Rules</h3>

                        {/* Keywords / Blocklist */}
                        <div className="pm-rules-block">
                            <div className="pm-rules-block__header">
                                <span className="pm-rules-block__icon">📋</span>
                                <div><strong>Keywords / Blocklist</strong><small>One word or phrase per line</small></div>
                            </div>
                            <textarea className="pm-textarea" rows={4} placeholder={"toxic\nharmful\nviolence\nhateful content"} value={formKeywords} onChange={e => setFormKeywords(e.target.value)} />
                            {formKeywords.trim() && <span className="pm-rules-count">{formKeywords.split('\n').filter(k => k.trim()).length} keywords</span>}
                        </div>

                        {/* Regex Patterns */}
                        <div className="pm-rules-block">
                            <div className="pm-rules-block__header">
                                <span className="pm-rules-block__icon">⚙️</span>
                                <div><strong>Regex Patterns</strong><small>Add custom regex rules</small></div>
                            </div>
                            {formRegexPatterns.map((rp, i) => (
                                <div className="pm-regex-row" key={i}>
                                    <input className="pm-input" placeholder="Pattern e.g. \b\d{3}-\d{2}-\d{4}\b" value={rp.pattern} onChange={e => updateRegexPattern(i, 'pattern', e.target.value)} style={{ flex: 2 }} />
                                    <input className="pm-input" placeholder="Label" value={rp.label} onChange={e => updateRegexPattern(i, 'label', e.target.value)} style={{ flex: 1 }} />
                                    {formRegexPatterns.length > 1 && <button className="gc-icon-btn gc-icon-btn--danger" onClick={() => removeRegexPattern(i)}>{I.x}</button>}
                                </div>
                            ))}
                            <button className="pm-rules-add" onClick={addRegexPattern}>{I.plus} Add Pattern</button>
                        </div>

                        {/* Entity Types */}
                        <div className="pm-rules-block">
                            <div className="pm-rules-block__header">
                                <span className="pm-rules-block__icon">🔍</span>
                                <div><strong>Entity Types</strong><small>Select PII / sensitive entity types to detect</small></div>
                                {formEntities.length > 0 && <span className="pm-drawer__section-badge" style={{ marginLeft: 'auto' }}>{formEntities.length} selected</span>}
                            </div>
                            <div className="pm-entity-grid">
                                {ENTITY_TYPES.map(et => (
                                    <button key={et.id} className={`pm-entity-chip ${formEntities.includes(et.id) ? 'pm-entity-chip--active' : ''}`} onClick={() => toggleEntity(et.id)}>
                                        <span>{et.icon}</span> {et.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prompt-based Rule */}
                        <div className="pm-rules-block">
                            <div className="pm-rules-block__header">
                                <span className="pm-rules-block__icon">🧠</span>
                                <div><strong>Prompt-based Rule</strong><small>Natural language instruction for LLM detectors</small></div>
                            </div>
                            <textarea className="pm-textarea" rows={3} placeholder={'Detect and flag any content that:\n- Discusses competitor products by name\n- Contains financial advice or predictions\n- Reveals internal company strategies'} value={formPromptRule} onChange={e => setFormPromptRule(e.target.value)} />
                        </div>
                    </div>

                    {/* Section: Test & Validate */}
                    <div className="pm-drawer__section">
                        <h3 className="pm-drawer__section-title"><span className="pm-drawer__dot" style={{ background: '#34d399' }} />Test & Validate</h3>
                        <div className="pm-test-panel">
                            <textarea className="pm-textarea pm-test-input" rows={3} placeholder="Paste sample text to test this policy..." value={testInput} onChange={e => setTestInput(e.target.value)} />
                            <button className="pm-btn pm-btn--test" onClick={runTest} disabled={testRunning || !testInput.trim()}>
                                {testRunning ? '⏳ Running...' : '▶ Run Test'}
                            </button>
                            {testResults && (
                                <div className="pm-test-results">
                                    <div className="pm-test-score">
                                        <div className={`pm-test-score__value ${testResults.score >= 50 ? 'pm-test-score--danger' : 'pm-test-score--safe'}`}>
                                            {testResults.score}%
                                        </div>
                                        <span className="pm-test-score__label">Detection Confidence</span>
                                    </div>
                                    <div className="pm-test-details">
                                        {testResults.foundKeywords.length > 0 && (
                                            <div className="pm-test-detail">
                                                <span className="pm-test-detail__icon">📋</span>
                                                <span>Keywords matched: <strong>{testResults.foundKeywords.join(', ')}</strong></span>
                                            </div>
                                        )}
                                        {testResults.matchedRegex.length > 0 && (
                                            <div className="pm-test-detail">
                                                <span className="pm-test-detail__icon">⚙️</span>
                                                <span>Regex: <strong>{testResults.matchedRegex.length} pattern(s) matched</strong></span>
                                            </div>
                                        )}
                                        {testResults.detectedEntities.length > 0 && (
                                            <div className="pm-test-detail">
                                                <span className="pm-test-detail__icon">🔍</span>
                                                <span>Entities: <strong>{testResults.detectedEntities.map(id => ENTITY_TYPES.find(e => e.id === id)?.name).join(', ')}</strong></span>
                                            </div>
                                        )}
                                        {testResults.promptMatch && (
                                            <div className="pm-test-detail">
                                                <span className="pm-test-detail__icon">🧠</span>
                                                <span>Prompt rule: <strong>Match detected</strong></span>
                                            </div>
                                        )}
                                        {testResults.score === 0 && (
                                            <div className="pm-test-detail pm-test-detail--safe">
                                                <span className="pm-test-detail__icon">✅</span>
                                                <span>No violations detected — content appears safe</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pm-drawer__footer">
                    <button className="pm-btn pm-btn--ghost" onClick={closeDrawer}>Cancel</button>
                    <button className="pm-btn pm-btn--primary" onClick={savePolicy} disabled={!formName.trim()}>
                        {I.check} {editingPolicy ? 'Update Policy' : 'Save Policy'}
                    </button>
                </div>
            </div>
        </div>
    )
}
