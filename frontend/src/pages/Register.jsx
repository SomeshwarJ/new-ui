import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const DEPARTMENTS = [
    'Engineering',
    'Data Science & AI',
    'Product Management',
    'Design & UX',
    'Marketing',
    'Sales',
    'Customer Success',
    'Finance & Accounting',
    'Legal & Compliance',
    'Human Resources',
    'IT & Infrastructure',
    'Research & Development',
    'Operations',
    'Security',
    'Executive / Leadership',
];

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [persona, setPersona] = useState('consumer');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!department) { setError('Please select a department.'); return; }
        setLoading(true);
        try {
            await register(fullname, email, password, persona, department);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '460px' }}>
                <div className="auth-header">
                    <div style={{
                        width: '44px', height: '44px', margin: '0 auto 16px',
                        background: 'rgba(78,142,255,0.12)',
                        border: '1px solid rgba(78,142,255,0.25)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E8EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h2>Create Account</h2>
                    <p>Join the GenAI Studio platform</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Row: Fullname + Persona */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Jane Smith"
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role / Persona</label>
                            <select value={persona} onChange={e => setPersona(e.target.value)}>
                                <option value="consumer">Consumer</option>
                                <option value="creator">Creator</option>
                                <option value="platform admin">Platform Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            style={!department ? { color: 'var(--text-muted)' } : {}}
                        >
                            <option value="" disabled>Select your department…</option>
                            {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                        style={{ marginTop: '4px' }}
                    >
                        {loading ? 'Creating Account…' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
