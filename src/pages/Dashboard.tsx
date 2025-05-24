import React, { useState, useEffect } from 'react';
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
  ClipboardList,
  Heart,
  Gift,
  Sparkles
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const formattedTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate('/');
  };
  
  // Check for special days
  const getSpecialDay = () => {
    const month = today.getMonth();
    const date = today.getDate();
    const day = today.getDay();
    
    // Mother's Day (second Sunday of May)
    if (month === 4) {
      const firstSunday = new Date(today.getFullYear(), 4, 1);
      while (firstSunday.getDay() !== 0) {
        firstSunday.setDate(firstSunday.getDate() + 1);
      }
      const secondSunday = new Date(firstSunday);
      secondSunday.setDate(firstSunday.getDate() + 7);
      if (date === secondSunday.getDate()) {
        return { type: 'mothers-day', emoji: '💝', message: "Happy Mother's Day!" };
      }
    }
    
    // Christmas
    if (month === 11 && date === 25) {
      return { type: 'christmas', emoji: '🎄', message: "Merry Christmas!" };
    }
    
    // New Year
    if (month === 0 && date === 1) {
      return { type: 'new-year', emoji: '🎊', message: "Happy New Year!" };
    }
    
    return null;
  };
  
  const specialDay = getSpecialDay();
  const isHoliday = specialDay && (specialDay.type === 'christmas' || specialDay.type === 'new-year' || specialDay.type === 'mothers-day');
  
  // Function to get time status for classes
  const getTimeStatus = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(' - ');
    
    const parseTimeString = (timeStr: string) => {
      const [time, period] = timeStr.trim().split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      const date = new Date();
      date.setHours(hour24, minutes, 0, 0);
      return date;
    };
    
    const startDate = parseTimeString(startTime);
    const endDate = parseTimeString(endTime);
    const now = new Date();
    
    if (now < startDate) {
      return 'upcoming';
    } else if (now > endDate) {
      return 'past';
    } else {
      return 'current';
    }
  };
  
  // Mock data with corrected time status
  const todayClasses = [
    { time: "10:00 AM - 10:45 AM", subject: "Mathematics", class: "Class 9A", room: "Room 101" },
    { time: "11:00 AM - 11:45 AM", subject: "Mathematics", class: "Class 10B", room: "Room 203" },
    { time: "1:30 PM - 2:15 PM", subject: "Mathematics", class: "Class 8C", room: "Room 105" },
  ].map(session => ({
    ...session,
    status: getTimeStatus(session.time)
  }));
  
  const quickMenuItems = [
    { icon: ListChecks, label: "Attendance", route: "/attendance" },
    { icon: Bell, label: "Notices", route: "/announcements" },
    { icon: CalendarDays, label: "Timetable", route: "/timetable" },
    { icon: BookOpen, label: "Lessons", route: "#" },
    { icon: Users, label: "Students", route: "#" },
    { icon: ClipboardList, label: "Reports", route: "#" },
    { icon: GraduationCap, label: "Grades", route: "#" },
    { icon: User, label: "Profile", route: "#" }
  ];
  
  return (
    <div className="page-container bg-gray-50">
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm mt-1">{formattedDate}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-gray-200 hover:ring-gray-300 transition-all hover:scale-105">
              <AvatarFallback className="bg-gray-900 text-white font-semibold text-lg">MS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg animate-scale-in">
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
      
      {/* Quick Menu - Enhanced Design */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickMenuItems.map((item, index) => (
            <Link to={item.route} key={index} className="block">
              <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1 group">
                <CardContent className="p-0 h-full">
                  <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg p-3">
                    <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 mb-3 transition-all duration-300 group-hover:scale-110">
                      <item.icon size={20} className="text-gray-900 group-hover:text-gray-800" />
                    </div>
                    <p className="text-sm font-medium text-center text-gray-800 group-hover:text-black transition-colors">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Today's Schedule or Holiday Message */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isHoliday ? "Holiday Time!" : "Today's Classes"}
          </h2>
          {!isHoliday && (
            <Link to="/timetable" className="text-sm text-gray-700 hover:text-gray-900 font-medium">
              View All
            </Link>
          )}
        </div>
        
        {isHoliday ? (
          <Card className={`border shadow-sm ${
            specialDay.type === 'mothers-day' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200' :
            specialDay.type === 'christmas' ? 'bg-gradient-to-r from-red-50 to-green-50 border-red-200' : 
            'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
          } animate-scale-in transition-all hover:shadow-md`}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">{specialDay.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{specialDay.message}</h3>
              <p className="text-gray-600 mb-4">No Classes Today!</p>
              <div className="flex justify-center gap-2">
                <Gift className="h-5 w-5 text-purple-500 animate-pulse" />
                <Heart className="h-5 w-5 text-red-500 animate-pulse" />
                <Gift className="h-5 w-5 text-purple-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayClasses.map((session, index) => (
              <Card 
                key={index} 
                className={`border shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in ${
                  session.status === 'current' ? 'bg-gray-50 border-gray-900' : 
                  session.status === 'completed' ? 'bg-gray-50 opacity-80' : 'bg-white hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
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
                      <div className="h-2 w-2 rounded-full bg-gray-900 animate-pulse" />
                      <span className="text-xs font-medium text-gray-900">Live</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
