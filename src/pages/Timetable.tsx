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
    
    console.log(`Checking time slot: ${timeSlot}`);
    console.log(`Current time: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    console.log(`Start time: ${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`);
    console.log(`End time: ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`);
    
    if (now < startDate) {
      console.log('Status: upcoming');
      return 'upcoming';
    } else if (now > endDate) {
      console.log('Status: past');
      return 'past';
    } else {
      console.log('Status: current');
      return 'current';
    }
  };
  
  // Simplified modern card styles
  const getCardClass = (timeStatus: string) => {
    switch (timeStatus) {
      case 'current':
        return 'bg-white border-gray-900 shadow-md';
      case 'upcoming':
        return 'bg-white border-gray-200 shadow-sm hover:shadow-md transition-all';
      case 'past':
        return 'bg-gray-50 border-gray-200 opacity-75';
      default:
        return 'bg-white border-gray-200 shadow-sm hover:shadow-md transition-all';
    }
  };

  const getSubjectIcon = (subject: string) => {
    if (subject.includes('Mathematics')) return '📐';
    if (subject.includes('Free Period')) return '☕';
    if (subject.includes('Meeting')) return '👥';
    if (subject.includes('Training')) return '📚';
    return '📖';
  };

  return (
    <div className="page-container bg-white min-h-screen pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
        <p className="text-gray-500">Your personalized teaching timetable</p>
      </div>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6 bg-gray-100 p-1 rounded-lg">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all
              ${day === activeDay 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => (
          <TabsContent key={day} value={day} className="mt-0 space-y-4 pb-8">
            {timetableData[day as keyof typeof timetableData].map((period, index) => {
              const timeStatus = getTimeStatus(period.time);
              
              return (
                <Card 
                  key={index}
                  className={`border rounded-lg transition-all ${getCardClass(timeStatus)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="text-2xl mr-4">{getSubjectIcon(period.subject)}</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between">
                          <h3 className="font-medium text-lg text-gray-900 mb-2">
                            {period.subject}
                            {timeStatus === 'current' && (
                              <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                                Live
                              </span>
                            )}
                          </h3>
                        </div>
                        
                        {period.class && (
                          <div className="flex items-center mb-3 text-gray-700">
                            <Users size={16} className="mr-2" />
                            <span>{period.class}</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{period.time}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            <span>{period.room}</span>
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
                <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100">
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Classes Today</h3>
                <p className="text-gray-500">Enjoy your free day</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
