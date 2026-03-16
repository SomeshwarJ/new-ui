import React, { useState, useEffect, useRef } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { MODEL_TYPES, MODEL_PROVIDERS } from '../constants'

/* ═══════════════════════════════════
   Inline SVG Icons
   ═══════════════════════════════════ */
const I = {
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    server: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    cpu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    archive: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    checkCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    menu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    chevLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
    chevRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
    search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    dots: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    lock: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    archiveBox: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /></svg>,
    xCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    alertTri: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
}

/* ═══════════════════════════════════
   Static config (no hardcoded model data)
   ═══════════════════════════════════ */
const statusMeta = {
    active: { label: 'Active', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
    pending: { label: 'Pending', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    testing: { label: 'Testing', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
    restricted: { label: 'Restricted', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
}

const FILTER_KEYS = ['all', 'active', 'pending', 'testing', 'restricted']
const FILTER_LABELS = { all: 'All Models', active: 'Active', pending: 'Pending Approval', testing: 'Testing', restricted: 'Restricted' }

const API = '/api/models'

/* ═══════════════════════════════════
   Drawer Constants
   ═══════════════════════════════════ */
const DRAWER_STEPS = ['Model Info', 'Hyperparameters', 'Payload Structure']

const FILE_FORMATS = ['pdf', 'txt', 'json', 'csv', 'xml', 'docx', 'yaml']

const defaultHyperparams = [
    { id: 1, label: 'max_tokens', type: 'Integer', min: '2048', max: '65535', default: '10000', optional: false },
    { id: 2, label: 'temperature', type: 'Float', min: '0.0', max: '1', default: '0.5', optional: false },
    { id: 3, label: 'top_p', type: 'Float', min: '0', max: '1', default: '0.95', optional: true },
]

const emptyForm = {
    modelId: '', modelName: '', provider: '', description: '', modelLink: '', modelType: '', propertyKey: '', maxTokens: '', retirementDate: '',
    inputPricing: '', outputPricing: '',
    togglePlayground: true, toggleBYA: false, toggleAPI: true,
    selectedFormats: ['pdf', 'json'],
}

/* ═══════════════════════════════════
   Sidebar Sections
   ═══════════════════════════════════ */


/* ═══════════════════════════════════
   Component
   ═══════════════════════════════════ */
export default function ModelOnboarding({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    /* ── Page state ── */
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [menuOpenId, setMenuOpenId] = useState(null)
    const [modal, setModal] = useState(null)   // { type: 'approve'|'reject'|'delete', model }
    const [toasts, setToasts] = useState([])
    const menuRef = useRef(null)

    /* ── API data state ── */
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    /* ── Drawer state ── */
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerStep, setDrawerStep] = useState(0)
    const [drawerMode, setDrawerMode] = useState('new')  // 'new' | 'edit' | 'view'
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ ...emptyForm })
    const [hyperparams, setHyperparams] = useState(defaultHyperparams.map(h => ({ ...h })))
    const [payload, setPayload] = useState('')
    const [formErrors, setFormErrors] = useState({})

    /* ── Close menu on outside click ── */
    useEffect(() => {
        const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    /* ╔═══════════════════════════════════╗
       ║  API helpers                      ║
       ╚═══════════════════════════════════╝ */
    const fetchModels = async () => {
        try {
            setLoading(true)
            const res = await fetch(API)
            if (!res.ok) throw new Error('fetch failed')
            setModels(await res.json())
        } catch {
            addToast('Could not reach backend — start json-server with npm run server', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchModels() }, [])  // eslint-disable-line

    /* ── Add toasts ── */
    const addToast = (msg, type = 'success') => {
        const id = Date.now()
        setToasts(t => [...t, { id, msg, type }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
    }

    /* ── Filter + search (computed) ── */
    const filtered = models.filter(m => {
        if (activeFilter !== 'all' && m.status !== activeFilter) return false
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            return m.name.toLowerCase().includes(q) || (m.provider || m.vendor).toLowerCase().includes(q) || m.type.toLowerCase().includes(q)
        }
        return true
    })

    /* Dynamic filter counts */
    const filterCounts = FILTER_KEYS.reduce((acc, k) => {
        acc[k] = k === 'all' ? models.length : models.filter(m => m.status === k).length
        return acc
    }, {})

    /* ── Form helpers ── */
    const setField = (key, val) => {
        setForm(f => ({ ...f, [key]: val }))
        if (formErrors[key]) setFormErrors(e => { const n = { ...e }; delete n[key]; return n })
    }

    const toggleFormat = fmt => {
        setForm(f => ({
            ...f,
            selectedFormats: f.selectedFormats.includes(fmt)
                ? f.selectedFormats.filter(x => x !== fmt)
                : [...f.selectedFormats, fmt],
        }))
    }

    /* ── Drawer open (new) ── */
    const openDrawer = () => {
        setEditId(null)
        setDrawerMode('new')
        setForm({ ...emptyForm })
        setHyperparams(defaultHyperparams.map(h => ({ ...h })))
        setPayload('')
        setFormErrors({})
        setDrawerStep(0)
        setDrawerOpen(true)
    }

    /* ── Drawer open (edit) ── */
    const openEditDrawer = m => {
        setEditId(m.id)
        setDrawerMode('edit')
        setForm({
            modelId: m.modelId || '',
            modelName: m.name || '',
            provider: m.provider || '',
            description: m.description || '',
            modelLink: m.modelLink || '',
            modelType: m.type || '',
            propertyKey: m.propertyKey || '',
            maxTokens: m.maxTokens || '',
            retirementDate: m.retirementDate || '',
            inputPricing: m.inputPricing || '',
            outputPricing: m.outputPricing || '',
            togglePlayground: m.togglePlayground ?? true,
            toggleBYA: m.toggleBYA ?? false,
            toggleAPI: m.toggleAPI ?? true,
            selectedFormats: m.selectedFormats || ['pdf', 'json'],
        })
        setHyperparams((m.hyperparams || defaultHyperparams).map(h => ({ ...h })))
        setPayload(m.payload || '')
        setFormErrors({})
        setDrawerStep(0)
        setMenuOpenId(null)
        setDrawerOpen(true)
    }

    /* ── Drawer open (view — read-only) ── */
    const openViewDrawer = m => {
        setEditId(null)
        setDrawerMode('view')
        setForm({
            modelId: m.modelId || '',
            modelName: m.name || '',
            provider: m.provider || '',
            description: m.description || '',
            modelLink: m.modelLink || '',
            modelType: m.type || '',
            propertyKey: m.propertyKey || '',
            maxTokens: m.maxTokens || '',
            retirementDate: m.retirementDate || '',
            inputPricing: m.inputPricing || '',
            outputPricing: m.outputPricing || '',
            togglePlayground: m.togglePlayground ?? true,
            toggleBYA: m.toggleBYA ?? false,
            toggleAPI: m.toggleAPI ?? true,
            selectedFormats: m.selectedFormats || ['pdf', 'json'],
        })
        setHyperparams((m.hyperparams || defaultHyperparams).map(h => ({ ...h })))
        setPayload(m.payload || '')
        setFormErrors({})
        setDrawerStep(0)
        setMenuOpenId(null)
        setDrawerOpen(true)
    }

    const isViewMode = drawerMode === 'view'

    /* ── Validation ── */
    const validateStep1 = () => {
        const errs = {}
        if (!form.modelId.trim()) errs.modelId = true
        if (!form.modelName.trim()) errs.modelName = true
        if (!form.provider) errs.provider = true
        if (!form.modelType) errs.modelType = true
        if (!form.modelLink.trim()) errs.modelLink = true
        setFormErrors(errs)
        return Object.keys(errs).length === 0
    }

    const goNext = () => {
        if (drawerStep === 0 && !validateStep1()) return
        setDrawerStep(s => Math.min(s + 1, 2))
    }
    const goBack = () => setDrawerStep(s => Math.max(s - 1, 0))

    /* ╔═══════════════════════════════════╗
       ║  CRUD actions                     ║
       ╚═══════════════════════════════════╝ */

    /* ── Submit (add or edit) ── */
    const submitModel = async () => {
        setSaving(true)

        // For edit: grab the current model from state to preserve server-managed fields
        const existing = editId ? models.find(m => String(m.id) === String(editId)) : null

        const formFields = {
            name: form.modelName,
            modelId: form.modelId,
            provider: form.provider,
            description: form.description,
            modelLink: form.modelLink,
            type: form.modelType,
            propertyKey: form.propertyKey,
            maxTokens: form.maxTokens,
            retirementDate: form.retirementDate,
            inputPricing: form.inputPricing,
            outputPricing: form.outputPricing,
            togglePlayground: form.togglePlayground,
            toggleBYA: form.toggleBYA,
            toggleAPI: form.toggleAPI,
            selectedFormats: form.selectedFormats,
            hyperparams,
            payload,
        }

        const body = editId
            ? { ...existing, ...formFields, id: editId }   // PUT: merge with existing record
            : {                                             // POST: new defaults
                ...formFields,
                status: 'pending',
                vendor: '—',
                version: 'v1.0',
                contextWindow: '—',
                costPer1M: '—',
                latency: '—',
                usage: '—',
                tags: [],
                note: null,
            }

        try {
            const res = await fetch(
                editId ? `${API}/${editId}` : API,
                {
                    method: editId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const saved = await res.json()
            setModels(prev => editId
                ? prev.map(m => String(m.id) === String(editId) ? saved : m)
                : [...prev, saved]
            )
            setDrawerOpen(false)
            addToast(editId ? `"${form.modelName}" updated.` : 'Model submitted for review.')
            setEditId(null)
        } catch (e) {
            addToast(`Save failed — ${e.message || 'is json-server running?'}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    /* ── Approve ── */
    const approveModel = async m => {
        setModal(null)
        try {
            const res = await fetch(`${API}/${m.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active', note: `Approved by Admin · ${new Date().toISOString().slice(0, 10)}` }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const updated = await res.json()
            setModels(prev => prev.map(x => String(x.id) === String(m.id) ? updated : x))
            addToast(`"${m.name}" approved successfully.`)
        } catch (e) { addToast(`Approve failed — ${e.message}`, 'error') }
    }

    /* ── Reject ── */
    const rejectModel = async m => {
        setModal(null)
        try {
            const res = await fetch(`${API}/${m.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'restricted', note: 'Rejected — requires re-submission.' }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const updated = await res.json()
            setModels(prev => prev.map(x => String(x.id) === String(m.id) ? updated : x))
            addToast(`"${m.name}" rejected.`, 'error')
        } catch (e) { addToast(`Reject failed — ${e.message}`, 'error') }
    }

    /* ── Archive ── */
    const archiveModel = async m => {
        setMenuOpenId(null)
        try {
            const res = await fetch(`${API}/${m.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'restricted', note: `Archived by Admin · ${new Date().toISOString().slice(0, 10)}` }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const updated = await res.json()
            setModels(prev => prev.map(x => String(x.id) === String(m.id) ? updated : x))
            addToast(`"${m.name}" archived.`)
        } catch (e) { addToast(`Archive failed — ${e.message}`, 'error') }
    }

    /* ── Delete ── */
    const deleteModel = async m => {
        setModal(null)
        try {
            const res = await fetch(`${API}/${m.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            setModels(prev => prev.filter(x => String(x.id) !== String(m.id)))
            addToast(`"${m.name}" removed.`, 'error')
        } catch (e) { addToast(`Delete failed — ${e.message}`, 'error') }
    }

    /* ── Hyperparameter helpers ── */
    const addParam = () => {
        setHyperparams(h => [...h, { id: Date.now(), label: '', type: 'Integer', min: '', max: '', default: '', optional: false }])
    }

    const updateParam = (id, key, val) => {
        setHyperparams(h => h.map(p => p.id === id ? { ...p, [key]: val } : p))
    }

    const removeParam = (id) => {
        setHyperparams(h => h.filter(p => p.id !== id))
    }

    const hasStep1Errors = Object.keys(formErrors).length > 0

    return (
        <div className="dash">
            {/* ══ Sidebar ══ */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* ══ Content Area ══ */}
            <div className="dash__content">
                {/* ── Top Bar ── */}
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="GenAI Studio Platform" />

                {/* ── Page Body ── */}
                <main className="mo2">
                    {/* ══ Hero Banner ══ */}
                    <div className="mo2__hero">
                        <div className="mo2__hero-bg" />
                        <div className="mo2__hero-content">
                            <div className="mo2__hero-left">
                                <h1 className="mo2__hero-title">Model Onboarding</h1>
                                <p className="mo2__hero-sub">Register, configure and approve AI models for platform-wide use.</p>
                            </div>
                            <div className="mo2__hero-right">
                                <div className="mo2__kpi-row">
                                    <div className="mo2__kpi"><span className="mo2__kpi-val">6</span><span className="mo2__kpi-lbl">Total</span></div>
                                    <div className="mo2__kpi-sep" />
                                    <div className="mo2__kpi mo2__kpi--green"><span className="mo2__kpi-val">3</span><span className="mo2__kpi-lbl">Active</span></div>
                                    <div className="mo2__kpi-sep" />
                                    <div className="mo2__kpi mo2__kpi--amber"><span className="mo2__kpi-val">1</span><span className="mo2__kpi-lbl">Pending</span></div>
                                    <div className="mo2__kpi-sep" />
                                    <div className="mo2__kpi mo2__kpi--purple"><span className="mo2__kpi-val">13.3M</span><span className="mo2__kpi-lbl">Tokens Used</span></div>
                                </div>
                                <button className="mo2__cta" onClick={openDrawer}>{I.plus} Onboard New Model</button>
                            </div>
                        </div>
                    </div>

                    {/* ══ Search + Filter Bar ══ */}
                    <div className="mo2__bar">
                        <div className="mo2__search-box">
                            {I.search}
                            <input type="text" placeholder="Search by name, vendor, or type..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        {/* Filter tabs — dynamic counts */}
                        <div className="mo2__filter-bar">
                            {FILTER_KEYS.map(k => (
                                <button
                                    key={k}
                                    className={`mo2__filter-tab ${activeFilter === k ? 'mo2__filter-tab--active' : ''}`}
                                    onClick={() => setActiveFilter(k)}
                                >
                                    {FILTER_LABELS[k]}
                                    <span className="mo2__filter-count">{filterCounts[k]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ══ Model List ══ */}
                    <div className="mo2__list">
                        {/* Column header row */}
                        <div className="ml__header">
                            <span className="ml__col ml__col--name">Model</span>
                            <span className="ml__col ml__col--type">Type</span>
                            <span className="ml__col ml__col--ctx">Context</span>
                            <span className="ml__col ml__col--cost">Cost / 1M</span>
                            <span className="ml__col ml__col--latency">Latency</span>
                            <span className="ml__col ml__col--usage">Usage</span>
                            <span className="ml__col ml__col--status">Status</span>
                            <span className="ml__col ml__col--actions" />
                        </div>

                        {filtered.map(m => {
                            const sm = statusMeta[m.status]
                            return (
                                <div key={m.id} className={`ml__row ${m.status === 'pending' ? 'ml__row--pending' : ''}`} style={{ '--sc': sm.color, '--sc-bg': sm.bg, '--sc-border': sm.border }}>
                                    {/* Status accent line */}
                                    <div className="ml__accent" />

                                    {/* Model name + vendor */}
                                    <div className="ml__col ml__col--name">
                                        <div className="ml__model-icon" style={{ background: sm.bg, color: sm.color }}>{m.name.charAt(0)}</div>
                                        <div className="ml__name-group">
                                            <span className="ml__name">{m.name}</span>
                                            <span className="ml__vendor">{(m.provider || m.vendor)} · {m.version}</span>
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <span className="ml__col ml__col--type">
                                        <span className="ml__type-badge">{m.type}</span>
                                    </span>

                                    {/* Specs */}
                                    <span className="ml__col ml__col--ctx">{m.contextWindow}</span>
                                    <span className="ml__col ml__col--cost">{m.costPer1M}</span>
                                    <span className="ml__col ml__col--latency">{m.latency}</span>
                                    <span className="ml__col ml__col--usage">{m.usage}</span>

                                    {/* Status badge */}
                                    <span className="ml__col ml__col--status">
                                        <span className="ml__status-badge" style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}>
                                            {m.status === 'restricted' && I.lock} {sm.label}
                                        </span>
                                    </span>

                                    {/* Actions */}
                                    <div className="ml__col ml__col--actions">
                                        {m.status === 'pending' ? (
                                            <>
                                                <button className="ml__action-btn ml__action-btn--approve" onClick={() => setModal({ type: 'approve', model: m })}>Approve</button>
                                                <button className="ml__action-btn ml__action-btn--reject" onClick={() => setModal({ type: 'reject', model: m })}>Reject</button>
                                            </>
                                        ) : (
                                            <button className="ml__action-btn ml__action-btn--view" onClick={() => openViewDrawer(m)}>{I.eye} View</button>
                                        )}
                                        <div className="mcard2__menu-wrap" ref={menuOpenId === m.id ? menuRef : undefined}>
                                            <button className="ml__action-btn ml__action-btn--dots" onClick={() => setMenuOpenId(menuOpenId === m.id ? null : m.id)}>{I.dots}</button>
                                            {menuOpenId === m.id && (
                                                <div className="mcard2__dropdown">
                                                    <button onClick={() => openViewDrawer(m)}>{I.eye} View Details</button>
                                                    <button onClick={() => openEditDrawer(m)}>{I.edit} Edit Metadata</button>
                                                    <button onClick={() => archiveModel(m)}>{I.archiveBox} Archive</button>
                                                    <button className="mcard2__dropdown-danger" onClick={() => { setMenuOpenId(null); setModal({ type: 'delete', model: m }) }}>{I.trash} Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filtered.length === 0 && <div className="mo2__empty">No models match your search or filter.</div>}
                    </div>
                </main>
            </div>

            {/* ═══════════════════════════════════════
               DRAWER — 3-Step Onboard New Model
               ═══════════════════════════════════════ */}
            {drawerOpen && <div className="drw-overlay" onClick={() => setDrawerOpen(false)} />}
            <aside className={`drw ${drawerOpen ? 'drw--open' : ''}`} role="dialog" aria-label={drawerMode === 'view' ? 'View Model' : drawerMode === 'edit' ? 'Edit Model' : 'Onboard New Model'}>
                {/* Teal left-edge glow */}
                <div className="drw__edge-glow" />

                {/* ── Sticky Header ── */}
                <div className="drw__header">
                    {/* Pill stepper */}
                    <div className="drw__stepper" role="tablist">
                        {DRAWER_STEPS.map((label, i) => (
                            <button
                                key={i}
                                role="tab"
                                aria-label={`Step ${i + 1} of 3: ${label}`}
                                aria-selected={i === drawerStep}
                                className={`drw__step-pill ${i === drawerStep ? 'drw__step-pill--active' : ''} ${i < drawerStep ? 'drw__step-pill--done' : ''}`}
                                onClick={() => { if (i < drawerStep) setDrawerStep(i) }}
                            >
                                <span className="drw__step-circle">{i < drawerStep ? '✓' : i + 1}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                    {/* Title + close */}
                    <div className="drw__title-row">
                        <div>
                            <h2 className="drw__title">
                                {drawerMode === 'view' && `View: ${form.modelName || 'Model'}`}
                                {drawerMode === 'edit' && `Edit: ${form.modelName || 'Model'}`}
                                {drawerMode === 'new' && DRAWER_STEPS[drawerStep]}
                            </h2>
                            <p className="drw__subtitle">
                                {drawerStep === 0 && drawerMode === 'view' && 'Read-only — model metadata from the registry.'}
                                {drawerStep === 0 && drawerMode === 'edit' && 'Update core metadata for this model.'}
                                {drawerStep === 0 && drawerMode === 'new' && 'Provide core metadata and configuration details for the new model.'}
                                {drawerStep === 1 && 'Runtime parameters for this model.'}
                                {drawerStep === 2 && 'Request / response payload structure.'}
                            </p>
                        </div>
                        <button className="drw__close" onClick={() => setDrawerOpen(false)} aria-label="Close drawer">{I.x}</button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className={`drw__body${isViewMode ? ' drw__body--readonly' : ''}`}>
                    {/* ════ STEP 1 — Model Info ════ */}
                    {drawerStep === 0 && (
                        <div className="drw__form drw__form--grid" key="step-0">
                            {/* Model ID */}
                            <label className={`drw__field ${formErrors.modelId ? 'drw__field--error' : ''}`}>
                                <span>Model ID <em>*</em></span>
                                <input type="text" placeholder="e.g. gemini-1.5-pro" value={form.modelId} onChange={e => setField('modelId', e.target.value)} />
                            </label>
                            {/* Model Name */}
                            <label className={`drw__field ${formErrors.modelName ? 'drw__field--error' : ''}`}>
                                <span>Model Name <em>*</em></span>
                                <input type="text" placeholder="e.g. Gemini 1.5 Pro" value={form.modelName} onChange={e => setField('modelName', e.target.value)} />
                            </label>
                            {/* Model Provider */}
                            <label className={`drw__field ${formErrors.provider ? 'drw__field--error' : ''}`}>
                                <span>Model Provider <em>*</em></span>
                                <select value={form.provider} onChange={e => setField('provider', e.target.value)}>
                                    <option value="">Select provider...</option>
                                    {MODEL_PROVIDERS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </label>
                            {/* Description — full width */}
                            <label className="drw__field drw__field--full">
                                <span>Description</span>
                                <textarea rows="2" placeholder="Brief description of the model..." value={form.description} onChange={e => setField('description', e.target.value)} />
                            </label>
                            {/* Model Link — full width, required */}
                            <label className={`drw__field drw__field--full ${formErrors.modelLink ? 'drw__field--error' : ''}`}>
                                <span>Model Link <em>*</em></span>
                                <div className="drw__input-icon-wrap">
                                    <svg className="drw__input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                    <input type="url" placeholder="https://api.provider.com/v1/models/..." value={form.modelLink} onChange={e => setField('modelLink', e.target.value)} className="drw__input-has-icon" />
                                </div>
                            </label>
                            {/* Model Type */}
                            <label className={`drw__field ${formErrors.modelType ? 'drw__field--error' : ''}`}>
                                <span>Model Type <em>*</em></span>
                                <select value={form.modelType} onChange={e => setField('modelType', e.target.value)}>
                                    <option value="">Select type...</option>
                                    {MODEL_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </label>
                            {/* Property Key */}
                            <label className="drw__field">
                                <span>Model Property Key</span>
                                <select value={form.propertyKey} onChange={e => setField('propertyKey', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option>completion</option>
                                    <option>embedding</option>
                                    <option>generation</option>
                                    <option>transcription</option>
                                </select>
                            </label>
                            {/* File Format pills */}
                            <div className="drw__field drw__field--full">
                                <span>File Format</span>
                                <div className="drw__pill-row">
                                    {FILE_FORMATS.map(fmt => (
                                        <button
                                            key={fmt}
                                            type="button"
                                            className={`drw__fmt-pill ${form.selectedFormats.includes(fmt) ? 'drw__fmt-pill--active' : ''}`}
                                            onClick={() => toggleFormat(fmt)}
                                        >{fmt}</button>
                                    ))}
                                </div>
                            </div>
                            {/* Max Tokens */}
                            <label className="drw__field">
                                <span>Max Tokens</span>
                                <input type="number" placeholder="e.g. 128000" value={form.maxTokens} onChange={e => setField('maxTokens', e.target.value)} />
                            </label>
                            {/* Retirement Date */}
                            <label className="drw__field">
                                <span>Retirement Date</span>
                                <input type="date" value={form.retirementDate} onChange={e => setField('retirementDate', e.target.value)} />
                            </label>
                            {/* Input Pricing */}
                            <label className="drw__field">
                                <span>Input Pricing ($ / 1K tokens)</span>
                                <input type="number" step="0.0001" placeholder="e.g. 0.075" value={form.inputPricing} onChange={e => setField('inputPricing', e.target.value)} />
                            </label>
                            {/* Output Pricing */}
                            <label className="drw__field">
                                <span>Output Pricing ($ / 1K tokens)</span>
                                <input type="number" step="0.0001" placeholder="e.g. 0.30" value={form.outputPricing} onChange={e => setField('outputPricing', e.target.value)} />
                            </label>
                            {/* Feature toggles — full width */}
                            <div className="drw__field drw__field--full">
                                <span>Feature Toggles</span>
                                <div className="drw__toggles">
                                    {[['Playground', 'togglePlayground'], ['BYA', 'toggleBYA'], ['API', 'toggleAPI']].map(([lbl, key]) => (
                                        <label key={key} className="drw__switch-label">
                                            <span>{lbl}</span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={form[key]}
                                                className={`drw__switch ${form[key] ? 'drw__switch--on' : ''}`}
                                                onClick={() => setField(key, !form[key])}
                                            ><span className="drw__switch-knob" /></button>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Validation error */}
                            {hasStep1Errors && (
                                <div className="drw__field drw__field--full">
                                    <span className="drw__error-msg">{I.alertTri} Note: fill the required fields</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ════ STEP 2 — Hyperparameters ════ */}
                    {drawerStep === 1 && (
                        <div className="drw__params" key="step-1">
                            <div className="drw__params-topbar">
                                <span className="drw__params-count">{hyperparams.length} parameter{hyperparams.length !== 1 && 's'}</span>
                                <button className="drw__add-param" onClick={addParam}>{I.plus} Add Parameter</button>
                            </div>
                            {hyperparams.map(p => (
                                <div key={p.id} className="hp-card">
                                    <button className="hp-card__remove" onClick={() => removeParam(p.id)} aria-label="Remove parameter">{I.trash}</button>
                                    <div className="hp-card__row">
                                        <label className="drw__field">
                                            <span>Label</span>
                                            <input type="text" placeholder="e.g. max_tokens" value={p.label} onChange={e => updateParam(p.id, 'label', e.target.value)} />
                                        </label>
                                        <label className="drw__field">
                                            <span>Type</span>
                                            <select value={p.type} onChange={e => updateParam(p.id, 'type', e.target.value)}>
                                                <option>Integer</option>
                                                <option>Float</option>
                                                <option>Boolean</option>
                                                <option>String</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="hp-card__row hp-card__row--4">
                                        <label className="drw__field">
                                            <span>Min</span>
                                            <input type="text" placeholder="0" value={p.min} onChange={e => updateParam(p.id, 'min', e.target.value)} />
                                        </label>
                                        <label className="drw__field">
                                            <span>Max</span>
                                            <input type="text" placeholder="—" value={p.max} onChange={e => updateParam(p.id, 'max', e.target.value)} />
                                        </label>
                                        <label className="drw__field">
                                            <span>Default</span>
                                            <input type="text" placeholder="—" value={p.default} onChange={e => updateParam(p.id, 'default', e.target.value)} />
                                        </label>
                                        <label className="drw__field drw__field--toggle">
                                            <span>Optional</span>
                                            <button
                                                type="button"
                                                className={`drw__opt-pill ${p.optional ? 'drw__opt-pill--active' : ''}`}
                                                onClick={() => updateParam(p.id, 'optional', !p.optional)}
                                            >{p.optional ? 'Yes' : 'No'}</button>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ════ STEP 3 — Payload Structure ════ */}
                    {drawerStep === 2 && (
                        <div className="drw__payload" key="step-2">
                            <div className="drw__code-header">
                                <span>{I.code} JSON / Payload Template</span>
                            </div>
                            <textarea
                                className="drw__code-editor"
                                rows="16"
                                placeholder={'{\n  "messages": [\n    {"role": "system", "content": "{system_prompt}"},\n    {"role": "user", "content": "{user_prompt}"}\n  ],\n  "max_tokens": 4096,\n  "temperature": 0.7\n}'}
                                value={payload}
                                onChange={e => setPayload(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    )}
                </div>

                {/* ── Sticky Footer ── */}
                <div className="drw__footer">
                    <button className="mo__btn mo__btn--outline" onClick={() => setDrawerOpen(false)}>Cancel</button>
                    <div className="drw__footer-right">
                        {isViewMode ? (
                            <>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.7 }}>Read-only mode</span>
                                {drawerStep > 0 && <button className="mo__btn mo__btn--outline" onClick={goBack}>Back</button>}
                                {drawerStep < 2
                                    ? <button className="mo__btn mo__btn--outline" onClick={goNext}>Next</button>
                                    : <button className="mo__btn mo__btn--primary" onClick={() => setDrawerOpen(false)}>Close</button>
                                }
                            </>
                        ) : (
                            <>
                                {drawerStep > 0 && <button className="mo__btn mo__btn--outline" onClick={goBack} disabled={saving}>Back</button>}
                                {drawerStep < 2 ? (
                                    <button className="mo__btn mo__btn--primary" onClick={goNext}>Continue</button>
                                ) : (
                                    <button className="mo__btn mo__btn--primary" onClick={submitModel} disabled={saving}>
                                        {saving
                                            ? <><span className="ev2__spin" style={{ width: 12, height: 12 }} /> Saving…</>
                                            : editId ? 'Save Changes' : 'Submit Model'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* ══ Modal ══ */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>

                        {/* Approve */}
                        {modal.type === 'approve' && (<>
                            <h3 className="modal__title">Approve Model</h3>
                            <p className="modal__desc">Approve <strong>{modal.model.name}</strong> for platform use?</p>
                            <label className="mo__field" style={{ marginTop: 12 }}>
                                <span>Approval Notes</span>
                                <textarea rows="2" placeholder="Optional notes…" />
                            </label>
                            <div className="modal__actions">
                                <button className="mo__btn mo__btn--outline" onClick={() => setModal(null)}>Cancel</button>
                                <button className="mo__btn mo__btn--primary" onClick={() => approveModel(modal.model)}>Confirm Approve</button>
                            </div>
                        </>)}

                        {/* Reject */}
                        {modal.type === 'reject' && (<>
                            <h3 className="modal__title">Reject Model</h3>
                            <p className="modal__desc">Reject <strong>{modal.model.name}</strong>? This requires re-submission.</p>
                            <label className="mo__field" style={{ marginTop: 12 }}>
                                <span>Rejection Reason</span>
                                <textarea rows="2" placeholder="Required reason…" />
                            </label>
                            <div className="modal__actions">
                                <button className="mo__btn mo__btn--outline" onClick={() => setModal(null)}>Cancel</button>
                                <button className="mo__btn mo__btn--danger" onClick={() => rejectModel(modal.model)}>Confirm Reject</button>
                            </div>
                        </>)}

                        {/* Delete */}
                        {modal.type === 'delete' && (<>
                            <h3 className="modal__title" style={{ color: '#f87171' }}>{I.trash} Remove Model</h3>
                            <p className="modal__desc">Permanently remove <strong>{modal.model.name}</strong>? This cannot be undone.</p>
                            <div className="modal__actions">
                                <button className="mo__btn mo__btn--outline" onClick={() => setModal(null)}>Cancel</button>
                                <button className="mo__btn mo__btn--danger" onClick={() => deleteModel(modal.model)}>Yes, Remove</button>
                            </div>
                        </>)}

                    </div>
                </div>
            )}

            {/* ══ Toasts ══ */}
            <div className="toast-stack">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast--${t.type}`}>
                        {t.type === 'success' ? I.checkCircle : I.xCircle}
                        <span>{t.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
