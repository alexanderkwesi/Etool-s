import React, { useState, useEffect } from 'react';
import { crmApi } from '../apiConfig';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Plus, 
  Save, 
  Building
} from 'lucide-react';

const CRMSync = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'active',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getContacts();
      if (res.status === 200) {
        setContacts(res.contacts);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const res = await crmApi.createContact(formData);
      if (res.status === 200) {
        setShowAddForm(false);
        resetForm();
        fetchContacts();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      title: contact.title || '',
      status: contact.status || 'active',
      notes: contact.notes || ''
    });
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await crmApi.updateContact(editingId, formData);
      if (res.status === 200) {
        setEditingId(null);
        resetForm();
        fetchContacts();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      setLoading(true);
      await crmApi.deleteContact(id);
      fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'active',
      notes: ''
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '10px', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Connected CRM Pipeline</span>
            <h2 style={{ fontSize: '1.25rem' }}>Ecosystem Contacts ({contacts.length})</h2>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchContacts} className="btn btn-outline" style={{ padding: '10px' }}>
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); resetForm(); }}
            className="btn btn-primary"
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '12px 20px', borderLeft: '4px solid var(--error)', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', fontSize: '0.85rem' }}>
          Error: {error}
        </div>
      )}

      {/* Add / Edit Form Panel */}
      {(showAddForm || editingId) && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: '4px solid var(--secondary)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>
            {editingId ? "Edit Connected CRM Record" : "Register New CRM Profile"}
          </h3>
          
          <form onSubmit={editingId ? handleUpdateContact : handleCreateContact} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Contact Name *</label>
              <input name="name" required value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Company</label>
              <input name="company" value={formData.company} onChange={handleInputChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Job Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Sync Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Notes & Linked Metadata payloads</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> {editingId ? "Save Changes" : "Register Contact"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Database display */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glow)' }}>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Company & Title</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Email & Phone</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Notes / Payload</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && contacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading contacts...
                </td>
              </tr>
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr 
                  key={contact.id}
                  style={{ 
                    borderBottom: '1px solid var(--border-glow)',
                    background: editingId === contact.id ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 'bold' }}>{contact.name}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={14} color="var(--secondary)" />
                      <div>
                        {contact.company || 'N/A'}
                        {contact.title && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.title}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>{contact.email || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.phone || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.notes}>
                    {contact.notes || '-'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: contact.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: contact.status === 'active' ? 'var(--success)' : '#f87171'
                    }}>
                      {contact.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleEditClick(contact)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No contacts found in CRM. Sync a processed document or add one manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default CRMSync;
