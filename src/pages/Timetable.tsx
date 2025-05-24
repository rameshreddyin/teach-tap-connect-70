
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Users, Calendar, Sparkles, Coffee } from 'lucide-react';

// Mock data for timetable
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timetableData = {
  Monday: [
    { time: "8:30 AM - 9:15 AM", subject: "Mathematics", class: "Class 9A", room: "Room 101" },
    { time: "9:30 AM - 10:15 AM", subject: "Mathematics", class: "Class 10B", room: "Room 203" },
    { time: "10:30 AM - 11:15 AM", subject: "Free Period", class: "", room: "Staff Room" },
    { time: "11:30 AM - 12:15 PM", subject: "Mathematics", class: "Class 8C", room: "Room 105" },
    { time: "1:30 PM - 2:15 PM", subject: "Mathematics", class: "Class 9B", room: "Room 102" },
  ],
  Tuesday: [
    { time: "8:30 AM - 9:15 AM", subject: "Mathematics", class: "Class 10A", room: "Room 201" },
    { time: "9:30 AM - 10:15 AM", subject: "Mathematics", class: "Class 8A", room: "Room 103" },
    { time: "10:30 AM - 11:15 AM", subject: "Department Meeting", class: "", room: "Conference Room" },
    { time: "11:30 AM - 12:15 PM", subject: "Free Period", class: "", room: "Staff Room" },
    { time: "1:30 PM - 2:15 PM", subject: "Mathematics", class: "Class 9A", room: "Room 101" },
  ],
  Wednesday: [
    { time: "8:30 AM - 9:15 AM", subject: "Mathematics", class: "Class 8B", room: "Room 104" },
    { time: "9:30 AM - 10:15 AM", subject: "Mathematics", class: "Class 9B", room: "Room 102" },
    { time: "10:30 AM - 11:15 AM", subject: "Mathematics", class: "Class 10A", room: "Room 201" },
    { time: "11:30 AM - 12:15 PM", subject: "Free Period", class: "", room: "Staff Room" },
    { time: "1:30 PM - 2:15 PM", subject: "Mathematics", class: "Class 8C", room: "Room 105" },
  ],
  Thursday: [
    { time: "8:30 AM - 9:15 AM", subject: "Mathematics", class: "Class 9A", room: "Room 101" },
    { time: "9:30 AM - 10:15 AM", subject: "Free Period", class: "", room: "Staff Room" },
    { time: "10:30 AM - 11:15 AM", subject: "Mathematics", class: "Class 10B", room: "Room 203" },
    { time: "11:30 AM - 12:15 PM", subject: "Mathematics", class: "Class 8A", room: "Room 103" },
    { time: "1:30 PM - 2:15 PM", subject: "Staff Meeting", class: "", room: "Conference Room" },
  ],
  Friday: [
    { time: "8:30 AM - 9:15 AM", subject: "Mathematics", class: "Class 8B", room: "Room 104" },
    { time: "9:30 AM - 10:15 AM", subject: "Mathematics", class: "Class 9B", room: "Room 102" },
    { time: "10:30 AM - 11:15 AM", subject: "Mathematics", class: "Class 10A", room: "Room 201" },
    { time: "11:30 AM - 12:15 PM", subject: "Mathematics", class: "Class 8C", room: "Room 105" },
    { time: "1:30 PM - 2:15 PM", subject: "Free Period", class: "", room: "Staff Room" },
  ],
  Saturday: [
    { time: "9:30 AM - 10:15 AM", subject: "Extra Mathematics", class: "Class 10A", room: "Room 201" },
    { time: "10:30 AM - 11:15 AM", subject: "Extra Mathematics", class: "Class 10B", room: "Room 203" },
    { time: "11:30 AM - 12:15 PM", subject: "Teacher Training", class: "", room: "Conference Room" },
  ],
};

