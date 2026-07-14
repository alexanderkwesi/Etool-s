import React, { useState, useEffect } from 'react';
import { ocrApi } from '../apiConfig';
import { 
  FileText, 
  UploadCloud, 
  RefreshCw, 
  Trash2, 
  Database, 
  Check, 
  AlertCircle,
  Eye,
  Accessibility
} from 'lucide-react';

const IDPEngine = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [remediationTab, setRemediationTab] = useState('remediated'); // remediated vs comparison

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await ocrApi.getProcessed();
      if (res.status === 200) {
        setDocuments(res.documents);
        if (res.documents.length > 0 && !selectedDoc) {
          setSelectedDoc(res.documents[0]);
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      const res = await ocrApi.process(file);
      if (res.status === 200) {
        setDocuments(prev => [res.document, ...prev]);
        setSelectedDoc(res.document);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const loadSimulatedTemplate = async (templateName) => {
    try {
      setProcessing(true);
      setError(null);
      // Create a mock File object
      const blob = new Blob(["Simulated template payload"], { type: "text/plain" });
      const file = new File([blob], `${templateName}.txt`, { type: "text/plain" });
      
      const res = await ocrApi.process(file);
      if (res.status === 200) {
        setDocuments(prev => [res.document, ...prev]);
        setSelectedDoc(res.document);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await ocrApi.deleteProcessed(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDoc?.id === id) {
        setSelectedDoc(documents.find(d => d.id !== id) || null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const syncToCrm = async (id) => {
    try {
      setError(null);
      const res = await ocrApi.linkCrm(id);
      if (res.status === 200) {
        alert("Synced successfully to CRM Contacts!");
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, synced_to_crm: true } : d));
        if (selectedDoc?.id === id) {
          setSelectedDoc(prev => ({ ...prev, synced_to_crm: true }));
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper to generate comparative Remediation HTML
  const getRemediationCodes = (type) => {
    if (type === 'Invoice' || type === 'Receipt') {
      return {
        before: `<div style="font-size: 12px; color: #888">
  <table border="0">
    <tr>
      <td><b>Invoice INV-2026-081</b></td>
    </tr>
  </table>
  <img src="logo.png">  <!-- WCAG Alert: Missing alt text -->
  <font color="red">Total Due: £1,250.00</font> <!-- WCAG Alert: Inaccessible contrast -->
</div>`,
        after: `<div style="font-size: 14px; color: var(--text-primary)" role="region" aria-label="Invoice Summary">
  <header style="margin-bottom: 12px">
    <h3 style="font-size: 1.25rem">Invoice <span aria-label="Invoice Number">INV-2026-081</span></h3>
  </header>
  <img src="logo.png" alt="Company Logo" style="max-height: 40px" />
  <div style="margin-top: 16px; font-weight: bold; color: var(--primary)" aria-live="polite">
    Total Due: £1,250.00
  </div>
</div>`
      };
    } else if (type === 'Contract') {
      return {
        before: `<div>
  <b>Mutual NDA</b>
  <p>This is a legal document between Party A and B...</p>
  <!-- WCAG Alert: Missing heading tags and outline structure -->
  <button onclick="sign()">Click Here</button> <!-- WCAG Alert: Vague screen reader label -->
</div>`,
        after: `<section aria-labelledby="nda-heading">
  <h3 id="nda-heading" style="font-size: 1.25rem; margin-bottom: 12px">Mutual Non-Disclosure Agreement</h3>
  <p style="color: var(--text-secondary); line-height: 1.6">
    This is a legal document between Party A and B...
  </p>
  <button class="btn btn-primary" onclick="sign()" aria-label="Sign Mutual NDA Agreement">
    Sign Agreement
  </button>
</section>`
      };
    } else {
      return {
        before: `<div>
  <b>Tech Spec</b>
  <!-- WCAG Alert: Bad contrast, missing structures -->
  <span style="color:#444">1. Yield: 355MPa</span>
</div>`,
        after: `<section aria-labelledby="spec-heading">
  <h3 id="spec-heading" style="font-size: 1.25rem; margin-bottom: 12px">Technical Specification</h3>
  <ul style="list-style-type: square; padding-left: 20px; display: flex; flexDirection: column; gap: 8px">
    <li><strong style="color: var(--text-primary)">Yield Strength:</strong> 355 MPa</li>
  </ul>
</section>`
      };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}>
      
      {/* Left Column: List and Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '5px' }}>
        
        {/* Upload Zone */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>OCR File Uploader</h3>
          
          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '24px',
            border: '2px dashed var(--border-glow)',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.01)',
            transition: 'var(--transition-smooth)'
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glow)'}
          >
            <UploadCloud size={32} color={processing ? "var(--secondary)" : "var(--primary)"} className={processing ? "pulse-glow" : ""} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {processing ? "Extracting metadata..." : "Click or Drop Document"}
            </span>
            <input type="file" onChange={handleFileUpload} disabled={processing} style={{ display: 'none' }} />
          </label>

          {/* Quick template triggers */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Or load prototype templates:</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => loadSimulatedTemplate('invoice_sample')} disabled={processing} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Invoice
              </button>
              <button onClick={() => loadSimulatedTemplate('contract_nda')} disabled={processing} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                NDA Contract
              </button>
              <button onClick={() => loadSimulatedTemplate('technical_spec')} disabled={processing} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Tech Spec
              </button>
            </div>
          </div>
        </div>

        {/* Processed Files List */}
        <div className="glass-panel" style={{ padding: '20px', flexGrow: 1 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Processed Documents</h3>
          
          {loading && documents.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading documents...</div>
          ) : documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedDoc?.id === doc.id ? 'var(--primary)' : 'var(--border-glow)',
                    background: selectedDoc?.id === doc.id ? 'rgba(13, 253, 205, 0.05)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={16} color="var(--primary)" />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {doc.file_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.file_type} • {doc.vendor}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px' }}>
              No processed documents. Upload a file above.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Detailed OCR & Remediation comparative window */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        {selectedDoc ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>
                  OCR EXTRACED SCHEMAS
                </span>
                <h2 style={{ fontSize: '1.25rem', marginTop: '4px' }}>{selectedDoc.file_name}</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => syncToCrm(selectedDoc.id)}
                  disabled={selectedDoc.synced_to_crm}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <Database size={14} />
                  {selectedDoc.synced_to_crm ? "Synced" : "Sync to CRM"}
                </button>
              </div>
            </div>

            {/* Extracted Fields Metadata grid */}
            <div className="glass-card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Document Type:</span>
                <strong style={{ color: '#fff', marginLeft: '6px' }}>{selectedDoc.file_type}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vendor / Party Name:</span>
                <strong style={{ color: '#fff', marginLeft: '6px' }}>{selectedDoc.vendor}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Reference Code:</span>
                <strong style={{ color: '#fff', marginLeft: '6px' }}>{selectedDoc.reference_number}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                <strong style={{ color: '#fff', marginLeft: '6px' }}>{selectedDoc.date_issued}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Value / Cost:</span>
                <strong style={{ color: 'var(--primary)', marginLeft: '6px' }}>
                  {selectedDoc.currency} {selectedDoc.amount.toFixed(2)}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                {selectedDoc.synced_to_crm ? (
                  <span style={{ color: 'var(--success)', marginLeft: '6px', fontWeight: 'bold' }}>✓ Synced</span>
                ) : (
                  <span style={{ color: 'var(--warning)', marginLeft: '6px', fontWeight: 'bold' }}>Pending Sync</span>
                )}
              </div>
            </div>

            {/* Document Remediation Tab Controller */}
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-glow)' }}>
                <button 
                  onClick={() => setRemediationTab('remediated')}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    color: remediationTab === 'remediated' ? 'var(--primary)' : 'var(--text-secondary)',
                    borderBottom: remediationTab === 'remediated' ? '2px solid var(--primary)' : 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                >
                  Document Remediation
                </button>
                <button 
                  onClick={() => setRemediationTab('comparison')}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    color: remediationTab === 'comparison' ? 'var(--primary)' : 'var(--text-secondary)',
                    borderBottom: remediationTab === 'comparison' ? '2px solid var(--primary)' : 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                >
                  Remediation Comparative Visualizer
                </button>
              </div>

              {remediationTab === 'remediated' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Raw Extracted File Text Preview:</h3>
                  <pre style={{
                    background: 'rgba(15,23,42,0.4)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-glow)'
                  }}>{selectedDoc.raw_text}</pre>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Before WCAG */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--error)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} />
                      Unstructured Before (Inaccessible)
                    </h4>
                    <pre style={{
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#f87171',
                      overflowX: 'auto',
                      maxHeight: '240px'
                    }}>
                      {getRemediationCodes(selectedDoc.file_type).before}
                    </pre>
                  </div>
                  {/* After WCAG */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Accessibility size={14} />
                      Remediated After (WCAG Compliant)
                    </h4>
                    <pre style={{
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#34d399',
                      overflowX: 'auto',
                      maxHeight: '240px'
                    }}>
                      {getRemediationCodes(selectedDoc.file_type).after}
                    </pre>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No document selected. Upload or select a processed document to view details.
          </div>
        )}
      </div>

    </div>
  );
};

export default IDPEngine;
