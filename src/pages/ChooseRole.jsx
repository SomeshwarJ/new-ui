import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

/* ── Icons ── */
const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
)

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Settings">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Info">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
)

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

/* ── Card‑specific icon components ── */
const CreatorIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
)

const ConsumerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
)

const AdminIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

/* ── Data ── */
const roles = [
    // {
    //     id: 'creator',
    //     title: 'Creator',
    //     accent: '#4E8EFF',
    //     accentRgb: '78, 142, 255',
    //     description: 'Build, test, and deploy GenAI applications and agents.',
    //     capabilities: [
    //         'Create applications and agents',
    //         'Design prompts and workflows',
    //         'Test and deploy to production',
    //         'Manage workspaces and assets',
    //     ],
    //     link: '/persona/creator',
    //     linkText: 'Enter as Creator',
    //     icon: <CreatorIcon />,
    // },
    // {
    //     id: 'consumer',
    //     title: 'Consumer',
    //     accent: '#34D399',
    //     accentRgb: '52, 211, 153',
    //     description: 'Access launchpad, command center, and observability tools.',
    //     capabilities: [
    //         'Launchpad',
    //         'Command Center',
    //         'Observability',
    //         'Usage insights',
    //     ],
    //     link: '/persona/consumer',
    //     linkText: 'Enter as Consumer',
    //     icon: <ConsumerIcon />,
    // },
    {
        id: 'admin',
        title: 'Platform Admin',
        accent: '#A78BFA',
        accentRgb: '167, 139, 250',
        description: 'Govern, monitor, and manage the entire platform.',
        capabilities: [
            'Configure governance policies',
            'Manage approvals and gates',
            'Oversee all workspaces',
            'Platform-wide monitoring',
        ],
        link: '/persona/admin',
        linkText: 'Enter as Admin',
        icon: <AdminIcon />,
    },
]

/* ── Component ── */
export default function ChooseRole({ theme, onToggleTheme }) {
    return (
        <div className="choose-role">
            {/* Top bar */}
            <nav className="choose-role__topbar" aria-label="Breadcrumb">
                <Link to="/" className="choose-role__back">
                    <ArrowLeftIcon />
                    Back to Architecture
                </Link>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </nav>

            {/* Page header */}
            <header className="choose-role__header">
                <h1 className="choose-role__title">Choose Your Role</h1>
                <p className="choose-role__subtitle">
                    Select the persona to explore the GenAI Studio Platform
                </p>
            </header>

            {/* Role cards grid */}
            <section className="choose-role__grid">
                {roles.map(role => (
                    <article
                        key={role.id}
                        className="role-card"
                        style={{
                            '--card-accent': role.accent,
                            '--card-accent-rgb': role.accentRgb,
                        }}
                    >
                        <div className="role-card__icon-chip">
                            {role.icon}
                        </div>

                        <h2 className="role-card__title">{role.title}</h2>
                        <p className="role-card__desc">{role.description}</p>

                        <ul className="role-card__capabilities">
                            {role.capabilities.map((cap, i) => (
                                <li key={i}>
                                    <span className="role-card__check"><CheckIcon /></span>
                                    {cap}
                                </li>
                            ))}
                        </ul>

                        <Link to={role.link} className="role-card__link">
                            {role.linkText}
                            <ChevronRight />
                        </Link>
                    </article>
                ))}
            </section>

            {/* Note strip */}
            <div className="choose-role__note">
                <InfoIcon />
                <span>Note: You can switch personas anytime from the platform header</span>
            </div>
        </div>
    )
}
