import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const TOOL_DEFS = [
  { key: 'leadfinder', label: 'Lead Finder', color: '#F59E0B' },
  { key: 'ads', label: 'Ads Manager', color: '#7C3AED' },
  { key: 'finance', label: 'Finance', color: '#2563EB' },
  { key: 'leads', label: 'Leads', color: '#10B981' },
];

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ns-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newDark = !prev;
      const theme = newDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('ns-theme', theme);
      return newDark;
    });
  }, []);

  return { isDark, toggleTheme };
}

export default function UserManagement({ session }) {
  const email = session?.user?.email;
  const { isDark, toggleTheme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('ns_users')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDeactivate = async (user) => {
    const newActive = !user.active;
    const { error } = await supabase
      .from('ns_users')
      .update({ active: newActive, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) {
      showToast('Fehler: ' + error.message, 'error');
    } else {
      showToast(newActive ? 'Benutzer aktiviert' : 'Benutzer deaktiviert');
      fetchUsers();
    }
  };

  const handleResetPassword = async (userEmail) => {
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: window.location.origin,
    });
    if (error) {
      showToast('Fehler: ' + error.message, 'error');
    } else {
      showToast('Passwort-Reset E-Mail gesendet');
    }
  };

  const filteredUsers = showInactive ? users : users.filter(u => u.active);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.webp" alt="NowScale" style={{ height: 18 }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hub</span>
        </div>
        <nav className="hub-nav">
          <Link to="/" className="hub-nav-link">Tools</Link>
          <Link to="/users" className="hub-nav-link hub-nav-active">Benutzer</Link>
        </nav>
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{isDark ? '🌙' : '☀️'}</span>
            <label className="theme-toggle">
              <input type="checkbox" checked={isDark} onChange={toggleTheme} />
              <span className="theme-slider" />
            </label>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{email}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Abmelden</button>
        </div>
      </div>

      {/* Content */}
      <div className="content" style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Benutzerverwaltung</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{users.length} Benutzer registriert</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} />
              Inaktive anzeigen
            </label>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditUser(null); setShowModal(true); }}>
              + Benutzer anlegen
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" />Laden...</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="um-table-wrap">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Rolle</th>
                    <th>Tools</th>
                    <th>Status</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} style={{ opacity: user.active ? 1 : 0.5 }}>
                      <td style={{ fontWeight: 600 }}>{user.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <span className={`um-badge ${user.role === 'admin' ? 'um-badge-admin' : 'um-badge-user'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(user.tools || []).map(t => {
                            const def = TOOL_DEFS.find(d => d.key === t);
                            if (!def) return null;
                            return (
                              <span key={t} className="um-tool-badge" style={{ background: `${def.color}18`, color: def.color, borderColor: `${def.color}30` }}>
                                {def.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <span className={`um-status-dot ${user.active ? 'um-status-active' : 'um-status-inactive'}`} />
                          {user.active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditUser(user); setShowModal(true); }}>
                            Bearbeiten
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeactivate(user)}>
                            {user.active ? 'Deaktivieren' : 'Aktivieren'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="um-cards">
              {filteredUsers.map(user => (
                <div key={user.id} className="um-card" style={{ opacity: user.active ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className={`um-status-dot ${user.active ? 'um-status-active' : 'um-status-inactive'}`} />
                      <span className={`um-badge ${user.role === 'admin' ? 'um-badge-admin' : 'um-badge-user'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                    {(user.tools || []).map(t => {
                      const def = TOOL_DEFS.find(d => d.key === t);
                      if (!def) return null;
                      return (
                        <span key={t} className="um-tool-badge" style={{ background: `${def.color}18`, color: def.color, borderColor: `${def.color}30` }}>
                          {def.label}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { setEditUser(user); setShowModal(true); }}>
                      Bearbeiten
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => handleDeactivate(user)}>
                      {user.active ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null); }}
          onSaved={() => { setShowModal(false); setEditUser(null); fetchUsers(); }}
          showToast={showToast}
          onResetPassword={handleResetPassword}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.msg}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
        © 2026 NOWSCALE™
      </div>
    </div>
  );
}

function UserModal({ user, onClose, onSaved, showToast, onResetPassword }) {
  const isEdit = !!user;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'user');
  const [tools, setTools] = useState(user?.tools || ['leadfinder', 'ads', 'finance', 'leads']);
  const [saving, setSaving] = useState(false);

  const toggleTool = (key) => {
    setTools(prev => prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      showToast('Name und E-Mail sind erforderlich', 'error');
      return;
    }
    if (!isEdit && !password) {
      showToast('Passwort ist erforderlich', 'error');
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        // Update existing user
        const { error } = await supabase
          .from('ns_users')
          .update({ name, role, tools, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        if (error) throw error;
        showToast('Benutzer aktualisiert');
      } else {
        // Create new user via signUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;

        const authId = authData?.user?.id || null;

        const { error: insertError } = await supabase
          .from('ns_users')
          .insert({
            auth_id: authId,
            email: email.trim(),
            name: name.trim(),
            role,
            tools,
          });
        if (insertError) throw insertError;
        showToast('Benutzer angelegt');
      }
      onSaved();
    } catch (e) {
      showToast('Fehler: ' + (e.message || 'Unbekannter Fehler'), 'error');
    }
    setSaving(false);
  };

  return (
    <div className="um-modal-overlay" onClick={onClose}>
      <div className="um-modal" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          {isEdit ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
        </h3>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Max Muster" />
        </div>

        {!isEdit && (
          <>
            <div className="form-group">
              <label className="form-label">E-Mail</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="max@beispiel.ch" />
            </div>
            <div className="form-group">
              <label className="form-label">Passwort</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mindestens 6 Zeichen" />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Rolle</label>
          <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tools</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TOOL_DEFS.map(t => (
              <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={tools.includes(t.key)} onChange={() => toggleTool(t.key)} />
                <span className="um-tool-badge" style={{ background: `${t.color}18`, color: t.color, borderColor: `${t.color}30` }}>
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {isEdit && (
          <div style={{ marginBottom: 16 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onResetPassword(user.email)}>
              🔑 Passwort zurücksetzen
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
