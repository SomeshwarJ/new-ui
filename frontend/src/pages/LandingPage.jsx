import React from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import ExperiencePlane from '../components/ExperiencePlane'

export default function LandingPage({ theme, onToggleTheme }) {
    return (
        <>
            <Header theme={theme} onToggleTheme={onToggleTheme} />
            <main>
                <MainSection />
                <ExperiencePlane />
            </main>
        </>
    )
}
