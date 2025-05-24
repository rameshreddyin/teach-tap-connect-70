
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ListChecks, 
  Bell, 
  CalendarDays, 
  User, 
  Clock, 
  LogOut,
  BookOpen,
  GraduationCap,
  Users,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const formattedTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Calculate current time for progress bar
  const startOfDay = new Date(today);
  startOfDay.setHours(8, 30, 0, 0); // School day starts at 8:30 AM
  const endOfDay = new Date(today);
  endOfDay.setHours(15, 30, 0, 0); // School day ends at 3:30 PM
  
  const totalSchoolDayMinutes = (endOfDay.getTime() - startOfDay.getTime()) / 60000;
  const minutesPassed = (today.getTime() - startOfDay.getTime()) / 60000;
  const progress = Math.max(0, Math.min(100, (minutesPassed / totalSchoolDayMinutes) * 100));
  
  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    toast.success("Logged out successfully");
    navigate('/');
  };
  
  // Mock data
  const todayClasses = [
    { time: "10:00 AM - 10:45 AM", subject: "Mathematics", class: "Class 9A", room: "Room 101", status: "completed" },
    { time: "11:00 AM - 11:45 AM", subject: "Mathematics", class: "Class 10B", room: "Room 203", status: "current" },
    { time: "1:30 PM - 2:15 PM", subject: "Mathematics", class: "Class 8C", room: "Room 105", status: "upcoming" },
  ];
  
  const quickMenuItems = [
    { icon: ListChecks, label: "Attendance", route: "/attendance" },
    { icon: Bell, label: "Announcements", route: "/announcements" },
    { icon: CalendarDays, label: "Timetable", route: "/timetable" },
    { icon: BookOpen, label: "Lessons", route: "#" },
    { icon: Users, label: "Students", route: "#" },
    { icon: ClipboardList, label: "Reports", route: "#" }
  ];
  
  return (
    <div className="page-container bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm mt-1">{formattedDate}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-gray-200 hover:ring-gray-300 transition-all">
              <AvatarFallback className="bg-gray-900 text-white font-semibold text-lg">MS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 p-3 border-b border-gray-100">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-900 text-white">MS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Ms. Smith</p>
                <p className="text-xs text-gray-500">Mathematics Department</p>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* School Day Progress */}
      <section className="mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">School Day Progress</p>
                <p className="text-xs text-gray-600 mt-1">8:30 AM - 3:30 PM</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formattedTime}</p>
                <p className="text-xs text-gray-600">{Math.round(progress)}% Complete</p>
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-gray-100" />
          </CardContent>
        </Card>
      </section>
      
      {/* Today's Schedule */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
          <Link to="/timetable" className="text-sm text-gray-700 hover:text-gray-900 font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {todayClasses.map((session, index) => (
            <Card key={index} className={`border shadow-sm ${
              session.status === 'current' ? 'bg-gray-50 border-gray-900' : 
              session.status === 'completed' ? 'bg-gray-50 opacity-80' : 'bg-white hover:bg-gray-50'
            }`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{session.subject}</div>
                  <div className="text-sm text-gray-600 mt-1">{session.class}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Clock size={12} className="mr-1" />
                    <span>{session.time}</span>
                    <span className="mx-2">•</span>
                    <span>{session.room}</span>
                  </div>
                </div>
                
                {session.status === 'current' && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-900" />
                    <span className="text-xs font-medium text-gray-900">Live</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Quick Menu */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickMenuItems.map((item, index) => (
            <Link to={item.route} key={index} className="block">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-28">
                <CardContent className="p-0 h-full">
                  <div className="h-full flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    <div className="p-4 rounded-full bg-gray-100 mb-3">
                      <item.icon size={24} className="text-gray-900" />
                    </div>
                    <p className="text-sm font-semibold text-center text-gray-900">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
