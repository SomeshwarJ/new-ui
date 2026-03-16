import React, { useState, useRef, useEffect } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ConsumerSidebar from '../components/ConsumerSidebar';
import ConsumerHeader from '../components/ConsumerHeader';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

/* ─── Icons ─── */
const I = {
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    calc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="14" /><line x1="16" y1="18" x2="16" y2="18" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="12" y1="18" x2="12" y2="18" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="8" y1="18" x2="8" y2="18" /></svg>,
    upload: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    bolt: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    google: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.1h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.7 3-4.2 3-7.2z" fill="#4285F4" /><path d="M12 21.6c2.7 0 4.9-.9 6.6-2.4l-3.2-2.6c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4H3v2.7c1.7 3.4 5.2 5.8 9 5.8z" fill="#34A853" /><path d="M6.4 13.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H3C2.3 8.4 2 10.1 2 12s.3 3.6 1 5l3.4-3.5z" fill="#FBBC05" /><path d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.7 1.6 12 1.6 8.2 1.6 4.7 4 3 7.4l3.4 2.7c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335" /></svg>,
    openai: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /><path d="M14.542 5.928a6.545 6.545 0 0 0-5.084.004... (simplified for space)" /></svg>, // Simplified logo placeholder
    claude: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg> // Simplified
}


const PROVIDERS = [
    { id: 'google', name: 'Google (Gemini)', color: '#4E8EFF' },
    { id: 'openai', name: 'OpenAI (GPT)', color: '#10A37F' },
    { id: 'claude', name: 'Anthropic (Claude)', color: '#D97757' }
]

// Helper function to format large numbers like 1048576 to "1M"
const formatContext = (numText) => {
    if (!numText || numText === '—') return '—';
    const num = parseInt(numText, 10);
    if (isNaN(num)) return numText;
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
};

