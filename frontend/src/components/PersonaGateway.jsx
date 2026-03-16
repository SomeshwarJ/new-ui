import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Icons ── */
const CreatorIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
)

const ConsumerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
)

const AdminIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
)

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

const personas = [
    {
        id: 'creator',
        title: 'Creator',
        subtitle: 'Builder & Developer',
        description: 'Architect and build GenAI applications. Access the full development lifecycle — from prompt engineering to production deployment.',
        accent: '#4E8EFF',
        accentRgb: '78, 142, 255',
        gradientStart: 'rgba(78, 142, 255, 0.4)',
        gradientEnd: 'rgba(78, 142, 255, 0.0)',
        bgPattern: 'radial-gradient(circle at 0% 0%, rgba(78, 142, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(78, 142, 255, 0.1) 0%, transparent 50%)',
        link: '/persona/creator',
        icon: <CreatorIcon />,
        tags: ['Prompt Studio', 'Model Onboarding', 'App Builder', 'API Gateway'],
        badge: 'Builder',
        comingSoon: true,
    },
    {
        id: 'consumer',
        title: 'Consumer',
        subtitle: 'End User Experience',
        description: 'Discover and interact with deployed AI applications. Use the Launchpad, Command Center, and track your AI usage insights.',
        accent: '#34D399',
        accentRgb: '52, 211, 153',
        gradientStart: 'rgba(52, 211, 153, 0.4)',
        gradientEnd: 'rgba(52, 211, 153, 0.0)',
        bgPattern: 'radial-gradient(circle at 0% 100%, rgba(52, 211, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(52, 211, 153, 0.1) 0%, transparent 50%)',
        link: '/persona/consumer',
        icon: <ConsumerIcon />,
        tags: ['Launchpad', 'Command Center', 'Observability', 'Usage Insights'],
        badge: 'User',
        comingSoon: false,
    },
    {
        id: 'admin',
        title: 'Platform Admin',
        subtitle: 'Governance & Control',
        description: 'Govern, monitor, and manage the entire GenAI platform. Configure policies, manage approvals, and oversee all workspaces.',
        accent: '#A78BFA',
        accentRgb: '167, 139, 250',
        gradientStart: 'rgba(167, 139, 250, 0.4)',
        gradientEnd: 'rgba(167, 139, 250, 0.0)',
        bgPattern: 'radial-gradient(circle at 50% 0%, rgba(167, 139, 250, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
        link: '/persona/admin',
        icon: <AdminIcon />,
        tags: ['Policy Manager', 'Model Oversight', 'Audit Logs', 'Platform Config'],
        badge: 'Admin',
        comingSoon: false,
    },
]

export default function PersonaGateway({ isOpen, onClose }) {
    const navigate = useNavigate()
    const overlayRef = useRef(null)
    const [hoveredCard, setHoveredCard] = useState('consumer') // Default expanded card
    const [activeCard, setActiveCard] = useState(null)
    const [animateIn, setAnimateIn] = useState(false)
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setExiting(false)
            setHoveredCard('consumer')
            document.body.style.overflow = 'hidden'
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimateIn(true))
            })
        } else {
            setAnimateIn(false)
            document.body.style.overflow = ''
            setActiveCard(null)
            setExiting(false)
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const handleClose = () => {
        setExiting(true)
        setAnimateIn(false)
        setTimeout(onClose, 600)
    }

    const handleEnter = (e, persona) => {
        e.stopPropagation()
        if (persona.comingSoon) return
        setActiveCard(persona.id)
        setTimeout(() => {
            handleClose()
            setTimeout(() => navigate(persona.link), 300)
        }, 600)
    }

    const handleBackdropClick = (e) => {
        if (e.target === overlayRef.current) handleClose()
    }

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose() }
        if (isOpen) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen])

    if (!isOpen && !exiting) return null

    return (
        <div
            ref={overlayRef}
            className={`persona-gateway-overlay ${animateIn ? 'persona-gateway-overlay--in' : ''}`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Choose your persona"
        >
            <button
                className={`pg-fs-close ${animateIn ? 'pg-fs-close--in' : ''}`}
                onClick={handleClose}
                aria-label="Close persona selector"
            >
                <div className="pg-fs-close-bg"></div>
                <CloseIcon /> <span>Close</span>
            </button>

            <div className={`pg-fs-header ${animateIn ? 'pg-fs-header--in' : ''}`}>
                <div className="pg-fs-eyebrow">
                    <span className="pg-fs-dot" /> Explore Platform Ecosystem
                </div>
                <h2 className="pg-fs-title">Select Your Entry Point</h2>
            </div>

            <div className={`pg-fs-container ${animateIn ? 'pg-fs-container--in' : ''}`}>
                {personas.map((persona, idx) => {
                    const isHovered = hoveredCard === persona.id;
                    const isActive = activeCard === persona.id;
                    const isLocked = persona.comingSoon;

                    return (
                        <div
                            key={persona.id}
                            className={`pg-fs-card ${isHovered ? 'pg-fs-card--expanded' : 'pg-fs-card--collapsed'} 
                                        ${isActive ? 'pg-fs-card--active' : ''} 
                                        ${isLocked ? 'pg-fs-card--locked' : ''}`}
                            onMouseEnter={() => !activeCard && setHoveredCard(persona.id)}
                            onClick={(e) => {
                                if (!activeCard) {
                                    setHoveredCard(persona.id);
                                    if (isHovered) {
                                        handleEnter(e, persona)
                                    }
                                }
                            }}
                            style={{
                                '--card-accent': persona.accent,
                                '--card-accent-rgb': persona.accentRgb,
                                animationDelay: `${idx * 100}ms`
                            }}
                        >
                            {/* Animated Background Gradients inside card */}
                            <div className="pg-fs-card-bg" style={{
                                backgroundImage: `linear-gradient(to bottom, ${persona.gradientStart}, ${persona.gradientEnd}), ${persona.bgPattern}`
                            }}></div>

                            <div className="pg-fs-card-noise"></div>

                            {isLocked && <div className="pg-fs-badge-soon">Coming Soon</div>}

                            <div className="pg-fs-card-inner">
                                {/* Vertical collapsed view elements */}
                                <div className="pg-fs-collapsed-content">
                                    <div className="pg-fs-card-icon">
                                        {persona.icon}
                                    </div>
                                    <h3 className="pg-fs-vertical-title">{persona.title}</h3>
                                </div>

                                {/* Expanded view elements */}
                                <div className="pg-fs-expanded-content">
                                    <div className="pg-fs-expanded-header">
                                        <div className="pg-fs-card-icon pg-fs-card-icon--large">
                                            {persona.icon}
                                        </div>
                                        <div className="pg-fs-meta">
                                            <span className="pg-fs-badge">{persona.badge}</span>
                                            <span className="pg-fs-subtitle">{persona.subtitle}</span>
                                        </div>
                                    </div>

                                    <h3 className="pg-fs-expanded-title">{persona.title}</h3>
                                    <p className="pg-fs-expanded-desc">{persona.description}</p>

                                    <div className="pg-fs-tags">
                                        {persona.tags.map(tag => (
                                            <span key={tag} className="pg-fs-tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="pg-fs-action-area">
                                        {isLocked ? (
                                            <button className="pg-fs-btn pg-fs-btn--locked" disabled>
                                                Development in Progress
                                            </button>
                                        ) : (
                                            <button
                                                className="pg-fs-btn"
                                                onClick={(e) => handleEnter(e, persona)}
                                            >
                                                <span>Enter as {persona.title}</span>
                                                <ArrowIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isActive && <div className="pg-fs-ripple"></div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
