import { create } from 'zustand'
import { UserResponse } from '@/lib/api/models'

interface UserState {
  user: UserResponse | null
  isAuthenticated: boolean
  setUser: (user: UserResponse) => void
  updateUser: (user: Partial<UserResponse>) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}))