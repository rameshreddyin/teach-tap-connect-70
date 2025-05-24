
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SecurityProvider } from "./contexts/SecurityContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Announcements from "./pages/Announcements";
import Timetable from "./pages/Timetable";
import AppLayout from "./components/layouts/AppLayout";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/error-boundary";
import React from "react";

// Configure QueryClient with production optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      refetchOnReconnect: true,
      networkMode: 'offlineFirst', // Better offline support
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

// Production error logging
const logError = (error: Error, errorInfo: any) => {
  console.error('Application Error:', error, errorInfo);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external error tracking
    // errorTracker.captureException(error, { extra: errorInfo });
  }
};

// Service Worker registration for offline support
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, prompt user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Performance monitoring
const initPerformanceMonitoring = () => {
  if ('PerformanceObserver' in window) {
    // Monitor largest contentful paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
};

const App = () => {
  React.useEffect(() => {
    registerServiceWorker();
    initPerformanceMonitoring();
    
    // Cleanup function
    return () => {
      // Cleanup any subscriptions or timers if needed
    };
  }, []);

  return (
    <ErrorBoundary onError={logError}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SecurityProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner 
                position="top-right"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                  style: {
                    background: 'white',
                    color: 'black',
                    border: '1px solid #e5e7eb',
                  },
                }}
              />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/timetable" element={<Timetable />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SecurityProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
