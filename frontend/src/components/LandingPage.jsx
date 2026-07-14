import React from 'react';
import Logo from './Logo';
import { 
  ArrowRight, 
  Presentation, 
  FileText, 
  Sparkles, 
  Database, 
  Accessibility, 
  ShieldCheck, 
  Users,
  Compass,
  TrendingUp,
  AlertTriangle,
  Award,
  PieChart,
  HelpCircle
} from 'lucide-react';

const LandingPage = ({ setTab }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px', maxWidth: '1020px', margin: '0 auto' }}>
      
      {/* Top Navbar Header in Landing */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', width: '100%', padding: '10px 0' }}>
        {/* Logo Area placed on a white background pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '8px 20px',
          borderRadius: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          cursor: 'pointer'
        }}
          onClick={() => setTab('landing')}
        >
          <Logo size={28} />
          <span style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-title)', letterSpacing: '0.5px', color: '#0f172a' }}>
            DocRevisor <span style={{ color: 'var(--secondary)', fontSize: '0.75rem', verticalAlign: 'super', fontWeight: 'bold' }}>SaaS</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setTab('pitch')} 
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: 'rgba(0,0,0,0.08)', color: 'var(--text-secondary)' }}
          >
            <Presentation size={14} /> Pitch Deck
          </button>
          <button 
            onClick={() => setTab('login')} 
            className="btn btn-primary"
            style={{ 
              padding: '8px 18px', 
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, var(--secondary), var(--error))',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px'
      }}>
        {/* Animated Badge */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.06)',
          color: 'var(--secondary)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} color="var(--primary)" />
          SEIS-Ready Investment Opportunity • Warrington
        </div>

        {/* Hero Title & Subtext wrapper - PLACED ON WHITE BACKGROUND CONTAINER */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '40px 30px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
          maxWidth: '880px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            lineHeight: '1.25',
            fontFamily: 'var(--font-title)',
            color: '#0f172a',
            maxWidth: '800px'
          }}>
            Redefining Intelligent Document Processing with <span style={{
              background: 'var(--primary)',
              color: '#0f172a',
              padding: '2px 14px',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(234, 179, 8, 0.25)',
              display: 'inline-block',
              marginLeft: '6px'
            }}>DocRevisor</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: '1.6'
          }}>
            A CRM-native vertical IDP platform that extracts scanner attachments, remediates file WCAG code, and syncs databases with assistive screen reader outputs.
          </p>
        </div>

        {/* CTA Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button 
            onClick={() => setTab('login')} 
            className="btn btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary), var(--error))',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)'
            }}
          >
            Launch Workspace <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => setTab('pitch')} 
            className="btn btn-outline"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'var(--text-secondary)' }}
          >
            Request Full Pitch Deck
          </button>
        </div>
      </section>

      {/* Market Metrics Row (Previous ETOOL Home Page Content) */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        width: '100%'
      }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Projected Year 1 ARR</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary)', margin: '6px 0' }}>£72k</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on pipeline discussions</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Users (24 Mo.)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', margin: '6px 0' }}>5,000+</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>B2B & B2C SaaS models</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>OCR Parsing Accuracy</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)', margin: '6px 0' }}>99.8%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI-trained parser regex</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Global Market TAM</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--error)', margin: '6px 0' }}>£40B+</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>IDP & accessibility verticals</div>
        </div>
      </section>

      {/* Problem vs Solution Comparison Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--error)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
            <AlertTriangle size={18} />
            The Problem: Unstructured Lost Productivity
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            CRM ecosystems are flooded with unstructured PDFs, scanned images, and inaccessible documents. Sales and admin teams waste over 80% of productivity on manual document transcription. Existing IDP solutions are expensive, complex to deploy, and do not natively support accessibility formats.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
            <Sparkles size={18} />
            The Solution: CRM-Native IDP
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            DocRevisor embeds directly into Salesforce, HubSpot, and Dynamics databases. One click parses unstructured attachments, resolves layout heading outlines for WCAG compliance, and updates CRM grid records. No middleware, exports, or training data required.
          </p>
        </div>
      </section>

      {/* Competitive Edge: Why DocRevisor beats AWS & Google */}
      <section className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="var(--primary)" />
          Why We Beat AWS & Google
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '0.85rem', lineHeight: '1.6' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--error)' }}>AWS Textract & Google Cloud Document AI</h4>
            <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Generic horizontal API platforms that require custom middleware.</li>
              <li>Development cycles require complex, long database configurations.</li>
              <li>High total cost of ownership with complex volumemetric pricing.</li>
              <li>Do not provide native document WCAG visual remediation outputs.</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--success)' }}>DocRevisor IDP Workspace</h4>
            <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>CRM-native vertical application: installs and runs immediately.</li>
              <li>10x faster execution: parses document data directly inside your CRM.</li>
              <li>Universal accessibility: visual Braille dot and TTS engines built-in.</li>
              <li>5x lower total cost of ownership: simple seat subscription model.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Onboarding Founder Roadmap & Use of Funds */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '30px', alignItems: 'center' }}>
        
        {/* Onboarding Timeline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--secondary)" />
            Graduate Visa → Innovator Founder Roadmap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem', position: 'relative' }}>
            <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--secondary)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} />
              <strong>2024: Solo Prototype Ready</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Closed 3 pre-pilot discussions with UK enterprises. Developed core OCR and Braille translators.</div>
            </div>
            <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--secondary)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} />
              <strong>Q3 2026: Pre-Seed Raise (£50k)</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Current stage. Securing funding to move to Innovator Founder visa status, and launch standard MVP.</div>
            </div>
            <div style={{ paddingLeft: '20px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border-glow)' }} />
              <strong>Q4 2026: Beta Market Launch</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Initiating pilot programs and testing B2B CRM pipeline integrations in Manchester tech circle.</div>
            </div>
          </div>
        </div>

        {/* Use of funds pie layout */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} color="var(--primary)" />
            Use of Funds
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>💻 MVP Development</span>
              <strong>60%</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px' }}>
              <div style={{ width: '60%', height: '100%', background: 'var(--secondary)' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🚀 Enterprise Pilots</span>
              <strong>25%</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px' }}>
              <div style={{ width: '25%', height: '100%', background: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>⚖️ SEIS & Compliance</span>
              <strong>10%</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px' }}>
              <div style={{ width: '10%', height: '100%', background: 'var(--error)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>⚙️ Operations</span>
              <strong>5%</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px' }}>
              <div style={{ width: '5%', height: '100%', background: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

      </section>

      {/* Simple security announcement */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '30px', borderTop: '1px solid var(--border-glow)', paddingTop: '40px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--success)" /> Verified 2FA Session Security
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} color="var(--secondary)" /> Warrington WA1 Innovation Center
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
