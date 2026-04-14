import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!input || !password) { setError('Bitte E-Mail und Passwort eingeben'); return; }
    setError('');
    setLoading(true);
    try {
      let email = input;
      if (!input.includes('@')) {
        const { data: prof } = await supabase.from('profiles').select('email,username').eq('username', input).maybeSingle();
        if (prof && prof.email) { email = prof.email; }
        else { email = input.replace(/[^a-zA-Z0-9._-]/g, '') + '@noreply.nowscale.ai'; }
      }
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
    } catch (e) {
      setError(e.message === 'Invalid login credentials' ? 'Ungueltige Anmeldedaten' : (e.message || 'Anmeldung fehlgeschlagen'));
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.webp" alt="NowScale" />
          <span>Hub</span>
        </div>
        <div className="login-title">Anmelden</div>
        <div className="login-subtitle">Melden Sie sich mit Ihrem NowScale-Konto an</div>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">E-Mail oder Benutzername</label>
          <input className="form-input" type="text" placeholder="email@beispiel.ch oder benutzername"
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="form-label">Passwort</label>
          <input className="form-input" type="password" placeholder="Passwort"
            value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, padding: 10 }}
          onClick={handleLogin} disabled={loading}>
          {loading ? 'Anmelden...' : 'Anmelden'}
        </button>
      </div>
    </div>
  );
}
