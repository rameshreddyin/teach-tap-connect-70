
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SecurityContextType {
  sessionId: string;
  isSecure: boolean;
  checkSession: () => boolean;
  generateCSRFToken: () => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isSecure, setIsSecure] = useState<boolean>(false);

  // Generate secure session ID
  const generateSessionId = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Generate CSRF token
  const generateCSRFToken = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Check if session is valid
  const checkSession = () => {
    const storedSession = localStorage.getItem('session_id');
    const sessionTimestamp = localStorage.getItem('session_timestamp');
    
    if (!storedSession || !sessionTimestamp) {
      return false;
    }

    // Check if session is older than 24 hours
    const now = Date.now();
    const sessionTime = parseInt(sessionTimestamp);
    const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      localStorage.removeItem('session_id');
      localStorage.removeItem('session_timestamp');
      toast.error('Session expired. Please log in again.');
      return false;
    }

    return true;
  };

  // Initialize security features
  useEffect(() => {
    // Check if running on HTTPS
    const isHTTPS = window.location.protocol === 'https:';
    setIsSecure(isHTTPS);

    if (!isHTTPS && window.location.hostname !== 'localhost') {
      console.warn('Application should be served over HTTPS for security');
    }

    // Generate or retrieve session ID
    let currentSessionId = localStorage.getItem('session_id');
    if (!currentSessionId || !checkSession()) {
      currentSessionId = generateSessionId();
      localStorage.setItem('session_id', currentSessionId);
      localStorage.setItem('session_timestamp', Date.now().toString());
    }
    setSessionId(currentSessionId);

    // Set security headers via meta tags
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = 'Content-Security-Policy';
    metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;";
    document.head.appendChild(metaCSP);

    const metaXFrame = document.createElement('meta');
    metaXFrame.httpEquiv = 'X-Frame-Options';
    metaXFrame.content = 'DENY';
    document.head.appendChild(metaXFrame);

    const metaXContentType = document.createElement('meta');
    metaXContentType.httpEquiv = 'X-Content-Type-Options';
    metaXContentType.content = 'nosniff';
    document.head.appendChild(metaXContentType);

    // Session timeout warning
    const sessionTimeout = setTimeout(() => {
      toast.warning('Session will expire in 5 minutes. Please save your work.');
    }, 19 * 60 * 1000); // 19 minutes

    return () => {
      clearTimeout(sessionTimeout);
      document.head.removeChild(metaCSP);
      document.head.removeChild(metaXFrame);
      document.head.removeChild(metaXContentType);
    };
  }, []);

  // Monitor for suspicious activity
  useEffect(() => {
    let failedAttempts = 0;
    const maxAttempts = 5;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session_id' && e.newValue !== sessionId) {
        failedAttempts++;
        if (failedAttempts >= maxAttempts) {
          toast.error('Suspicious activity detected. Session terminated.');
          localStorage.clear();
          window.location.href = '/';
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [sessionId]);

  const value = {
    sessionId,
    isSecure,
    checkSession,
    generateCSRFToken,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
