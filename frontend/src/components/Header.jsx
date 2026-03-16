import React from 'react'
import ThemeToggle from './ThemeToggle'
import { Link } from 'react-router-dom'
import { usePersonaGateway } from '../PersonaGatewayContext'

export default function Header({ theme, onToggleTheme }) {
    const openGateway = usePersonaGateway()

    return (
        <header className="header">
            <div className="header__inner">
                {/* Brand */}
                <div className="header__brand">
                    <div className="header__logo">
                        <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 3L37.5 12.5V31.5L21 41L4.5 31.5V12.5L21 3Z"
                                stroke="var(--accent)"
                                strokeWidth="1.5"
                                fill="rgba(78,142,255,0.06)"
                            />
                            <path
                                d="M21 11L30 21L21 31L12 21L21 11Z"
                                fill="var(--accent)"
                                opacity="0.85"
                            />
                            <circle cx="21" cy="21" r="3" fill="var(--bg-navy)" />
                            <line x1="21" y1="3" x2="21" y2="11" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
                            <line x1="21" y1="31" x2="21" y2="41" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
                        </svg>
                    </div>
                    <div className="header__text">
                        <h1>GenAI Studio Platform</h1>
                        <p>Enterprise-grade platform for the complete lifecycle of generative AI application development</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="header__actions">
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/login" className="header__cta" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', boxShadow: 'none' }}>
                            Log In
                        </Link>
                        <Link to="/register" className="header__cta">
                            Register
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
