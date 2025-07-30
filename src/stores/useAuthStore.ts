import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AdecashUser } from '../types';
import { apiClient } from '../lib/api';
import { JWTManager } from '../lib/jwt';

interface AuthStore extends AuthState {
  setAdecashToken: (token: string) => void;
  setCerberoToken: (token: string) => void;
  setUser: (user: AdecashUser) => void;
  validateTokenWithCerbero: (adecashToken: string) => Promise<boolean>;
  updateCreditLine: (remaining: number) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setValidating: (isValidating: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adecashToken: null,
      cerberoToken: null,
      isValidating: false,
      error: null,
      user: null,

      setAdecashToken: (token: string) => {
        set({ adecashToken: token });
      },

      setCerberoToken: (token: string) => {
        set({ cerberoToken: token });
        apiClient.setToken(token);
      },

      setUser: (user: AdecashUser) => {
        set({ user, isAuthenticated: true });
      },

      validateTokenWithCerbero: async (adecashToken: string) => {
        set({ isValidating: true, error: null });
        
        console.log('Starting token validation with Cerbero...');
        
        try {
          // Check if Adecash token is expired
          if (JWTManager.isTokenExpired(adecashToken)) {
            set({ 
              adecashToken: null, 
              cerberoToken: null,
              user: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Token de Adecash expirado' 
            });
            return false;
          }

          // Decode Adecash token to extract user data
          const adecashUser = JWTManager.decodeAdecashToken(adecashToken);
          
          if (!adecashUser) {
            set({ 
              adecashToken: null, 
              cerberoToken: null,
              user: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Token de Adecash inválido' 
            });
            return false;
          }

          // Validate token with Cerbero
          const cerberoResponse = await apiClient.validateTokenWithCerbero(adecashToken);
          
          if (!cerberoResponse || !cerberoResponse.token) {
            set({ 
              adecashToken: null, 
              cerberoToken: null,
              user: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Error de validación con Cerbero' 
            });
            return false;
          }

          // Verify Cerbero token is valid
          const cerberoPayload = JWTManager.decodeCerberoToken(cerberoResponse.token);
          
          if (!cerberoPayload || !cerberoPayload.valid) {
            set({ 
              adecashToken: null, 
              cerberoToken: null,
              user: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Token de Cerbero inválido' 
            });
            return false;
          }

          // Extract final user data combining both tokens
          const finalUser = JWTManager.extractUserFromTokens(adecashToken, cerberoResponse.token);
          
          if (!finalUser) {
            set({ 
              adecashToken: null, 
              cerberoToken: null,
              user: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Error procesando datos de usuario' 
            });
            return false;
          }

          // Set all authentication data
          set({ 
            adecashToken, 
            cerberoToken: cerberoResponse.token,
            user: finalUser,
            isAuthenticated: true, 
            isValidating: false,
            error: null 
          });

          // Set token for API client
          apiClient.setToken(cerberoResponse.token);
          
          console.log('Authentication successful');
          return true;
          
        } catch (error) {
          console.error('Token validation error:', error);
          set({ 
            adecashToken: null, 
            cerberoToken: null,
            user: null,
            isAuthenticated: false, 
            isValidating: false,
            error: 'Error de conexión con el servidor de autenticación' 
          });
          return false;
        }
      },

      updateCreditLine: (remaining: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              remaining_credit_line: remaining
            }
          });
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          adecashToken: null, 
          cerberoToken: null,
          user: null,
          error: null 
        });
        apiClient.setToken('');
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setValidating: (isValidating: boolean) => {
        set({ isValidating });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        adecashToken: state.adecashToken, 
        cerberoToken: state.cerberoToken,
        user: state.user
      }),
    }
  )
);