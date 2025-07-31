import { useEffect } from 'react';
import { useSearchParams, useLocation, useParams } from 'react-router-dom';

export function useTokenFromUrl(): { token: string | null; source: string | null } {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();

  // Try to get token from Authorization header (if passed via server-side rendering)
  const getTokenFromHeaders = (): string | null => {
    const metaToken = document.querySelector('meta[name="auth-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    return null;
  };

  // Try to get token from localStorage
  const getTokenFromLocalStorage = (): string | null => {
    const authHeader = localStorage.getItem('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '');
    }
    return null;
  };

  // Try to get token from URL parameters
  const tokenFromParams = searchParams.get('token');

  // Try to get token from URL path parameter (for URLs like /:token)
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

  // Try to get token from localStorage
  const tokenFromLocalStorage = getTokenFromLocalStorage();

  // Priority order: localStorage > headers > URL param > query params > hash > path segments
  const finalToken =
    tokenFromLocalStorage ||
    tokenFromHeaders ||
    tokenFromUrlParam ||
    tokenFromParams ||
    tokenFromHash ||
    tokenFromPath;

  // Determine source for debugging
  const source = tokenFromLocalStorage
    ? 'localStorage'
    : tokenFromHeaders
    ? 'headers'
    : tokenFromUrlParam
    ? 'url-param'
    : tokenFromParams
    ? 'query-param'
    : tokenFromHash
    ? 'hash'
    : tokenFromPath
    ? 'path-segment'
    : null;

  console.log('Token extraction results:', {
    tokenFromLocalStorage,
    tokenFromHeaders,
    tokenFromUrlParam,
    tokenFromParams,
    tokenFromHash,
    tokenFromPath,
    finalToken,
    source,
    pathname: location.pathname,
  });

  return { token: finalToken, source };
}