const Timetable: React.FC = () => {
  const today = new Date().getDay();
  const dayMap = {
    0: "Monday",
    1: "Monday",
    2: "Tuesday", 
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  };
  const defaultDay = dayMap[today as keyof typeof dayMap] || "Monday";
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const getTimeStatus = (timeSlot: string) => {
    if (activeDay !== dayMap[today as keyof typeof dayMap]) {
      return 'inactive';
    }
    
    const [startTime, endTime] = timeSlot.split(' - ');
    
    const getTimeDate = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date(currentTime);
      date.setHours(
        period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours),
        minutes,
        0
      );
      return date;
    };
    
    const startDate = getTimeDate(startTime);
    const endDate = getTimeDate(endTime);
    
    if (currentTime < startDate) {
      return 'upcoming';
    } else if (currentTime > endDate) {
      return 'past';
    } else {
      return 'current';
    }
  };
  
  const getCardClass = (timeStatus: string) => {
    switch (timeStatus) {
      case 'current':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-300 shadow-xl scale-105 ring-2 ring-blue-200';
      case 'upcoming':
        return 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300';
      case 'past':
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-sm opacity-75';
      default:
        return 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300';
    }
  };

  const getSubjectIcon = (subject: string) => {
    if (subject.includes('Mathematics')) return '📐';
    if (subject.includes('Free Period')) return '☕';
    if (subject.includes('Meeting')) return '👥';
    if (subject.includes('Training')) return '📚';
    return '📖';
  };

  const getSubjectGradient = (subject: string) => {
    if (subject.includes('Mathematics')) return 'from-blue-500 to-indigo-600';
    if (subject.includes('Free Period')) return 'from-green-500 to-emerald-600';
    if (subject.includes('Meeting')) return 'from-purple-500 to-violet-600';
    if (subject.includes('Training')) return 'from-orange-500 to-amber-600';
    return 'from-gray-500 to-slate-600';
  };

  return (
    <div className="page-container bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            My Schedule
          </h1>
          <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg">Your personalized teaching timetable</p>
      </div>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8 rounded-3xl bg-white/80 backdrop-blur-sm p-2 w-full h-16 shadow-lg border border-white/20">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className={`rounded-2xl text-sm py-3 font-bold transition-all duration-500 relative overflow-hidden
              ${day === activeDay 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110 transform' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:scale-105'
              }`}
            >
              <span className="relative z-10">{day.substring(0, 3)}</span>
              {day === activeDay && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => (
          <TabsContent key={day} value={day} className="mt-0 space-y-4">
            {timetableData[day as keyof typeof timetableData].map((period, index) => {
              const timeStatus = getTimeStatus(period.time);
              
              return (
                <Card 
                  key={index}
                  className={`overflow-hidden rounded-3xl transition-all duration-500 hover:scale-102 border-2 ${getCardClass(timeStatus)}`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fade-in 0.6s ease-out forwards'
                  }}
                >
                  <CardContent className="p-0 relative">
                    <div className={`h-2 bg-gradient-to-r ${getSubjectGradient(period.subject)} relative overflow-hidden`}>
                      {timeStatus === 'current' && (
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      )}
                    </div>
                    <div className="p-6 relative">
                      {timeStatus === 'current' && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                            LIVE NOW
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getSubjectIcon(period.subject)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className={`font-bold text-xl ${timeStatus === 'past' ? 'text-gray-500' : 'text-gray-900'}`}>
                              {period.subject}
                            </h3>
                          </div>
                          
                          {period.class && (
                            <div className={`flex items-center mb-4 ${timeStatus === 'past' ? 'text-gray-400' : 'text-gray-700'}`}>
                              <Users size={18} className="mr-3" />
                              <span className="font-semibold text-lg">{period.class}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                              <Clock size={16} className="mr-2" />
                              <span className="font-medium">{period.time}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                              <MapPin size={16} className="mr-2" />
                              <span className="font-medium">{period.room}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {timetableData[day as keyof typeof timetableData].length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Classes Today!</h3>
                <p className="text-gray-500 text-lg">Enjoy your free day and relax! 🌟</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Coffee className="h-6 w-6 text-amber-500 animate-bounce" />
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                  <Coffee className="h-6 w-6 text-amber-500 animate-bounce" />
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