export default function TokenCalculator({ theme, onToggleTheme, persona = 'consumer' }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarPeek, setSidebarPeek] = useState(false)

    // Dynamic Models Data
    const [modelsData, setModelsData] = useState({ google: [], openai: [], claude: [] })
    const [pricingModelsData, setPricingModelsData] = useState([])
    const [fetchingModels, setFetchingModels] = useState(true)

    // Form State
    const [provider, setProvider] = useState('google')
    const [model, setModel] = useState('')
    const [prompt, setPrompt] = useState('')
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [history, setHistory] = useState([]) // Stores full calculation history

    const [mode, setMode] = useState('analyzer') // 'analyzer' | 'estimator'

    // Estimator state
    const [estInputs, setEstInputs] = useState('1000')
    const [estOutputs, setEstOutputs] = useState('1000')
    const [estCalls, setEstCalls] = useState('100')
    const [estCalcBy, setEstCalcBy] = useState('Tokens') // Tokens, Words, Characters
    const [estTab, setEstTab] = useState('Chat/Completion') // Chat/Completion, Fine-tuning, Embedding
    const [estSearch, setEstSearch] = useState('')

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/models');
                if (!res.ok) throw new Error('Failed to fetch models');
                const data = await res.json();
                
                // Parse DB models into our nested structure for the Token Analyzer selector
                const parsedModels = { google: [], openai: [], claude: [] };
                // Also parse DB models into the flat structure for the Pricing Estimator
                const parsedPricing = [];

                data.forEach(m => {
                    const pKey = m.provider?.toLowerCase() || 'google';
                    if (!parsedModels[pKey]) parsedModels[pKey] = [];
                    
                    // The standard backend modelId is stored in 'modelId', name is in 'name'
                    const modelId = m.modelId ? m.modelId.trim() : m.name;
                    // Safely extract pricing fields
                    const inputCost = typeof m.inputPricing === 'number' ? m.inputPricing : 0;
                    const outputCost = typeof m.outputPricing === 'number' ? m.outputPricing : 0;
                    
                    // Add to Analyzer lists
                    parsedModels[pKey].push({
                        id: modelId,
                        name: m.name,
                        cost: inputCost, 
                        description: m.description || m.type || 'Standard model'
                    });

                    // Add to Estimator flat list. Map to appropriate categories.
                    let estType = 'Chat/Completion';
                    if (m.type && m.type.toLowerCase().includes('embed')) estType = 'Embedding';
                    if (m.type && m.type.toLowerCase().includes('fine')) estType = 'Fine-tuning';

                    parsedPricing.push({
                        provider: m.provider === 'openai' ? 'OpenAI' : m.provider === 'claude' ? 'Anthropic' : 'Google',
                        name: m.name,
                        context: formatContext(m.maxTokens),
                        inCost: inputCost,
                        outCost: outputCost,
                        type: estType
                    });
                });

                setModelsData(parsedModels);
                setPricingModelsData(parsedPricing);

                // Set initial active model to the first available in current provider
                if (parsedModels[provider]?.length > 0) {
                    setModel(parsedModels[provider][0].id);
                }

            } catch (err) {
                console.error("Error fetching models:", err);
                setError("Failed to load models database.");
            } finally {
                setFetchingModels(false);
            }
        };

        fetchModels();
    }, []);

    const handleProviderSelect = (pId) => {
        setProvider(pId)
        if (modelsData[pId] && modelsData[pId].length > 0) {
            setModel(modelsData[pId][0].id)
        } else {
            setModel('')
        }
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected && selected.type === 'application/pdf') {
            setFile(selected)
            setError(null)
        } else {
            setError('Please select a valid PDF file.')
        }
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const getSelectedModelData = () => {
        if (!modelsData[provider]) return { cost: 0, name: model };
        return modelsData[provider].find(m => m.id === model) || { cost: 0, name: model }
    }

    const calculateTokens = async () => {
        if (!prompt.trim() && !file) {
            setError('Please enter a text prompt or upload a PDF.')
            return
        }
        setError(null)
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('provider', provider)
            formData.append('model', model)
            if (prompt) formData.append('prompt', prompt)
            if (file) formData.append('file', file)

            const BE_API = 'http://127.0.0.1:8000/count_tokens_unified'
            const res = await fetch(BE_API, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || 'Network request failed')
            }

            const data = await res.json()
            const modelData = getSelectedModelData()
            const cost = (data.token_count / 1000) * modelData.cost

            setHistory(prev => [{
                id: Date.now(),
                provider: PROVIDERS.find(p => p.id === provider).name,
                modelId: data.model,
                modelName: modelData.name,
                tokens: data.token_count,
                cost: cost,
                method: file ? (prompt ? 'Text + PDF' : 'PDF Only') : 'Text Only',
                time: new Date().toLocaleString()
            }, ...prev])

        } catch (err) {
            console.error(err)
            setError(err.message.includes('Failed to fetch')
                ? 'Could not connect to the Backend Token API (Make sure it is running on 127.0.0.1:8000)'
                : err.message)
        } finally {
            setLoading(false)
        }
    }

    const exportToCSV = () => {
        if (history.length === 0) return

        const headers = "Date,Provider,Model,Input Method,Tokens,Estimated Cost (USD)\n"
        const csvRows = history.map(row =>
            `"${row.time}","${row.provider}","${row.modelName}","${row.method}","${row.tokens.toLocaleString()}","$${row.cost.toFixed(6)}"`
        ).join("\n")

        const csvContent = "data:text/csv;charset=utf-8," + headers + csvRows
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `llm-cost-calculations-${Date.now()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const Sidebar = persona === 'admin' ? AdminSidebar : ConsumerSidebar;
    const Header = persona === 'admin' ? AdminHeader : ConsumerHeader;

    return (
        <div className="dash tk-layout">
            {/* ══ Sidebar ══ */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="dash__content tk-main">
                {/* ── Top Bar ── */}
                <Header theme={theme} onToggleTheme={onToggleTheme} title="LLM Token Calculator" />

                <div className="tk-container">

                    {error && (
                        <div className="tk-alert tk-alert--error">
                            <span className="tk-alert-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="tk-mode-switch">
                        <button className={`tk-mode-btn ${mode === 'analyzer' ? 'active' : ''}`} onClick={() => setMode('analyzer')}>Token Analysis</button>
                        <button className={`tk-mode-btn ${mode === 'estimator' ? 'active' : ''}`} onClick={() => setMode('estimator')}>Pricing Estimator</button>
                    </div>

                    {mode === 'estimator' && (
                        <div className="est-wrapper">
                            <div className="est-header">
                                <h1 className="est-title">LLM API Pricing Calculator</h1>
                                <p className="est-subtitle">Estimate the cost of using OpenAI, Anthropic, and other Large Language Models APIs</p>
                            </div>

                            <div className="est-controls-card">
                                <div className="est-inputs-row">
                                    <div className="est-input-group">
                                        <label className="est-lbl">Input {estCalcBy.toLowerCase()}</label>
                                        <input type="number" className="est-inp" value={estInputs} onChange={e => setEstInputs(e.target.value)} />
                                    </div>
                                    <div className="est-input-group">
                                        <label className="est-lbl">Output {estCalcBy.toLowerCase()}</label>
                                        <input type="number" className="est-inp" value={estOutputs} onChange={e => setEstOutputs(e.target.value)} />
                                    </div>
                                    <div className="est-input-group">
                                        <label className="est-lbl">API Calls</label>
                                        <input type="number" className="est-inp" value={estCalls} onChange={e => setEstCalls(e.target.value)} />
                                    </div>
                                </div>

                                <div className="est-toggle-row">
                                    <label className="est-lbl">Calculate by</label>
                                    <div className="est-toggle-wrapper">
                                        {['Tokens', 'Words', 'Characters'].map(t => (
                                            <button key={t} className={`est-toggle-btn ${estCalcBy === t ? 'active' : ''}`} onClick={() => setEstCalcBy(t)}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="est-table-card">
                                <div className="est-table-tabs">
                                    <div className="est-tabs-left">
                                        {['Chat/Completion', 'Fine-tuning', 'Embedding'].map(t => (
                                            <button key={t} className={`est-tab ${estTab === t ? 'active' : ''}`} onClick={() => setEstTab(t)}>{t}</button>
                                        ))}
                                    </div>
                                    <input type="text" className="est-search" placeholder="Search models..." value={estSearch} onChange={e => setEstSearch(e.target.value)} />
                                </div>

                                <div className="est-table-wrapper">
                                    <table className="est-table">
                                        <thead>
                                            <tr>
                                                <th>Provider</th>
                                                <th>Model</th>
                                                <th>Context</th>
                                                <th>Input/1k Tokens</th>
                                                <th>Output/1k Tokens</th>
                                                <th>Per Call</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pricingModelsData.length === 0 && (
                                                <tr><td colSpan="7" style={{textAlign:'center', padding:'32px'}}>No models matching criteria found.</td></tr>
                                            )}
                                            {pricingModelsData
                                                .filter(m => m.type === estTab && (m.name.toLowerCase().includes(estSearch.toLowerCase()) || m.provider.toLowerCase().includes(estSearch.toLowerCase())))
                                                .map((m, i) => {
                                                    let multiplier = 1;
                                                    if (estCalcBy === 'Words') multiplier = 1.33;
                                                    if (estCalcBy === 'Characters') multiplier = 0.25;

                                                    const callInputs = (Number(estInputs) || 0) * multiplier;
                                                    const callOutputs = (Number(estOutputs) || 0) * multiplier;
                                                    const costIn = (callInputs / 1000) * m.inCost;
                                                    const costOut = (callOutputs / 1000) * m.outCost;
                                                    const perCall = costIn + costOut;
                                                    const total = perCall * (Number(estCalls) || 0);

                                                    return (
                                                        <tr key={i}>
                                                            <td>{m.provider}</td>
                                                            <td>{m.name}</td>
                                                            <td>{m.context}</td>
                                                            <td className="est-val">${m.inCost.toFixed(5)}</td>
                                                            <td className="est-val">${m.outCost.toFixed(5)}</td>
                                                            <td className="est-val">${perCall.toFixed(5)}</td>
                                                            <td className="est-val est-total">${total.toFixed(5)}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'analyzer' && (
                    <div className="tk-grid">

                        {/* ── Left Column: Config & Input ── */}
                        <div className="tk-col">
                            {/* Card: Model Selection */}
                            <div className="tk-card">
                                <h2 className="tk-card-title">1. Select AI Model</h2>

                                <div className="tk-provider-group">
                                    {PROVIDERS.map(p => (
                                        <button
                                            key={p.id}
                                            className={`tk-provider-btn ${provider === p.id ? 'active' : ''}`}
                                            style={{ '--px-color': p.color }}
                                            onClick={() => handleProviderSelect(p.id)}
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="tk-model-group">
                                    <label className="tk-label">Model Endpoint</label>
                                    <div className="tk-model-select-wrapper">
                                        <select
                                            className="tk-select"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            disabled={fetchingModels || !modelsData[provider]?.length}
                                        >
                                            {fetchingModels ? (
                                                <option value="">Loading models...</option>
                                            ) : modelsData[provider]?.length > 0 ? (
                                                modelsData[provider].map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No models available</option>
                                            )}
                                        </select>
                                        <div className="tk-select-arrow">{I.chevDown}</div>
                                    </div>
                                    <p className="tk-helper">Prices reflect estimated cost per 1K <strong>input</strong> tokens.</p>
                                </div>
                            </div>

                            {/* Card: Data Input */}
                            <div className="tk-card tk-card--glow">
                                <h2 className="tk-card-title">2. Input Data</h2>

                                <div className="tk-input-section">
                                    <label className="tk-label">Text Prompt <span>(Optional)</span></label>
                                    <textarea
                                        className="tk-textarea"
                                        placeholder="Paste your prompt or document text here..."
                                        value={prompt}
                                        onChange={e => setPrompt(e.target.value)}
                                    />
                                </div>

                                <div className="tk-input-divider">AND / OR</div>

                                <div className="tk-input-section">
                                    <label className="tk-label">PDF Document <span>(Optional)</span></label>

                                    {!file ? (
                                        <div className="tk-dropzone" onClick={() => fileInputRef.current?.click()}>
                                            <div className="tk-dropzone-icon">{I.upload}</div>
                                            <p className="tk-dropzone-text">Click to upload or drag and drop<br /><span>.pdf format only</span></p>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                className="hidden-input"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    ) : (
                                        <div className="tk-file-item">
                                            <div className="tk-file-info">
                                                <div className="tk-file-icon">{I.check}</div>
                                                <span className="tk-file-name">{file.name}</span>
                                            </div>
                                            <button className="tk-file-remove" onClick={removeFile} aria-label="Remove file">
                                                {I.x}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`tk-btn-submit ${loading ? 'loading' : ''}`}
                                    onClick={calculateTokens}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner"></span> Parsing Tokens...</>
                                    ) : (
                                        <>{I.bolt} Calculate Tokens & Cost</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Right Column: Pricing & Results ── */}
                        <div className="tk-col">

                            {/* Calculation History */}
                            <div className="tk-card tk-card--tall">
                                <div className="tk-card-header">
                                    <h2 className="tk-card-title">Calculation History</h2>
                                    <button
                                        className="tk-btn-outline"
                                        onClick={exportToCSV}
                                        disabled={history.length === 0}
                                    >
                                        {I.download} Export CSV
                                    </button>
                                </div>

                                {history.length === 0 ? (
                                    <div className="tk-empty-state">
                                        <div className="tk-empty-pulse"></div>
                                        <p>Run a calculation to see results here.</p>
                                    </div>
                                ) : (
                                    <div className="tk-history-list">
                                        {history.map(item => (
                                            <div key={item.id} className="tk-history-item">
                                                <div className="tk-history-meta">
                                                    <span className="tk-hi-model">{item.modelName}</span>
                                                    <span className="tk-hi-method">{item.method}</span>
                                                </div>

                                                <div className="tk-history-stats">
                                                    <div className="tk-stat">
                                                        <span className="tk-stat-val">{item.tokens.toLocaleString()}</span>
                                                        <span className="tk-stat-lbl">Tokens</span>
                                                    </div>
                                                    <div className="tk-stat tk-stat--cost">
                                                        <span className="tk-stat-val">${item.cost.toFixed(6)}</span>
                                                        <span className="tk-stat-lbl">Estimated Cost</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Pricing Ref */}
                            <div className="tk-card tk-card--table">
                                <h3 className="tk-table-title">Input API Pricing Reference</h3>
                                <div className="tk-table-wrapper">
                                    <table className="tk-table">
                                        <thead>
                                            <tr>
                                                <th>Model</th>
                                                <th className="right">Cost / 1K Tokens</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchingModels ? (
                                                <tr><td colSpan="2" style={{textAlign:'center'}}>Loading...</td></tr>
                                            ) : (
                                                Object.values(modelsData).flat().map((m, i) => (
                                                    <tr key={`${m.id}-${i}`}>
                                                        <td>{m.name}</td>
                                                        <td className="right">${Number(m.cost).toFixed(3)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}

                </div>
            </div>
        </div>
    )
}
