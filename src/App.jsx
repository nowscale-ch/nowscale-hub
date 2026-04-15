import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Hub from './components/Hub'
import UserManagement from './components/UserManagement'

function AdminRoute({ session, children }) {
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    if (!session?.user?.email) { setIsAdmin(false); return }
    supabase
      .from('ns_users')
      .select('role')
      .eq('email', session.user.email)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(data?.role === 'admin')
      })
  }, [session])

  if (isAdmin === null) return <div className="loading"><div className="spinner" />Laden...</div>
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Laden...
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub session={session} />} />
        <Route path="/users" element={
          <AdminRoute session={session}>
            <UserManagement session={session} />
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
