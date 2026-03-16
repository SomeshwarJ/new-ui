import React from 'react'
import FeatureTile from './FeatureTile'

/* SVG icons as inline components */
const PlaygroundIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
)

const StudioIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
)

const ApiIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
)

const MonitorIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
)

const SecurityIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const TeamIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const features = [
    {
        icon: <PlaygroundIcon />,
        title: 'AI Playground',
        description: 'Interactive environment for prompt engineering, model comparison, and rapid prototyping with real-time feedback.',
    },
    {
        icon: <StudioIcon />,
        title: 'Model Studio',
        description: 'Fine-tune, evaluate, and deploy foundation models with enterprise-grade MLOps pipelines and versioning.',
    },
    {
        icon: <ApiIcon />,
        title: 'API Gateway',
        description: 'Unified API layer with rate limiting, authentication, and intelligent routing across model providers.',
    },
    {
        icon: <MonitorIcon />,
        title: 'Observability Hub',
        description: 'Real-time monitoring, cost analytics, latency tracking, and performance dashboards for all AI workloads.',
    },
    {
        icon: <SecurityIcon />,
        title: 'Guardrails & Safety',
        description: 'Content filtering, PII detection, bias monitoring, and compliance controls built into every interaction.',
    },
    {
        icon: <TeamIcon />,
        title: 'Team Workspace',
        description: 'Collaborative environment with shared prompts, experiments, role-based access, and audit logging.',
    },
]

export default function ExperiencePlane() {
    return (
        <section className="experience-plane">
            <div className="experience-plane__inner">
                <div className="experience-plane__card">
                    <div className="experience-plane__header">
                        <div className="experience-plane__label">Experience Plane</div>
                        <p className="experience-plane__desc">
                            Where builders and end users interact with the platform
                        </p>
                    </div>
                    <div className="feature-grid">
                        {features.map((feature, index) => (
                            <FeatureTile
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
