import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

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

const allTools = [
  {
    key: 'leadfinder',
    name: 'Lead Finder',
    url: 'https://leadfinder.nowscale.ai/',
    description: 'Leads finden, bewerten und kontaktieren',
    color: '#F59E0B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    key: 'ads',
    name: 'Ads Manager',
    url: 'https://ads.nowscale.ai/',
    description: 'Werbekampagnen verwalten und optimieren',
    color: '#7C3AED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    key: 'finance',
    name: 'Finance Planer',
    url: 'https://finance.nowscale.ai/',
    description: 'Finanzen, Fixkosten und Schulden im Blick',
    color: '#2563EB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: 'leads',
    name: 'Leads',
    url: 'https://leads.nowscale.ai/',
    description: 'Alle Anfragen zentral verwalten',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'projects',
    name: 'Projects',
    url: 'https://projects.nowscale.ai/',
    description: 'Kundenprojekte, Aufgaben & Meetings',
    color: '#0EA5E9',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
];

export default function Hub({ session }) {
  const email = session?.user?.email;
  const authId = session?.user?.id;
  const { isDark, toggleTheme } = useTheme();
  const [nsUser, setNsUser] = useState(null);

  useEffect(() => {
    if (!email) return;
    supabase
      .from('ns_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setNsUser(data);
      });
  }, [email]);

  const isAdmin = nsUser?.role === 'admin';
  const userTools = !nsUser ? allTools : isAdmin ? allTools : allTools.filter(t => (nsUser?.tools || []).includes(t.key));
  const displayName = nsUser?.name?.split(' ')[0] || email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.webp" alt="NowScale" style={{ height: 18 }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hub</span>
        </div>
        {isAdmin && (
          <nav className="hub-nav">
            <Link to="/" className="hub-nav-link hub-nav-active">Tools</Link>
            <Link to="/users" className="hub-nav-link">Benutzer</Link>
          </nav>
        )}
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
      <div className="content" style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '40px 32px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Hallo, {displayName}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>Wähle ein Tool, um loszulegen.</p>

        <div className="hub-section-label">Tools</div>
        <div className="hub-grid">
          {userTools.map((tool) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="hub-card" style={{ borderTop: `3px solid ${tool.color}` }}>
              <div className="hub-card-icon" style={{ background: `${tool.color}15` }}>
                {tool.icon}
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </a>
          ))}
        </div>

        <div className="hub-section-label" style={{ marginTop: 48 }}>Websites</div>
        <div className="hub-websites">
          <a href="https://nowscale.ch" target="_blank" rel="noopener noreferrer" className="hub-website-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="hub-website-name">nowscale.ch</span>
            <span className="hub-website-desc">Hauptwebsite der Agentur</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0, marginLeft: 'auto' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          <a href="https://nowscale-agentur.ch" target="_blank" rel="noopener noreferrer" className="hub-website-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="hub-website-name">nowscale-agentur.ch</span>
            <span className="hub-website-desc">Neue Agentur-Website (Astro)</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0, marginLeft: 'auto' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          <a href="https://kifabrik.ch" target="_blank" rel="noopener noreferrer" className="hub-website-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span className="hub-website-name">kifabrik.ch</span>
            <span className="hub-website-desc">KI-Beratung für KMU</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0, marginLeft: 'auto' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
        © 2026 NOWSCALE™
      </div>
    </div>
  );
}
