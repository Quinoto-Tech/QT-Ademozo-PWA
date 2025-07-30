import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuthStore } from '../stores/useAuthStore';

export function JWTTokenPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { validateTokenWithCerbero, error, setAdecashToken } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        console.log('No token found in URL');
        navigate('/error', { 
          state: { 
            error: 'No se encontró token de Adecash en la URL. Formato esperado: /tu-jwt-token' 
          } 
        });
        return;
      }

      console.log('Adecash token from URL parameter:', token.substring(0, 20) + '...');
      
      try {
        // Set the Adecash token
        setAdecashToken(token);
        
        console.log('Starting token validation with Cerbero...');
        const isValid = await validateTokenWithCerbero(token);
        
        console.log('Token validation completed. Is valid:', isValid);
        
        if (isValid) {
          console.log('Redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('Token validation failed, redirecting to error');
          navigate('/error', { 
            state: { 
              error: 'Acceso no autorizado. Token inválido o expirado.' 
            } 
          });
        }
      } catch (validationError) {
        console.error('Error during token validation:', validationError);
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