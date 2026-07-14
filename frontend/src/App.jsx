import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import PitchDeck from './components/PitchDeck';
import Dashboard from './components/Dashboard';
import IDPEngine from './components/IDPEngine';
import BrailleTTS from './components/BrailleTTS';
import CRMSync from './components/CRMSync';
import Billing from './components/Billing';
import Security from './components/Security';
import LandingPage from './components/LandingPage';
import { Sparkles, Key, Lock, ArrowRight, UserPlus, LogIn, Laptop } from 'lucide-react';

const AppContent = () => {
  const { user, loading, login, signup, verify2fa, updateCategorySetup } = useAuth();
  const [currentTab, setTab] = useState('landing'); // default tab is public landing page
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // 2FA login state
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Category Setup State
  const [categoryData, setCategoryData] = useState({
    companyName: '',
    jobTitle: '',
    userType: 'Computing and CIS',
    teamSize: 1
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.twoFactorRequired) {
          setTwoFactorRequired(true);
          setTwoFactorEmail(res.email);
        } else {
          setTab('dashboard'); // go to dashboard on login success
        }
      } else {
        await signup(firstName, lastName, email, password);
        setTab('dashboard'); // go to dashboard on signup success
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handle2FAVerifySubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await verify2fa(twoFactorEmail, twoFactorCode);
      setTwoFactorRequired(false);
      setTab('dashboard');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategorySetup(categoryData);
    } catch (err) {
      alert(err.message);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-deep)' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(13, 253, 205, 0.1)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite'
        }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '1px' }} className="pulse-glow">
          CONNECTING SECURE PLATFORM MODULES...
        </span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // 2. Unauthenticated View (Login / Signup)
  if (!user && (currentTab === 'login' || currentTab === 'signup')) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '440px', width: '100%' }}>
          
          {/* Logo / Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#070913',
              fontSize: '1.4rem',
              boxShadow: '0 0 15px var(--primary-glow)',
              marginBottom: '12px'
            }}>ET</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ETOOL Portal</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Intelligent Document Processing & Accessibility
            </p>
          </div>

          {twoFactorRequired ? (
            // 2FA Verification code during login
            <form onSubmit={handle2FAVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Lock size={18} color="var(--primary)" /> Two-Factor Verification
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  A security token is required. Enter the 6-digit code from your authenticator app below.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  maxLength="6"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold', fontSize: '1.25rem' }}
                />
              </div>

              {authError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>
                  ✕ {authError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Verify & Log In
              </button>
            </form>
          ) : (
            // Standard Login / Signup Forms
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glow)' }}>
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setTab('login'); }}
                  style={{
                    flexGrow: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    background: isLogin ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: 'none',
                    color: isLogin ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setTab('signup'); }}
                  style={{
                    flexGrow: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    background: !isLogin ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: 'none',
                    color: !isLogin ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  Create Account
                </button>
              </div>

              {!isLogin && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              )}

              <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
              
              <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />

              {authError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>
                  ✕ {authError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                {isLogin ? "Sign In to Workspace" : "Register Account"}
              </button>

              {/* Mock Google Auth simulator */}
              <button
                type="button"
                onClick={async () => {
                  setEmail('alex.kwesi@etool.com');
                  setPassword('password123');
                  setIsLogin(true);
                }}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '4px' }}
              >
                <Laptop size={16} /> Load Demo Account
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTab('pitch')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  ← Back to Pitch Presentation
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    );
  }

  // If user navigated to login/signup tabs but is already authenticated, force tab back to dashboard
  if (user && (currentTab === 'login' || currentTab === 'signup')) {
    setTab('dashboard');
  }

  // 3. Category Setup Onboarding Dialog (If profile details not finished)
  const isProfileSetupFinished = user && user.company_name && user.job_title && user.user_type;
  if (user && !isProfileSetupFinished) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '480px', width: '100%', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem' }}>Profile Category Setup</h2>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            To tailor your ETOOL workspace, please complete your category onboarding. Specify whether you focus on Electrical Engineering or Computing.
          </p>

          <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Company Name</label>
              <input 
                placeholder="e.g. Warrington Design Group" 
                required 
                value={categoryData.companyName}
                onChange={(e) => setCategoryData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Job Title</label>
              <input 
                placeholder="e.g. Senior Computing Specialist" 
                required 
                value={categoryData.jobTitle}
                onChange={(e) => setCategoryData(prev => ({ ...prev, jobTitle: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Core Specialization</label>
              <select 
                value={categoryData.userType}
                onChange={(e) => setCategoryData(prev => ({ ...prev, userType: e.target.value }))}
              >
                <option value="Computing and CIS">Computing and CIS Specialist</option>
                <option value="Electrical Engineering">Electrical Engineer</option>
                <option value="Independent Investor">Independent Investor / Guide</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Team Size</label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                required
                value={categoryData.teamSize}
                onChange={(e) => setCategoryData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Complete Onboarding <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Authenticated View (Main Dashboard & App Tabs)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage setTab={setTab} />;
      case 'pitch':
        return <PitchDeck />;
      case 'dashboard':
        return <Dashboard setTab={setTab} />;
      case 'idp':
        return <IDPEngine />;
      case 'braille':
        return <BrailleTTS />;
      case 'crm':
        return <CRMSync />;
      case 'billing':
        return <Billing />;
      case 'security':
        return <Security />;
      default:
        return <LandingPage setTab={setTab} />;
    }
  };

  return (
    <Layout currentTab={currentTab} setTab={setTab}>
      {renderTabContent()}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
