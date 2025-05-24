
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

  // Generate secure session ID using crypto API
  const generateSessionId = () => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for older browsers
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  // Generate CSRF token
  const generateCSRFToken = () => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for older browsers
    return Math.random().toString(36).substring(2);
  };

  // Check if session is valid
  const checkSession = () => {
    try {
      const storedSession = localStorage.getItem('session_id');
      const sessionTimestamp = localStorage.getItem('session_timestamp');
      
      if (!storedSession || !sessionTimestamp) {
        return false;
      }

      // Check if session is older than 24 hours
      const now = Date.now();
      const sessionTime = parseInt(sessionTimestamp, 10);
      
      if (isNaN(sessionTime)) {
        return false;
      }
      
      const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_timestamp');
        toast.error('Session expired. Please log in again.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  };

  // Initialize security features
  useEffect(() => {
    try {
      // Check if running on HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      setIsSecure(isHTTPS);

      if (!isHTTPS && window.location.hostname !== 'localhost' && process.env.NODE_ENV === 'production') {
        console.warn('Application should be served over HTTPS for security');
        toast.warning('Insecure connection detected. Please use HTTPS.');
      }

      // Generate or retrieve session ID
      let currentSessionId = localStorage.getItem('session_id');
      if (!currentSessionId || !checkSession()) {
        currentSessionId = generateSessionId();
        localStorage.setItem('session_id', currentSessionId);
        localStorage.setItem('session_timestamp', Date.now().toString());
      }
      setSessionId(currentSessionId);

      // Set security headers via meta tags (limited effectiveness on client-side)
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!existingCSP) {
        const metaCSP = document.createElement('meta');
        metaCSP.httpEquiv = 'Content-Security-Policy';
        metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;";
        document.head.appendChild(metaCSP);
      }

      // Session timeout warning (19 minutes)
      const sessionTimeout = setTimeout(() => {
        toast.warning('Session will expire in 5 minutes. Please save your work.');
      }, 19 * 60 * 1000);

      return () => {
        clearTimeout(sessionTimeout);
      };
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  }, []);

  // Monitor for suspicious activity
  useEffect(() => {
    let failedAttempts = 0;
    const maxAttempts = 5;

    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'session_id' && e.newValue !== sessionId && sessionId) {
          failedAttempts++;
          console.warn(`Suspicious session activity detected. Attempt ${failedAttempts}/${maxAttempts}`);
          
          if (failedAttempts >= maxAttempts) {
            toast.error('Suspicious activity detected. Session terminated.');
            localStorage.clear();
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Storage monitoring error:', error);
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
