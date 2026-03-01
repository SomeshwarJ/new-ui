import React from 'react'

export default function FeatureTile({ icon, title, description }) {
    return (
        <div className="feature-tile">
            <div className="feature-tile__icon">
                {icon}
            </div>
            <h3 className="feature-tile__title">{title}</h3>
            <p className="feature-tile__desc">{description}</p>
            <div className="feature-tile__arrow">
                Explore
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    )
}
