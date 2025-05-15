
import React, { Suspense } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Bell, List } from 'lucide-react';
import ErrorBoundary from '../error-boundary';

// Use React.memo to prevent unnecessary re-renders
const AppLayout: React.FC = React.memo(() => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="bg-teacherApp-background min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        
        <NavLink to="/attendance" className={`bottom-nav-item ${isActive('/attendance') ? 'active' : ''}`}>
          <List size={20} />
          <span className="text-xs mt-1">Attendance</span>
        </NavLink>
        
        <NavLink to="/announcements" className={`bottom-nav-item ${isActive('/announcements') ? 'active' : ''}`}>
          <Bell size={20} />
          <span className="text-xs mt-1">Notices</span>
        </NavLink>
        
        <NavLink to="/timetable" className={`bottom-nav-item ${isActive('/timetable') ? 'active' : ''}`}>
          <Calendar size={20} />
          <span className="text-xs mt-1">Timetable</span>
        </NavLink>
      </nav>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
