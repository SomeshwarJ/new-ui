import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChooseRole from './pages/ChooseRole'
import AdminDashboard from './pages/AdminDashboard'
import ModelOnboarding from './pages/ModelOnboarding'
import ModelEvaluation from './pages/ModelEvaluation'
import GuardrailsConfig from './pages/GuardrailsConfig'
import PoliciesManager from './pages/PoliciesManager'
import TemplatesManager from './pages/TemplatesManager'
import './styles/dashboard.css'
import './styles/model-onboarding.css'

export default function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('genai-theme') || 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('genai-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/enter" element={<ChooseRole theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin" element={<AdminDashboard theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin/models" element={<ModelOnboarding theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin/evaluate" element={<ModelEvaluation theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin/guardrails" element={<GuardrailsConfig theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin/policies" element={<PoliciesManager theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/persona/admin/templates" element={<TemplatesManager theme={theme} onToggleTheme={toggleTheme} />} />
            </Routes>
        </BrowserRouter>
    )
}

