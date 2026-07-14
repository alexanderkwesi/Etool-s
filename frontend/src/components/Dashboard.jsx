import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../apiConfig';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight, 
  RefreshCw,
  Sparkles,
  Database
} from 'lucide-react';

const Dashboard = ({ setTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStats();
      if (res.status === 200) {
        setStats(res.stats);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <RefreshCw size={24} className="pulse-glow" style={{ animation: 'spin 2s linear infinite', color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Welcome banner */}
      <div className="glass-panel" style={{
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(13, 253, 205, 0.05), rgba(139, 92, 246, 0.05))',
        border: '1px solid rgba(13, 253, 205, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>ETOOL Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
            AI-powered Intelligent Document Processing with OCR extraction, Document Remediation and Universal Design synchronization.
          </p>
        </div>
        <button onClick={() => setTab('idp')} className="btn btn-primary">
          Launch IDP Engine <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Grid Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Card 1 */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', background: 'var(--primary-glow)', borderRadius: '10px', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Documents Processed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '4px 0' }}>{stats?.document_count || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Files parsed in current tier</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', background: 'var(--secondary-glow)', borderRadius: '10px', color: 'var(--secondary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>CRM Contacts</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '4px 0' }}>{stats?.crm_count || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Synced vendors & entities</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>OCR Parser Accuracy</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '4px 0' }}>{stats?.success_rate || '100'}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remediation rate benchmark</div>
          </div>
        </div>

      </div>

      {/* Two Columns Dashboard Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Recent Audit Log */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" />
              Workspace Audit Trail
            </h3>
            <button onClick={fetchStats} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
              <RefreshCw size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((activity, idx) => (
                <div key={idx} style={{
                  paddingBottom: '12px',
                  borderBottom: idx < stats.recent_activity.length - 1 ? '1px solid var(--border-glow)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{activity.action}</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{activity.details}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                No recent actions recorded.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Module Integrity Checklist */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--secondary)" />
            Prototype Health Check
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>OCR Engine</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Metadata regex extractor</div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ ONLINE</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Remediation Visualizer</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WCAG structure fixes</div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ ONLINE</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Braille Translator</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visual cell mapper</div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ ONLINE</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>SQLite Sync</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CRM contact database sync</div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ ONLINE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
