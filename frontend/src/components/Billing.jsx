import React, { useState, useEffect } from 'react';
import { paypalApi, userApi } from '../apiConfig';
import { useAuth } from '../hooks/useAuth';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Printer, 
  DollarSign,
  AlertCircle
} from 'lucide-react';

const Billing = () => {
  const { user, checkCurrentAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Checkout Modal State
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [payAddress, setPayAddress] = useState('Warrington Innovation Center, WA1 1BB');
  const [payName, setPayName] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  useEffect(() => {
    if (user) {
      setPayName(`${user.first_name} ${user.last_name}`);
      // Generate some mock history based on current plan
      generateMockInvoices(user.subscription_plan);
    }
  }, [user]);

  const generateMockInvoices = (plan) => {
    const history = [];
    if (plan === 'Standard Plan' || plan === 'Pro Plan') {
      history.push({
        id: 'INV-2026-8802',
        date: '2026-07-01',
        plan: 'Standard Plan',
        amount: '£9.99',
        status: 'Paid',
        method: 'PayPal (Sandbox)'
      });
    }
    if (plan === 'Pro Plan') {
      history.push({
        id: 'INV-2026-9041',
        date: '2026-07-13',
        plan: 'Pro Plan',
        amount: '£29.99',
        status: 'Paid',
        method: 'PayPal (Sandbox)'
      });
    }
    setInvoiceHistory(history);
  };

  const handleSelectPlan = async (planName) => {
    if (planName === 'Begin Plan') {
      // Simulate downgrading directly
      try {
        setLoading(true);
        // Call backend or mock direct update
        await paypalApi.executePayment("MOCK-FREE-DOWNGRADE", "Begin Plan");
        await checkCurrentAuth();
        alert("Downgraded to Begin Plan.");
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setSelectedPlan(planName);
      const res = await paypalApi.createOrder(planName);
      if (res.status === 200) {
        setCheckoutOrder(res);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!checkoutOrder) return;
    try {
      setLoading(true);
      const res = await paypalApi.executePayment(checkoutOrder.orderID, selectedPlan);
      if (res.status === 200) {
        setPaymentSuccess(true);
        await checkCurrentAuth();
        setTimeout(() => {
          setCheckoutOrder(null);
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Current plan banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.01)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: '4px solid var(--primary)'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Account Tier</span>
          <h2 style={{ fontSize: '1.25rem', marginTop: '4px' }}>
            Current Level: <strong style={{ color: 'var(--primary)' }}>{user?.subscription_plan || 'Begin Plan'}</strong>
          </h2>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Renews: <strong style={{ color: '#fff' }}>2026-08-14</strong>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Tier 1 */}
        <div className="glass-panel" style={{
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px',
          border: user?.subscription_plan === 'Begin Plan' ? '2px solid var(--text-muted)' : '1px solid var(--border-glow)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Begin Plan</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>For hobbyists testing the environment.</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>£0 <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ month</span></div>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> 5 documents per month</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Basic OCR metadata parsing</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Visual Braille output preview</li>
            </ul>
          </div>
          
          <button 
            disabled={user?.subscription_plan === 'Begin Plan' || loading}
            onClick={() => handleSelectPlan('Begin Plan')}
            className="btn btn-outline" 
            style={{ width: '100%', marginTop: '24px' }}
          >
            {user?.subscription_plan === 'Begin Plan' ? 'Currently Active' : 'Downgrade'}
          </button>
        </div>

        {/* Tier 2 */}
        <div className="glass-panel" style={{
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px',
          border: user?.subscription_plan === 'Standard Plan' ? '2px solid var(--secondary)' : '1px solid var(--border-glow)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Standard Plan</h3>
              <span style={{ fontSize: '0.7rem', background: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>POPULAR</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>For professional developers & engineers.</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>£9.99 <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ month</span></div>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> 150 documents per month</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Full CRM sync pipeline</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> WCAG compliance remediation</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Text-to-Speech audio support</li>
            </ul>
          </div>
          
          <button 
            disabled={user?.subscription_plan === 'Standard Plan' || loading}
            onClick={() => handleSelectPlan('Standard Plan')}
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '24px' }}
          >
            {user?.subscription_plan === 'Standard Plan' ? 'Currently Active' : 'Upgrade Plan'}
          </button>
        </div>

        {/* Tier 3 */}
        <div className="glass-panel" style={{
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px',
          border: user?.subscription_plan === 'Pro Plan' ? '2px solid var(--primary)' : '1px solid var(--border-glow)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Pro Plan</h3>
              <span style={{ fontSize: '0.7rem', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>UNLIMITED</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>For large scaling enterprise operations.</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>£29.99 <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ month</span></div>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Unlimited document processing</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Role-based team member control</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> Priority database audit trails</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="var(--primary)" /> WebHID active hardware link</li>
            </ul>
          </div>
          
          <button 
            disabled={user?.subscription_plan === 'Pro Plan' || loading}
            onClick={() => handleSelectPlan('Pro Plan')}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '24px' }}
          >
            {user?.subscription_plan === 'Pro Plan' ? 'Currently Active' : 'Upgrade Plan'}
          </button>
        </div>

      </div>

      {/* Simulated PayPal checkout Drawer/Modal */}
      {checkoutOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3,7,18,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '30px', maxWidth: '460px', width: '100%', background: '#0a0e1b', border: '1px solid rgba(255,255,255,0.15)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>PayPal Sandbox Checkout</h3>
              </div>
              <button 
                onClick={() => setCheckoutOrder(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {paymentSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '30px 0', textAlign: 'center' }}>
                <Check size={48} color="var(--success)" className="pulse-glow" />
                <h4 style={{ color: 'var(--success)' }}>Transaction Approved!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Upgraded successfully. Refreshing user profile context...
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Plan Upgrade Target:</span>
                    <strong>{selectedPlan}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Order Reference:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{checkoutOrder.orderID}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glow)', paddingTop: '6px', fontWeight: 'bold' }}>
                    <span>Amount Due:</span>
                    <span style={{ color: 'var(--primary)' }}>{checkoutOrder.currency} {checkoutOrder.amount}</span>
                  </div>
                </div>

                {/* Sandbox Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Buyer Name</label>
                    <input value={payName} onChange={(e) => setPayName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Billing Address</label>
                    <input value={payAddress} onChange={(e) => setPayAddress(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glow)', paddingTop: '16px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setCheckoutOrder(null)} 
                    className="btn btn-outline" 
                    style={{ flexGrow: 1 }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApprovePayment}
                    className="btn btn-primary" 
                    style={{ flexGrow: 1 }}
                  >
                    Approve Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice list */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Invoice Records</h3>
        
        {invoiceHistory.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glow)' }}>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Invoice ID</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Plan Tier</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Payment Method</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoiceHistory.map((invoice, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-glow)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{invoice.id}</td>
                  <td style={{ padding: '12px' }}>{invoice.date}</td>
                  <td style={{ padding: '12px' }}>{invoice.plan}</td>
                  <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>{invoice.amount}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{invoice.method}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '2px 6px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
            No invoice records found in free tier.
          </div>
        )}
      </div>

    </div>
  );
};

export default Billing;
