import React, { useEffect, useState } from 'react'
import { supabase } from './SupaBaseClient'
import Auth from './components/Auth'
import NotesList from './components/NotesList'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <NotesList user={session.user} onLogout={handleLogout} />
      )}
    </div>
  )
}
