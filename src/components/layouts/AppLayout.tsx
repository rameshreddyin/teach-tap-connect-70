
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
        <Suspense fallback={
          <div className="p-4 flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-gray-600">Loading...</div>
          </div>
        }>
          <main className="animate-fade-in pb-16">
            <Outlet />
          </main>
        </Suspense>
      </ErrorBoundary>
      
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 z-20 shadow-md animate-slide-in-up">
        <NavLink to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full text-teacherApp-textLight hover:text-teacherApp-accent transition-colors ${isActive('/dashboard') ? 'text-teacherApp-accent' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/dashboard') ? 'bg-gray-100' : ''} transition-all`}>
            <Home size={20} />
          </div>
          <span className="text-xs mt-0.5">Home</span>
        </NavLink>
        
        <NavLink to="/attendance" className={`flex flex-col items-center justify-center w-full h-full text-teacherApp-textLight hover:text-teacherApp-accent transition-colors ${isActive('/attendance') ? 'text-teacherApp-accent' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/attendance') ? 'bg-gray-100' : ''} transition-all`}>
            <List size={20} />
          </div>
          <span className="text-xs mt-0.5">Attendance</span>
        </NavLink>
        
        <NavLink to="/announcements" className={`flex flex-col items-center justify-center w-full h-full text-teacherApp-textLight hover:text-teacherApp-accent transition-colors ${isActive('/announcements') ? 'text-teacherApp-accent' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/announcements') ? 'bg-gray-100' : ''} transition-all`}>
            <Bell size={20} />
          </div>
          <span className="text-xs mt-0.5">Notices</span>
        </NavLink>
        
        <NavLink to="/timetable" className={`flex flex-col items-center justify-center w-full h-full text-teacherApp-textLight hover:text-teacherApp-accent transition-colors ${isActive('/timetable') ? 'text-teacherApp-accent' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/timetable') ? 'bg-gray-100' : ''} transition-all`}>
            <Calendar size={20} />
          </div>
          <span className="text-xs mt-0.5">Timetable</span>
        </NavLink>
      </nav>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
