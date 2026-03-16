import React, { useState, useEffect, useRef } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { sendChatMessage, uploadContext } from '../api/playground';
import '../styles/playground.css';

const I = {
    chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    key: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    terminal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
    send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    paperclip: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>,
    x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    file: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>,
    clipboardCheck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 12 2 2 4-4" /></svg>,
    barChart2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
};

/* Sidebar configuration */


export default function Playground({ theme, onToggleTheme }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };


    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarPeek, setSidebarPeek] = useState(false);

    // Core Data
    const [models, setModels] = useState([]);
    const [activeModelId, setActiveModelId] = useState('');
    const [activeModel, setActiveModel] = useState(null);
    const [hyperparameters, setHyperparameters] = useState({});
    const [systemPrompt, setSystemPrompt] = useState("");
    const [guardrailModelId, setGuardrailModelId] = useState('');

    // Chat State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initial Fetch of onboarded models
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('/api/models');
                if (!res.ok) return;
                const data = await res.json();

                // Only act on deployed/active models OR pending (to allow testing locally)
                // Assuming we allow any for local sandbox, or just filter active:
                const validModels = data.filter(m => m.status === 'active' || m.status === 'pending');
                setModels(validModels);

                if (validModels.length > 0) {
                    setActiveModelId(validModels[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch models", err);
            }
        };
        fetchModels();
    }, []);

    // Effect on Selected Model change
    useEffect(() => {
        if (!activeModelId) return;
        const model = models.find(m => m.id === activeModelId);
        if (model) {
            setActiveModel(model);

            // Map default hyperparams into state
            const initialHp = {};
            if (model.hyperparams && model.hyperparams.length > 0) {
                model.hyperparams.forEach(hp => {
                    initialHp[hp.label] = hp.default || "";
                });
            }
            setHyperparameters(initialHp);

            // Auto expand textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = '48px';
            }
        }
    }, [activeModelId, models]);

    // Scroll to bottom effect
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    // Auto-resize textarea
    const handleInputResize = (e) => {
        setInput(e.target.value);
        e.target.style.height = '48px';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    }

    // Handlers
    const handleHpChange = (label, value) => {
        setHyperparameters(prev => ({ ...prev, [label]: value }));
    };

    const handleSendMessage = async () => {
        const messageText = input.trim();
        if ((!messageText && attachedFiles.length === 0) || !activeModelId || loading) return;

        // Reset input UI
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = '48px';

        // Prepare context
        let content = messageText || '';
        if (attachedFiles.length > 0) {
            const filesText = attachedFiles.map(f => `[Attached File: ${f.filename}]\n${f.text}\n=== END OF FILE ===`).join('\n\n');
            content = content ? `${filesText}\n\n[User Query]: ${content}` : filesText;
        }

        const userMsg = { role: 'user', content: content };

        // Remove attached files from staging area after send
        const currentFiles = [...attachedFiles];
        setAttachedFiles([]);

        let payloadMessages = [...messages, userMsg];
        if (systemPrompt && payloadMessages.length === 1) {
            // Depending on provider, injecting system prompt. Standard is as messages[0]
            payloadMessages = [{ role: 'system', content: systemPrompt }, ...payloadMessages];
        }

        // Optimistic UI push
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            // Send payload API Call
            const response = await sendChatMessage(activeModelId, payloadMessages, hyperparameters, guardrailModelId);

            if (response && response.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: No response generated." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear the conversation?")) {
            setMessages([]);
            setAttachedFiles([]);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadContext(file);
            setAttachedFiles(prev => [...prev, result]);
        } catch (err) {
            alert("Failed to upload file: " + err.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (idx) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="dash">
            {/* ══ Sidebar ══ */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* ══ Content Area ══ */}
            <div className="dash__content pg">
                {/* ── Top Bar ── */}
                <AdminHeader theme={theme} onToggleTheme={onToggleTheme} title="AI Studio Playground" />

                {/* ── Page Body: Splitepane ── */}
                <div className="pg__layout">
                    {/* Left Settings Sidebar */}
                    <div className="pg__sidebar">
                        <div className="pg__sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 className="pg__sidebar-title">Model Settings</h2>
                                <p className="pg__sidebar-desc">Configure the AI before inference.</p>
                            </div>
                            <button
                                className="pg__btn"
                                style={{ padding: '6px 10px', fontSize: '12px', background: 'rgba(255,255,255,0.1)' }}
                                onClick={handleClearChat}
                                title="Clear Conversation"
                            >
                                {I.trash} Clear
                            </button>
                        </div>

                        {/* Model Selection */}
                        <div className="pg__sidebar-section">
                            <label className="pg__sidebar-label">Active Model</label>
                            <select
                                className="pg__select"
                                value={activeModelId}
                                onChange={(e) => setActiveModelId(e.target.value)}
                            >
                                {models.length === 0 ? <option value="">No active models found...</option> : null}
                                {models.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Guardrail Selection */}
                        <div className="pg__sidebar-section">
                            <label className="pg__sidebar-label">Active Guardrail</label>
                            <select
                                className="pg__select"
                                value={guardrailModelId}
                                onChange={(e) => setGuardrailModelId(e.target.value)}
                            >
                                <option value="">None</option>
                                {models.filter(m => m.provider.toLowerCase() === 'ollama').map(m => (
                                    <option key={`g_${m.id}`} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Optional. Select an Ollama model to intercept unsafe prompts.
                            </div>
                        </div>

                        {/* System Instructions */}
                        <div className="pg__sidebar-section">
                            <label className="pg__sidebar-label">System Instructions</label>
                            <textarea
                                className="pg__input"
                                rows="4"
                                placeholder="You are a helpful AI assistant..."
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                            />
                        </div>

                        {/* Hyperparameters Map */}
                        {activeModel && activeModel.hyperparams && activeModel.hyperparams.length > 0 && (
                            <div className="pg__sidebar-section">
                                <label className="pg__sidebar-label">Advanced Settings</label>
                                {activeModel.hyperparams.map((hp, idx) => {
                                    const val = hyperparameters[hp.label] || 0;

                                    if (hp.type === 'Float' || hp.type === 'Integer') {
                                        const min = Number(hp.min || 0);
                                        const max = Number(hp.max || (hp.type === 'Float' ? 1 : 100));
                                        const step = hp.type === 'Float' ? "0.01" : "1";

                                        return (
                                            <div key={idx} className="pg__slider-group">
                                                <div className="pg__slider-header">
                                                    <span>{hp.label}</span>
                                                    <span className="pg__slider-val">{val}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    className="pg__slider"
                                                    min={min}
                                                    max={max}
                                                    step={step}
                                                    value={val}
                                                    onChange={(e) => handleHpChange(hp.label, e.target.value)}
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={idx} className="pg__slider-group">
                                                <div className="pg__slider-header">
                                                    <span>{hp.label}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="pg__input"
                                                    value={val}
                                                    onChange={(e) => handleHpChange(hp.label, e.target.value)}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Main Chat Container */}
                    <div className="pg__main">
                        <div className="pg__chat-container">
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: 'var(--text-muted)' }}>
                                    <h2>Start your conversation</h2>
                                    <p>Send a message below to interact with {activeModel?.name || 'the model'}.</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`pg__msg pg__msg--${msg.role}`}>
                                    <div className={`pg__msg-avatar pg__msg-avatar--${msg.role}`}>
                                        {msg.role === 'user' ? 'U' : (activeModel?.name?.charAt(0) || 'AI')}
                                    </div>
                                    <div className="pg__msg-content">
                                        <div className="pg__msg-header">
                                            <span className="pg__msg-role">{msg.role === 'user' ? 'User' : activeModel?.name || 'Assistant'}</span>
                                        </div>
                                        <div className="pg__msg-body">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading State Spinner */}
                            {loading && (
                                <div className="pg__msg pg__msg--assistant">
                                    <div className="pg__msg-avatar pg__msg-avatar--assistant">
                                        {activeModel?.name?.charAt(0) || 'AI'}
                                    </div>
                                    <div className="pg__msg-content" style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="pg__msg-loading">
                                            <span className="pg__dot"></span>
                                            <span className="pg__dot"></span>
                                            <span className="pg__dot"></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive Message Input */}
                        <div className="pg__input-area">
                            <div className="pg__input-box">
                                {attachedFiles.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                        {attachedFiles.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(78,142,255,0.15)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--accent)', border: '1px solid rgba(78,142,255,0.3)' }}>
                                                {I.file} <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.filename}</span>
                                                <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>{I.x}</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <textarea
                                    ref={textareaRef}
                                    className="pg__textarea"
                                    placeholder="Type your message here... (Shift+Enter for newline)"
                                    value={input}
                                    onChange={handleInputResize}
                                    onKeyDown={handleKeyDown}
                                    disabled={!activeModelId || loading || isUploading}
                                />
                                <div className="pg__input-actions">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <input
                                            type="file"
                                            accept=".txt,.pdf"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileUpload}
                                        />
                                        <button
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            disabled={loading || isUploading}
                                            title="Attach File (PDF, TXT)"
                                        >
                                            {I.paperclip} {isUploading ? 'Extracting...' : 'Attach'}
                                        </button>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enter to send, Shift+Enter for newline</span>
                                    </div>
                                    <button
                                        className="pg__btn"
                                        onClick={handleSendMessage}
                                        disabled={(!input.trim() && attachedFiles.length === 0) || !activeModelId || loading}
                                    >
                                        Run {I.send}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
