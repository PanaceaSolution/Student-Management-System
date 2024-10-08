import { login } from '@/services/authServices'
import { create } from 'zustand'

const useAuthStore = create((set) => ({
   loading: false,
   error: null,
   login: async (userData) => {
      set({ loading: true, error: null })
      try {
         await login(userData)
      } catch (error) {
         set({ error: error.message })
      } finally {
         set({ loading: false })
      }
   }
}))

export default useAuthStore;