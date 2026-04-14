import { supabase } from '../lib/supabase'

const tools = [
  {
    name: 'Lead Finder',
    emoji: '🔍',
    url: 'https://leadfinder.nowscale.ai/',
    description: 'Leads finden, bewerten und kontaktieren',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="10" stroke="#FF4D00" strokeWidth="2.5" fill="none" />
        <line x1="25.5" y1="25.5" x2="33" y2="33" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="18" cy="18" r="4" fill="#FF4D00" opacity="0.2" />
      </svg>
    ),
  },
  {
    name: 'Ads Manager',
    emoji: '🎯',
    url: 'https://ads.nowscale.ai/',
    description: 'Werbekampagnen verwalten und optimieren',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 30V18L20 10L32 18V30" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="14" y="22" width="12" height="8" rx="2" stroke="#FF4D00" strokeWidth="2.5" fill="#FF4D00" opacity="0.2" />
        <path d="M20 10V6" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 6L24 8" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 6L16 8" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Finance Planer',
    emoji: '💰',
    url: 'https://finance.nowscale.ai/',
    description: 'Finanzen, Fixkosten und Schulden im Blick',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="12" width="28" height="20" rx="3" stroke="#FF4D00" strokeWidth="2.5" fill="none" />
        <rect x="6" y="12" width="28" height="6" fill="#FF4D00" opacity="0.2" />
        <circle cx="26" cy="25" r="3" stroke="#FF4D00" strokeWidth="2" fill="none" />
        <line x1="10" y1="25" x2="18" y2="25" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen'
  if (hour < 18) return 'Guten Tag'
  return 'Guten Abend'
}

function getFirstName(email) {
  const name = email?.split('@')[0] || ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function Hub({ session }) {
  const email = session?.user?.email
  const firstName = getFirstName(email)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F8F6' }}>
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E5E5E3' }}>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}>
            NOWSCALE
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#FF4D00', color: '#FFFFFF' }}>
            Hub
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline" style={{ color: '#666' }}>{email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{ backgroundColor: '#F0F0EE', color: '#1A1A1A', border: '1px solid #E5E5E3' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#E5E5E3')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#F0F0EE')}
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {/* Greeting */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}>
          {getGreeting()}, {firstName}
        </h2>
        <p className="text-base mb-10" style={{ color: '#666' }}>
          Wähle ein Tool, um loszulegen.
        </p>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => window.open(tool.url, '_blank')}
              className="group bg-white rounded-2xl p-8 text-left transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid #E5E5E3' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FFF0EB' }}>
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}>
                {tool.name}
              </h3>
              <p className="text-sm" style={{ color: '#666' }}>
                {tool.description}
              </p>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center">
        <p className="text-xs" style={{ color: '#999' }}>
          © 2026 NOWSCALE™ · Interne Tools
        </p>
      </footer>
    </div>
  )
}
