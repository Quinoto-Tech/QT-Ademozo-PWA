import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenFromUrl } from '../hooks/useTokenFromUrl';

export function LoadingPage() {
  const navigate = useNavigate();
  const { validateTokenWithCerbero, isValidating, error, setAdecashToken } = useAuthStore();
  const { token, source } = useTokenFromUrl();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        navigate('/error', { 
          state: { 
            error: 'No se encontró token de Adecash. Accede desde el enlace proporcionado por Adecash o pasa el token en la URL.' 
          } 
        });
        return;
      }

      console.log(`Token found from ${source}, starting validation process...`);
      
      try {
        setAdecashToken(token);
        const isValid = await validateTokenWithCerbero(token);
        
        if (isValid) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/error', { 
            state: { 
              error: 'Acceso no autorizado. Token inválido o expirado.' 
            } 
          });
        }
      } catch (validationError) {
        console.error('Error during validation:', validationError);
        navigate('/error', { 
          state: { 
            error: 'Error durante la validación del token' 
          } 
        });
      }
    };

    handleAuth();
  }, [token, validateTokenWithCerbero, navigate, setAdecashToken]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252] flex items-center justify-center">
        <ErrorMessage
          title="Error de Autenticación"
          message={error}
          action={
            <button
              onClick={() => window.location.reload()}
              className="bg-[#80D580]-500 hover:bg-[#80D580]-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#264252] flex items-center justify-center">
      <LoadingSpinner 
        message="Validando acceso con Cerbero..." 
        size="lg"
      />
    </div>
  );
}