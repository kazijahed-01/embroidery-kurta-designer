import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchUserProfile = useCallback(async (authUser) => {
    const userId =
      typeof authUser === 'string' ? authUser : authUser?.id

    if (!userId) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (data) {
      setUser(data)
      setIsAdmin(data.role === 'admin')
      return
    }

    console.error('Could not load profile:', error)

    // Temporary safe fallback while a profile is being created.
    // This never grants admin access.
    if (typeof authUser !== 'string') {
      setUser({
        id: authUser.id,
        email: authUser.email,
        name:
          authUser.user_metadata?.name ||
          authUser.email?.split('@')[0] ||
          'User',
        phone: authUser.user_metadata?.phone || '',
        role: 'user'
      })
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session?.user) {
        await fetchUserProfile(session.user)
      }

      setLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user)
        }, 0)
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  const signUp = async (email, password, name, phone) => {
    return supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          name: name.trim(),
          phone: phone.trim()
        }
      }
    })
  }

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      setUser(null)
      setIsAdmin(false)
    }

    return { error }
  }

  const updateProfile = async (updates) => {
    if (!user) {
      return { error: { message: 'You are not logged in.' } }
    }

    // Never allow a browser request to alter role or status.
    const allowedFields = ['name', 'phone', 'avatar_url', 'bio']

    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    )

    if (Object.keys(safeUpdates).length === 0) {
      return { error: { message: 'No permitted profile fields to update.' } }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      setUser(data)
      setIsAdmin(data.role === 'admin')
    }

    return { data, error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile: fetchUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}