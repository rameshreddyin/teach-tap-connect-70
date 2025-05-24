
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from 'lucide-react';

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
        return 'bg-blue-50 border-l-4 border-blue-500 shadow-md';
      case 'upcoming':
        return 'bg-white border-l-4 border-gray-300';
      case 'past':
        return 'bg-gray-50 border-l-4 border-gray-200 opacity-75';
      default:
        return 'bg-white border-l-4 border-gray-200';
    }
  };
  
  // Get class for time badge
  const getTimeBadgeClass = (timeStatus: string) => {
    switch (timeStatus) {
      case 'current':
        return 'bg-blue-500 text-white';
      case 'upcoming':
        return 'bg-gray-200 text-gray-800';
      case 'past':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-medium mb-6 text-gray-900">My Schedule</h1>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6 rounded-xl bg-gray-100 p-1 w-full">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className={`rounded-lg text-sm py-2 font-medium transition-all 
              ${day === activeDay 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
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
                  className={`overflow-hidden border-none rounded-xl ${getCardClass(timeStatus)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium text-gray-900 ${timeStatus === 'past' ? 'text-gray-500' : ''}`}>
                          {period.subject}
                        </h3>
                        
                        {period.class && (
                          <div className={`text-sm mt-1 ${timeStatus === 'past' ? 'text-gray-400' : 'text-gray-700'}`}>
                            {period.class}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${getTimeBadgeClass(timeStatus)}`}
                          >
                            <Clock size={10} className="mr-1" />
                            {period.time}
                          </span>
                        </div>
                        
                        <div className={`text-xs mt-2 ${
                          timeStatus === 'past' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {period.room}
                        </div>
                      </div>

                      {timeStatus === 'current' && (
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {timetableData[day as keyof typeof timetableData].length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No classes scheduled for this day.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
