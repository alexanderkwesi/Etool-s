import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  FileSearch, 
  Accessibility, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Presentation, 
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass
} from 'lucide-react';

const Layout = ({ currentTab, setTab, children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigationItems = [
    { id: 'landing', name: 'Product Home', icon: Compass, public: true },
    { id: 'pitch', name: 'Pitch Presentation', icon: Presentation, public: true },
    { id: 'dashboard', name: 'Workspace Stats', icon: LayoutDashboard, authRequired: true },
    { id: 'idp', name: 'IDP & OCR Engine', icon: FileSearch, authRequired: true },
    { id: 'braille', name: 'Universal Design', icon: Accessibility, authRequired: true },
    { id: 'crm', name: 'CRM Database Sync', icon: Users, authRequired: true },
    { id: 'billing', name: 'Billing & Checkout', icon: CreditCard, authRequired: true },
    { id: 'security', name: 'Profile & Security', icon: ShieldCheck, authRequired: true },
  ];

  const handleNavClick = (id) => {
    setTab(id);
    setMobileOpen(false);
  };

  const activePlanBadge = () => {
    if (!user) return null;
    const plan = user.subscription_plan || 'Begin Plan';
    let bgStyle = 'rgba(0, 0, 0, 0.04)';
    let color = 'var(--text-secondary)';
    
    if (plan === 'Standard Plan') {
      bgStyle = 'rgba(124, 58, 237, 0.08)';
      color = 'var(--secondary)';
    } else if (plan === 'Pro Plan') {
      bgStyle = 'rgba(234, 179, 8, 0.08)';
      color = 'var(--primary)';
    }
    
    return (
      <span 
        style={{
          background: bgStyle, 
          color: color, 
          padding: '4px 10px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: 'bold',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          border: `1px solid ${color}44`
        }}
      >
        <Sparkles size={12} /> {plan}
      </span>
    );
  };

  return (
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Main Workspace Frame */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header bar */}
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--border-glow)',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-header)',
          backdropFilter: 'blur(8px)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {navigationItems.find(n => n.id === currentTab)?.name || 'ETOOL Redesign'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.first_name}</strong>
              </div>
            )}
            <div style={{ fontSize: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-glow)', padding: '6px 12px', borderRadius: '6px', color: 'var(--text-muted)' }}>
              Server: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>● ONLINE</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content area */}
        <main className="main-content" style={{ flexGrow: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Sidebar Desktop on the Right (White, Yellow, Purple, Red Theme) */}
      <aside style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderLeft: '1px solid rgba(148, 163, 184, 0.12)',
        justifyContent: 'space-between',
        background: '#ffffff', // White base
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.02)'
      }}>
        <div>
          {/* Logo Area on White Background with Yellow border */}
          <div 
            onClick={() => setTab('landing')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              marginBottom: '32px', 
              padding: '8px 16px', 
              cursor: 'pointer',
              background: '#ffffff',
              border: '2px solid var(--primary)', // Yellow
              borderRadius: '24px',
              boxShadow: '0 2px 10px rgba(234, 179, 8, 0.12)'
            }}
          >
            <Logo size={26} />
            <span style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: '#0f172a' }}>
              DocRevisor
            </span>
          </div>

          {/* Nav list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navigationItems.map((item) => {
              if (item.authRequired && !user) return null;
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(124, 58, 237, 0.05)' : 'transparent', // Purple tint active bg
                    border: isActive ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid transparent',
                    borderLeft: isActive ? '4px solid var(--primary)' : '1px solid transparent', // Yellow border indicator
                    color: isActive ? 'var(--secondary)' : 'var(--text-secondary)', // Purple active text
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    if(!isActive) {
                      e.currentTarget.style.color = 'var(--secondary)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if(!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile / login link footer */}
        <div style={{
          padding: '16px 8px',
          borderTop: '1px solid var(--border-glow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--secondary)', // Purple
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}>
                  {user.first_name[0].toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {activePlanBadge()}
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    color: 'var(--error)', // Red
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--error)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                    e.currentTarget.style.color = 'var(--error)';
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))', // Purple to Yellow
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
              }}
            >
              Sign In to Workspace
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Layout;
