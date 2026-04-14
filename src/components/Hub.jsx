import { supabase } from '../lib/supabase';

const tools = [
  {
    name: 'Lead Finder',
    url: 'https://leadfinder.nowscale.ai/',
    description: 'Leads finden, bewerten und kontaktieren',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    name: 'Ads Manager',
    url: 'https://ads.nowscale.ai/',
    description: 'Werbekampagnen verwalten und optimieren',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    name: 'Finance Planer',
    url: 'https://finance.nowscale.ai/',
    description: 'Finanzen, Fixkosten und Schulden im Blick',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function Hub({ session }) {
  const email = session?.user?.email;

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
        <div className="header-actions">
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{email}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Abmelden</button>
        </div>
      </div>

      {/* Content */}
      <div className="content" style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '40px 32px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Hallo, Simon</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>Wähle ein Tool, um loszulegen.</p>

        <div className="hub-section-label">Tools</div>
        <div className="hub-grid">
          {tools.map((tool) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="hub-card">
              <div className="hub-card-icon">
                {tool.icon}
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </a>
          ))}
        </div>

        <div className="hub-section-label" style={{ marginTop: 48 }}>Websites</div>
        <div className="hub-grid">
          <a href="https://nowscale.ch" target="_blank" rel="noopener noreferrer" className="hub-card">
            <div className="hub-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>nowscale.ch</h3>
            <p>Hauptwebsite der Agentur</p>
          </a>
          <a href="https://nowscale-agentur.ch" target="_blank" rel="noopener noreferrer" className="hub-card">
            <div className="hub-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3>nowscale-agentur.ch</h3>
            <p>Neue Agentur-Website (Astro)</p>
          </a>
          <a href="https://kifabrik.ch" target="_blank" rel="noopener noreferrer" className="hub-card">
            <div className="hub-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>kifabrik.ch</h3>
            <p>KI-Beratung für KMU</p>
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
