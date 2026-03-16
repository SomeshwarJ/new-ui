import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChooseRole from './pages/ChooseRole'
import AdminDashboard from './pages/AdminDashboard'
import ConsumerDashboard from './pages/ConsumerDashboard'
import ModelOnboarding from './pages/ModelOnboarding'
import ModelEvaluation from './pages/ModelEvaluation'
import PoliciesManager from './pages/PoliciesManager'
import TemplatesManager from './pages/TemplatesManager'
import TokenCalculator from './pages/TokenCalculator'
import ObservabilityDashboard from './pages/ObservabilityDashboard'
import Playground from './pages/Playground'
import PromptAnalytics from './pages/PromptAnalytics'
import { PersonaGatewayProvider } from './PersonaGatewayContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/dashboard.css'
import './styles/model-onboarding.css'
import './styles/token-calculator.css'
import './styles/prompt-analytics.css'

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
        <AuthProvider>
            <BrowserRouter>
                <PersonaGatewayProvider>
                    <Routes>
                        <Route path="/" element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/enter" element={<ChooseRole theme={theme} onToggleTheme={toggleTheme} />} />
                        <Route path="/persona/admin" element={<ProtectedRoute><AdminDashboard theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/consumer" element={<ProtectedRoute><ConsumerDashboard theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/models" element={<ProtectedRoute><ModelOnboarding theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/playground" element={<ProtectedRoute><Playground theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/evaluate" element={<ProtectedRoute><ModelEvaluation theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/policies" element={<ProtectedRoute><PoliciesManager theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/templates" element={<ProtectedRoute><TemplatesManager theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/observability" element={<ProtectedRoute><ObservabilityDashboard theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/persona/admin/calculator" element={<ProtectedRoute><TokenCalculator theme={theme} onToggleTheme={toggleTheme} persona="admin" /></ProtectedRoute>} />
                        <Route path="/persona/admin/prompt-analytics" element={<ProtectedRoute><PromptAnalytics theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                        <Route path="/calculator" element={<TokenCalculator theme={theme} onToggleTheme={toggleTheme} persona="consumer" />} />
                    </Routes>
                </PersonaGatewayProvider>
            </BrowserRouter>
        </AuthProvider>
    )
}
