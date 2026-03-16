import React, { useState } from 'react';
import UserProfileDrop from '../components/UserProfileDrop';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const persona = await login(email, password);
            if (persona === 'platform admin') {
                navigate('/persona/admin');
            } else if (persona === 'consumer') {
                navigate('/persona/consumer');
            } else {
                navigate('/enter'); // Fallback to role selection
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>GenAI Studio</h2>
                    <p>Enter your credentials to access the platform</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-btn">Log In</button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Request Access</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
