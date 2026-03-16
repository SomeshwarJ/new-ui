import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserProfileDrop() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = (user.fullname || "User")
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const personaColors = {
        'platform admin': { accent: '#4E8EFF', dim: '#1a3a6e' },
        'creator': { accent: '#a855f7', dim: '#3b1f6e' },
        'consumer': { accent: '#10b981', dim: '#0d3d2e' },
    };
    const color = personaColors[user.persona?.toLowerCase()] || personaColors['consumer'];

    return (
        <div ref={dropRef} style={{ position: 'relative' }}>
            {/* Trigger Avatar */}
            <button
                onClick={() => setOpen(o => !o)}
                title="Your Profile"
                style={{
                    width: '34px', height: '34px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${color.dim}, ${color.accent}40)`,
                    border: `1.5px solid ${color.accent}55`,
                    color: color.accent,
                    fontSize: '12px', fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: open ? `0 0 0 3px ${color.accent}30` : 'none',
                    transition: 'box-shadow 0.2s',
                    letterSpacing: '0.5px'
                }}
            >
                {initials}
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '296px',
                    background: '#0d1520',
                    border: '1px solid rgba(78,142,255,0.18)',
                    borderRadius: '14px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(78,142,255,0.06)',
                    overflow: 'hidden',
                    zIndex: 9999,
                    animation: 'upDrop 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    <style>{`
                        @keyframes upDrop {
                            from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>

                    {/* Card Top: Gradient Header Strip */}
                    <div style={{
                        padding: '20px 20px 16px',
                        background: `linear-gradient(135deg, #0d1a2e 0%, #0b1426 60%, ${color.dim}66 100%)`,
                        borderBottom: `1px solid rgba(78,142,255,0.10)`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px'
                    }}>
                        {/* Large initials disc */}
                        <div style={{
                            width: '52px', height: '52px',
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${color.dim}, ${color.accent}33)`,
                            border: `2px solid ${color.accent}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', fontWeight: '800',
                            color: color.accent,
                            flexShrink: 0,
                            boxShadow: `0 4px 16px ${color.accent}20`
                        }}>
                            {initials}
                        </div>

                        {/* Name + Email stack */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '15px', fontWeight: '700',
                                color: '#e8eef7',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                letterSpacing: '-0.2px',
                            }}>
                                {user.fullname || 'Anonymous'}
                            </div>
                            <div style={{
                                fontSize: '12px', color: '#5e7a9a',
                                marginTop: '3px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {user.email || '—'}
                            </div>
                            {user.department && (
                                <div style={{
                                    fontSize: '11px', color: '#4a6480',
                                    marginTop: '2px',
                                    display: 'flex', alignItems: 'center', gap: '5px'
                                }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    {user.department}
                                </div>
                            )}
                            {/* Persona badge */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                marginTop: '7px',
                                padding: '3px 10px', borderRadius: '20px',
                                background: `${color.accent}18`,
                                border: `1px solid ${color.accent}35`,
                                color: color.accent,
                                fontSize: '10.5px', fontWeight: '700',
                                textTransform: 'uppercase', letterSpacing: '0.9px'
                            }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                {user.persona}
                            </div>
                        </div>
                    </div>

                    {/* Footer: Logout */}
                    <div style={{ padding: '12px 16px', background: '#080f1a' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px 16px',
                                background: 'transparent',
                                border: '1px solid rgba(255,75,75,0.25)',
                                borderRadius: '8px',
                                color: '#ff7070',
                                fontSize: '13.5px', fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.18s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,75,75,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,75,75,0.45)';
                                e.currentTarget.style.color = '#ff5555';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255,75,75,0.25)';
                                e.currentTarget.style.color = '#ff7070';
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
