import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Users, Calendar } from 'lucide-react';

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
  // Get the current day (0 is Sunday, 6 is Saturday)
  const today = new Date().getDay();
  // Map day numbers to weekday names (1 for Monday, etc.)
  const dayMap = {
    0: "Monday", // Default to Monday if it's Sunday
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
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const isPeriodActive = (timeSlot: string): boolean => {
    // Only check if the period is active when it's the current day
    if (activeDay !== dayMap[today as keyof typeof dayMap]) {
      return false;
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
    
    return currentTime >= startDate && currentTime <= endDate;
  };
  
  // Get time status for styling
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
  
  // Get class for card based on time status
  const getCardClass = (timeStatus: string) => {
    switch (timeStatus) {
      case 'current':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-none shadow-lg scale-[1.02]';
      case 'upcoming':
        return 'bg-white border-none shadow-md hover:shadow-lg';
      case 'past':
        return 'bg-gray-50 border-none shadow-sm opacity-70';
      default:
        return 'bg-white border-none shadow-md';
    }
  };

  const getSubjectGradient = (subject: string) => {
    if (subject.includes('Mathematics')) return 'from-blue-500 to-blue-600';
    if (subject.includes('Free Period')) return 'from-green-500 to-green-600';
    if (subject.includes('Meeting')) return 'from-purple-500 to-purple-600';
    if (subject.includes('Training')) return 'from-orange-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          My Schedule
        </h1>
        <p className="text-gray-500">Your weekly teaching timetable</p>
      </div>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6 rounded-2xl bg-gray-100 p-1.5 w-full h-14">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className={`rounded-xl text-sm py-3 font-semibold transition-all duration-300
              ${day === activeDay 
                ? 'bg-white shadow-lg text-gray-900 scale-105' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => (
          <TabsContent key={day} value={day} className="mt-0 space-y-3">
            {timetableData[day as keyof typeof timetableData].map((period, index) => {
              const timeStatus = getTimeStatus(period.time);
              
              return (
                <Card 
                  key={index}
                  className={`overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] ${getCardClass(timeStatus)}`}
                >
                  <CardContent className="p-0">
                    <div className={`h-1.5 bg-gradient-to-r ${getSubjectGradient(period.subject)}`}></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-bold text-lg ${timeStatus === 'past' ? 'text-gray-500' : 'text-gray-900'}`}>
                              {period.subject}
                            </h3>
                            {timeStatus === 'current' && (
                              <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                Live
                              </div>
                            )}
                          </div>
                          
                          {period.class && (
                            <div className={`flex items-center mb-3 ${timeStatus === 'past' ? 'text-gray-400' : 'text-gray-700'}`}>
                              <Users size={16} className="mr-2" />
                              <span className="font-medium">{period.class}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock size={14} className="mr-2" />
                              <span>{period.time}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-2" />
                              <span>{period.room}</span>
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
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No classes scheduled</p>
                <p className="text-gray-400 text-sm">Enjoy your free day!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
