import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured()) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  const signIn = async () => {
    if (!auth) return;
    try { await signInWithPopup(auth, googleProvider); } catch { /* cancelled */ }
  };

  const logout = async () => { if (auth) await signOut(auth); };

  return { user, loading, signIn, logout };
}
