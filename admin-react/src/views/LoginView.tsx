import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, CheckCircle2, Globe } from 'lucide-react';
import './Login.css';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@kira-net.com' && password === 'admin123') {
        onLogin();
      } else {
        setError('The email or password you entered is incorrect.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="login-v2-container">
      {/* Refined Decorative Elements */}
      <div className="mesh-gradient"></div>
      <div className="dot-grid"></div>

      <div className="login-v2-wrapper">
        <header className="login-v2-nav">
          <div className="nav-brand">
            <div className="brand-icon">
              <Shield size={20} fill="currentColor" />
            </div>
            <span>Kira-Net Enterprise</span>
          </div>
          <div className="nav-links">
            <a href="#">Support</a>
            <a href="#" className="nav-lang">
              <Globe size={14} />
              <span>English (US)</span>
            </a>
          </div>
        </header>

        <main className="login-v2-main">
          <div className="login-v2-card">
            <div className="card-header">
              <h1>Sign in to Portal</h1>
              <p>Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleLogin} className="v2-form">
              {error && (
                <div className="v2-error-banner">
                  <p>{error}</p>
                </div>
              )}

              <div className="v2-input-section">
                <label>Email Address</label>
                <div className={`v2-input-box ${error ? 'error' : ''}`}>
                  <Mail className="v2-icon" size={18} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="v2-input-section">
                <div className="label-row">
                  <label>Password</label>
                  <a href="#" className="forgot-link">Forgot?</a>
                </div>
                <div className={`v2-input-box ${error ? 'error' : ''}`}>
                  <Lock className="v2-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="v2-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="v2-options">
                <label className="v2-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              <button type="submit" className="v2-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="v2-spinner" size={20} />
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="v2-divider">
              <span>or continue with</span>
            </div>

            <div className="v2-sso-grid">
              <button className="sso-btn">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" />
                <span>Google</span>
              </button>
              <button className="sso-btn">
                <img src="https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg" alt="Microsoft" />
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          <footer className="v2-page-footer">
            <div className="security-note">
              <CheckCircle2 size={14} color="#10B981" />
              <span>Secure, encrypted connection verified</span>
            </div>
            <p>© 2026 Kira-Net Inc. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LoginView;
