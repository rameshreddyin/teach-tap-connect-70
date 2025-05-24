
import { useState, useCallback } from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import { toast } from 'sonner';

interface UseSecureFormOptions {
  onSubmit: (data: any, csrfToken: string) => Promise<void> | void;
  sanitizeInput?: boolean;
}

export const useSecureForm = ({ onSubmit, sanitizeInput = true }: UseSecureFormOptions) => {
  const { generateCSRFToken, checkSession } = useSecurityContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input sanitization function
  const sanitizeInputValue = useCallback((value: string): string => {
    if (!sanitizeInput) return value;
    
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }, [sanitizeInput]);

  // Secure form submission handler
  const handleSecureSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check session validity
    if (!checkSession()) {
      toast.error('Invalid session. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: Record<string, any> = {};

      // Process and sanitize form data
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          data[key] = sanitizeInputValue(value);
        } else {
          data[key] = value;
        }
      }

      // Generate CSRF token
      const csrfToken = generateCSRFToken();

      // Rate limiting check (simple client-side)
      const lastSubmission = localStorage.getItem('last_form_submission');
      const now = Date.now();
      
      if (lastSubmission && (now - parseInt(lastSubmission)) < 1000) {
        toast.error('Please wait before submitting again.');
        return;
      }

      localStorage.setItem('last_form_submission', now.toString());

      // Call the actual submit handler
      await onSubmit(data, csrfToken);

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, generateCSRFToken, checkSession, sanitizeInputValue]);

  return {
    handleSecureSubmit,
    isSubmitting,
    sanitizeInputValue,
  };
};
