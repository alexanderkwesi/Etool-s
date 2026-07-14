import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  MapPin, 
  Layers, 
  TrendingUp, 
  HelpCircle, 
  ShieldAlert, 
  Coins, 
  FileText, 
  Download, 
  Printer,
  Sparkles
} from 'lucide-react';

const PitchDeck = () => {
  const [slide, setSlide] = useState(0);
  const [investment, setInvestment] = useState(50000);
  const [showTermSheet, setShowTermSheet] = useState(false);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slide]);

  const nextSlide = () => {
    setSlide((prev) => (prev < 4 ? prev + 1 : 0));
    setShowTermSheet(false);
  };

  const prevSlide = () => {
    setSlide((prev) => (prev > 0 ? prev - 1 : 4));
    setShowTermSheet(false);
  };

  const calculatedEquity = ((investment / 1000000) * 100).toFixed(1);
  const calculatedValuation = "£1,000,000";

  const renderSlideContent = () => {
    switch (slide) {
      case 0:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Users size={32} />
              </div>
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>Startup Story</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '4px' }}>Who We Are</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              We are a <strong style={{ color: 'var(--text-primary)' }}>Warrington-based</strong> small startup founded by <strong style={{ color: 'var(--text-primary)' }}>two brothers</strong>, driven by our love for modern creative and high-end business solutions. We aim to create new, innovative ways of conducting business and engaging customers through Software as a Service (SaaS) tools deemed lucrative and necessary for scaling ventures.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '4px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px', color: 'var(--secondary)' }}>EE</span>
                  The Engineer Brother
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Background in Electrical Engineering. Passionate about systems architecture, circuit design, and hardware-software low level interfaces.
                </p>
              </div>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '4px', background: 'rgba(13, 253, 205, 0.1)', borderRadius: '6px', color: 'var(--primary)' }}>CS</span>
                  The Computer Scientist Brother
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Background in Computing and Information Systems. Specialist in cloud deployments, backend API engineering, and accessibility interfaces.
                </p>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--text-muted)', border: '1px dashed var(--border-glow)', textAlign: 'center' }}>
              💡 Combined with our engineering background and an affinity for programming in multiple languages.
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                <MapPin size={32} />
              </div>
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>Current Stage</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '4px' }}>Where We Are Now</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              We are currently in the <strong style={{ color: '#fff' }}>pre-seed stage</strong>. We are looking for forward-thinking investors to invest <strong style={{ color: 'var(--primary)' }}>£50,000 for 5%</strong> of the business, alongside a business mentor who can guide us with their extensive market experience.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Funding Target</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)', margin: '8px 0' }}>£50,000</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>For 5% Equity</div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Post-money Valuation</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--secondary)', margin: '8px 0' }}>£1,000,000</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fixed valuation tier</div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prototype Status</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--success)', margin: '8px 0' }}>80% Sync</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Workable parts functional</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>🛠️ Prototype Operational Check</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Intelligent OCR metadata parsing</span>
                  <span style={{ color: 'var(--success)' }}>Active (Demo Ready)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Universal Design (Braille display Unicode converter)</span>
                  <span style={{ color: 'var(--success)' }}>Active (Demo Ready)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ CRM Integration and database CRUD syncing</span>
                  <span style={{ color: 'var(--success)' }}>Active (Demo Ready)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✗ Enterprise Multi-tenant scale and production server deploy</span>
                  <span style={{ color: 'var(--warning)' }}>Pending pre-seed funding</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Layers size={32} />
              </div>
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>Product Scope</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '4px' }}>What We're Working On</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              We are building an <strong style={{ color: 'var(--primary)' }}>AI-Powered Intelligent Document Processing (IDP)</strong> and Universal Design engine. Our platform integrates OCR extraction, document remediation comparative analysis, and CRM syncing with comprehensive accessibility features for Braille and standard devices.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#fff' }}>🤖 AI & OCR CRM Pipeline</h3>
                <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Extract key invoice & contract fields (Total, Date, Vendor) with regex and AI models.</li>
                  <li>Perform CRUD operations directly on the extracted fields.</li>
                  <li>Sync parsed metadata instantly to the CRM Contact ecosystem.</li>
                </ul>
              </div>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#fff' }}>♿ Universal Design & Accessibility</h3>
                <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Remediate unstructured documents into WCAG accessibility-compliant layouts.</li>
                  <li>Visual Braille Unicode Translation output for screen displays.</li>
                  <li>Audio announcements and Speech synthesis for visually impaired users.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px', color: 'var(--error)' }}>
                <ShieldAlert size={32} />
              </div>
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--error)', fontWeight: 'bold' }}>Current Roadblock</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '4px' }}>Where We Are Stuck</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              Our main barrier is the <strong style={{ color: 'var(--error)' }}>sourcing for funds</strong> stage. Without seed capital, we cannot transition our workable prototype into a production-level, fully compliant SaaS MVP ready for market testing and commercial sales.
            </p>

            <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--error)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#fff' }}>Impact of Funding Gap</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: 'var(--error)' }}>✕</div>
                  <div>
                    <strong>Delayed MVP:</strong> Infrastructure fees, testing, and production servers are currently unaffordable.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: 'var(--error)' }}>✕</div>
                  <div>
                    <strong>Resource Constraints:</strong> Unable to procure target hardware for testing native WebHID Braille device interactions.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: 'var(--error)' }}>✕</div>
                  <div>
                    <strong>Market Velocity:</strong> Missed early adopter testing loops and marketing pipeline creation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Coins size={32} />
              </div>
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>Call to Action</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '4px' }}>How You Can Help Us</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              You can help us move with speed and certainty by investing <strong style={{ color: 'var(--primary)' }}>£50,000 for a 5% share</strong> of the company today. This will fund our MVP development, secure core infrastructure, and enable real market validation.
            </p>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary)" />
                Investment & Equity Calculator
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Investment Amount</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>£{investment.toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="200000" 
                    step="5000" 
                    value={investment} 
                    onChange={(e) => setInvestment(parseInt(e.target.value))}
                    style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-glow)', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equity Share</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{calculatedEquity}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Company Valuation</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{calculatedValuation}</div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowTermSheet(!showTermSheet)} 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <FileText size={18} />
                  {showTermSheet ? "Hide Custom Term Sheet" : "Generate Custom Term Sheet"}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '820px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Slide Box Wrapper with Floating Scroll Arrows */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        
        {/* Left Scroll Arrow */}
        <button 
          onClick={prevSlide}
          title="Previous Slide"
          style={{
            position: 'absolute',
            left: '-24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-smooth)',
            zIndex: 5
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--secondary)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.borderColor = 'var(--secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)';
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Main Slide Card Container */}
        <div className="glass-panel" style={{ flexGrow: 1, padding: '40px', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
          {renderSlideContent()}

          {/* Navigation footer status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-glow)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Slide <strong style={{ color: 'var(--text-primary)' }}>{slide + 1}</strong> of <strong>5</strong>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={prevSlide} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glow)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glow)'}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextSlide} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glow)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glow)'}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Scroll Arrow */}
        <button 
          onClick={nextSlide}
          title="Next Slide"
          style={{
            position: 'absolute',
            right: '-24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-smooth)',
            zIndex: 5
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--secondary)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.borderColor = 'var(--secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)';
          }}
        >
          <ChevronRight size={24} />
        </button>

      </div>

      {/* Slide Navigation Indicator Pills with Arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
        {/* Left Indicator Arrow */}
        <button 
          onClick={prevSlide}
          title="Previous Slide"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[0, 1, 2, 3, 4].map((idx) => (
            <button 
              key={idx} 
              onClick={() => { setSlide(idx); setShowTermSheet(false); }}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: idx === slide ? 'var(--primary)' : 'transparent',
                border: idx === slide ? '2.5px solid var(--primary)' : '2.5px solid rgba(124, 58, 237, 0.35)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            />
          ))}
        </div>

        {/* Right Indicator Arrow */}
        <button 
          onClick={nextSlide}
          title="Next Slide"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Term Sheet Modal */}
      {showTermSheet && slide === 4 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderLeft: '4px solid var(--primary)', background: '#0a0d18' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--primary)" />
              PROPOSAL TERM SHEET (SUMMARY)
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.print()} 
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glow)', color: '#fff', fontSize: '0.8rem', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Printer size={14} style={{ marginRight: '4px' }} /> Print
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            <div>
              <strong>Issuer:</strong> ETOOL Solutions Ltd (Warrington, UK)
            </div>
            <div>
              <strong>Type of Security:</strong> Ordinary Equity Shares
            </div>
            <div>
              <strong>Valuation (Post-money):</strong> {calculatedValuation}
            </div>
            <div>
              <strong>Investment Amount:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>£{investment.toLocaleString()}</span>
            </div>
            <div>
              <strong>Equity Offered:</strong> <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{calculatedEquity}%</span>
            </div>
            <div>
              <strong>Use of Funds:</strong> 
              <ul style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>MVP System engineering (Vite/FastAPI production infrastructure) - 50%</li>
                <li>Universal accessibility WebHID testing devices - 20%</li>
                <li>Commercial marketing, pilot feedback testing - 30%</li>
              </ul>
            </div>
            <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              * This term sheet is non-binding and prepared strictly for negotiation and evaluation purposes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDeck;
