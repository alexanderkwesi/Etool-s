import React, { useState, useEffect } from 'react';
import { userApi, dashboardApi } from '../apiConfig';
import { useAuth } from '../hooks/useAuth';
import { 
  ShieldCheck, 
  User, 
  Settings, 
  QrCode, 
  Check, 
  Lock, 
  RefreshCw, 
  FileText
} from 'lucide-react';

const Security = () => {
  const { user, updateCategorySetup, checkCurrentAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    companyName: '',
    jobTitle: '',
    userType: 'Computing and CIS',
    teamSize: 1
  });

  // 2FA state
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [totpSecret, setTotpSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showQrPanel, setShowQrPanel] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Audit trail
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        companyName: user.company_name || '',
        jobTitle: user.job_title || '',
        userType: user.user_type || 'Computing and CIS',
        teamSize: user.team_size || 1
      });
      setOtpEnabled(user.otp_enabled || false);
      fetchAuditLogs();
    }
  }, [user]);

  const fetchAuditLogs = async () => {
    try {
      const res = await dashboardApi.getStats();
      if (res.status === 200) {
        setAuditLogs(res.stats.recent_activity || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await updateCategorySetup(profileData);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle 2FA switch
  const handleToggle2FA = async () => {
    if (otpEnabled) {
      // Disable 2FA
      if (!window.confirm("Are you sure you want to disable 2FA?")) return;
      try {
        setLoading(true);
        const res = await userApi.disable2fa();
        if (res.status === 200) {
          setOtpEnabled(false);
          await checkCurrentAuth();
          fetchAuditLogs();
        }
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Enable 2FA - fetch QR code
      try {
        setLoading(true);
        setVerifyError('');
        const res = await userApi.enable2fa();
        if (res.status === 200) {
          setQrCodeData(res.qr_code);
          setTotpSecret(res.secret);
          setShowQrPanel(true);
        }
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    try {
      setLoading(true);
      setVerifyError('');
      const res = await userApi.confirm2fa(verifyCode);
      if (res.status === 200) {
        setVerifySuccess(true);
        setOtpEnabled(true);
        await checkCurrentAuth();
        fetchAuditLogs();
        setTimeout(() => {
          setShowQrPanel(false);
          setVerifyCode('');
          setVerifySuccess(false);
        }, 1500);
      }
    } catch (err) {
      setVerifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px' }}>
      
      {/* Left Column: Account Settings & 2FA toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary)" />
            Professional Category Settings
          </h3>
          
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Company Name</label>
              <input name="companyName" value={profileData.companyName} onChange={handleProfileChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Job Title</label>
              <input name="jobTitle" value={profileData.jobTitle} onChange={handleProfileChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Profession Area</label>
              <select name="userType" value={profileData.userType} onChange={handleProfileChange}>
                <option value="Computing and CIS">Computing and CIS</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Executive Management">Executive Management</option>
                <option value="Independent Investor">Independent Investor</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Team Size</label>
              <input type="number" name="teamSize" min="1" max="100" value={profileData.teamSize} onChange={handleProfileChange} />
            </div>
            
            <button type="submit" disabled={profileLoading} className="btn btn-primary" style={{ marginTop: '8px' }}>
              {profileLoading ? "Saving Profile..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* 2FA Configuration */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="var(--secondary)" />
            Two-Factor Auth (2FA)
          </h3>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Strengthen your workspace security by requiring a 2FA token on login.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(255,255,255,0.01)',
            borderRadius: '8px',
            border: '1px solid var(--border-glow)'
          }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>Authenticator 2FA Code</strong>
              <span style={{ fontSize: '0.75rem', color: otpEnabled ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                {otpEnabled ? "Active & Protected" : "Disabled"}
              </span>
            </div>
            <button 
              disabled={loading}
              onClick={handleToggle2FA}
              className={otpEnabled ? "btn btn-outline" : "btn btn-secondary"}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              {otpEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: 2FA Setup Panel or Audit trail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {showQrPanel ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: '4px solid var(--primary)', background: '#0a0d18' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={20} color="var(--primary)" />
              Setup Google Authenticator
            </h3>
            
            {verifySuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '30px 0', textAlign: 'center' }}>
                <Check size={40} color="var(--success)" className="pulse-glow" />
                <h4 style={{ color: 'var(--success)' }}>2FA Enabled Successfully!</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Your workspace is now securely protected.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Scan the QR code below using your Google Authenticator or Microsoft Authenticator app, then enter the 6-digit confirmation token.
                </p>
                
                {qrCodeData && (
                  <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', border: '4px solid var(--border-glow)' }}>
                    <img src={qrCodeData} alt="Google Authenticator QR code" style={{ width: '180px', height: '180px', display: 'block' }} />
                  </div>
                )}
                
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Manual key secret</span>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px', marginTop: '4px', fontFamily: 'monospace', color: 'var(--secondary)' }}>
                    {totpSecret}
                  </div>
                </div>

                <form onSubmit={handleConfirm2FA} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit code" 
                      maxLength="6"
                      required
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      style={{ textAlign: 'center', letterSpacing: '3px', fontWeight: 'bold', fontSize: '1.1rem' }}
                    />
                  </div>
                  {verifyError && (
                    <div style={{ color: '#f87171', fontSize: '0.75rem', textAlign: 'center' }}>
                      ✕ {verifyError}
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                    Verify & Confirm
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" />
                Audit Logs & Actions History
              </h3>
              <button onClick={fetchAuditLogs} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {auditLogs.length > 0 ? (
                auditLogs.map((log, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#fff' }}>{log.action}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{log.details}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                  No security activities found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Security;
