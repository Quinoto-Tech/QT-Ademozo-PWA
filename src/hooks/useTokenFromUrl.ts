import { useEffect } from 'react';
import { useSearchParams, useLocation, useParams } from 'react-router-dom';

export function useTokenFromUrl(): { token: string | null; source: string | null } {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  
  // Try to get token from Authorization header (if passed via server-side rendering)
  const getTokenFromHeaders = (): string | null => {
    // This would be set by the server if the token comes in the Authorization header
    const metaToken = document.querySelector('meta[name="auth-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    return null;
  };

  // Try to get token from URL parameters
  const tokenFromParams = searchParams.get('token');
  
  // Try to get token from URL path parameter (for URLs like /jwt-token or /:token)
  const tokenFromUrlParam = params.token;
  
  // Try to get token from hash
  const tokenFromHash = window.location.hash.includes('token=') 
    ? window.location.hash.split('token=')[1]?.split('&')[0] 
    : null;

  // Try to get token from path (for URLs like /jwt-token)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const tokenFromPath = pathSegments.length === 1 && pathSegments[0].length > 50 ? pathSegments[0] : null;

  // Try to get token from headers
  const tokenFromHeaders = getTokenFromHeaders();

  // Priority order: headers > URL param > query params > hash > path segments
  const finalToken = tokenFromHeaders || tokenFromUrlParam || tokenFromParams || tokenFromHash || tokenFromPath;
  
  // Determine source for debugging
  const source = tokenFromHeaders ? 'headers' : 
                 tokenFromUrlParam ? 'url-param' :
                 tokenFromParams ? 'query-param' : 
                 tokenFromHash ? 'hash' : 
                 tokenFromPath ? 'path-segment' : null;
  
  console.log('Token extraction results:', {
    tokenFromHeaders,
    tokenFromUrlParam,
    tokenFromParams,
    tokenFromHash,
    tokenFromPath,
    finalToken,
    source,
    pathname: location.pathname
  });
  
  return { token: finalToken, source };
}