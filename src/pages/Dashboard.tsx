
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
  
  const attendanceStats = {
    total: 120,
    present: 112,
    percentage: 93
  };
  
  const quickMenuItems = [
    { icon: ListChecks, label: "Attendance", route: "/attendance", color: "bg-blue-100 text-blue-600" },
    { icon: Bell, label: "Announcements", route: "/announcements", color: "bg-amber-100 text-amber-600" },
    { icon: CalendarDays, label: "Timetable", route: "/timetable", color: "bg-violet-100 text-violet-600" },
    { icon: BookOpen, label: "Lessons", route: "#", color: "bg-emerald-100 text-emerald-600" },
    { icon: Users, label: "Students", route: "#", color: "bg-rose-100 text-rose-600" },
    { icon: ClipboardList, label: "Reports", route: "#", color: "bg-sky-100 text-sky-600" }
  ];
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-blue-100">
              <AvatarFallback className="bg-blue-500 text-white font-medium">MS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2 border-b">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500 text-white">MS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Ms. Smith</p>
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
      <section className="mb-6">
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="mb-3 flex justify-between items-center">
              <p className="text-sm text-gray-500">School Day Progress</p>
              <p className="text-sm font-medium">{formattedTime}</p>
            </div>
            <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>8:30 AM</span>
              <span>3:30 PM</span>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Today's Schedule */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Today's Classes</h2>
          <Link to="/timetable" className="text-sm text-blue-500">
            Full Schedule
          </Link>
        </div>
        
        <div className="space-y-3">
          {todayClasses.map((session, index) => (
            <Card key={index} className={`border-none rounded-xl ${
              session.status === 'current' ? 'bg-blue-50 border-l-4 border-blue-500' : 
              session.status === 'completed' ? 'bg-gray-50 opacity-75' : 'bg-white'
            }`}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{session.subject}</div>
                  <div className="text-sm text-gray-600">{session.class}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock size={12} className="mr-1" />
                    <span>{session.time}</span>
                    <span className="mx-1">•</span>
                    <span>{session.room}</span>
                  </div>
                </div>
                
                {session.status === 'current' && (
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Attendance Stats */}
      <section className="mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Today's Attendance</h3>
                <p className="text-xs text-blue-100">All Classes</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">{attendanceStats.percentage}%</div>
                <p className="text-xs text-blue-100">{attendanceStats.present}/{attendanceStats.total} Students</p>
              </div>
            </div>
            <Progress value={attendanceStats.percentage} className="h-2 mt-3 bg-blue-400/30" indicatorClassName="bg-white" />
          </CardContent>
        </Card>
      </section>
      
      {/* Quick Menu */}
      <section>
        <h2 className="text-lg font-medium mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickMenuItems.map((item, index) => (
            <Link to={item.route} key={index} className="block">
              <Card className="border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow h-24">
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <div className={`p-2 rounded-full ${item.color} mb-1`}>
                    <item.icon size={20} />
                  </div>
                  <p className="text-xs font-medium">{item.label}</p>
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
