
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from 'lucide-react';

// Mock data for timetable
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
};

const Timetable: React.FC = () => {
  // Get the current day (0 is Sunday, so we use 1 for Monday if it's Sun)
  const today = new Date().getDay() === 0 ? 1 : new Date().getDay();
  const defaultDay = weekdays[today - 1] || "Monday";
  const [activeDay, setActiveDay] = useState(defaultDay);

  const isPeriodActive = (timeSlot: string): boolean => {
    const now = new Date();
    const [startTime, endTime] = timeSlot.split(' - ');
    
    const getTimeDate = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(
        period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours),
        minutes,
        0
      );
      return date;
    };
    
    const startDate = getTimeDate(startTime);
    const endDate = getTimeDate(endTime);
    
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="page-container">
      <h1 className="font-bold mb-6">Timetable</h1>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay}>
        <TabsList className="grid grid-cols-5 mb-6">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="text-xs py-1"
            >
              {day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => (
          <TabsContent key={day} value={day} className="mt-0">
            <div className="space-y-3">
              {timetableData[day as keyof typeof timetableData].map((period, index) => (
                <Card 
                  key={index}
                  className={`border-none ${
                    day === activeDay && isPeriodActive(period.time)
                      ? 'bg-black text-white'
                      : 'bg-teacherApp-card'
                  }`}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{period.subject}</h3>
                    {period.class && (
                      <div className="text-sm mt-1">{period.class}</div>
                    )}
                    <div className={`flex items-center text-xs ${
                      day === activeDay && isPeriodActive(period.time)
                        ? 'text-gray-200'
                        : 'text-teacherApp-textLight'
                    } mt-1`}>
                      <Clock size={12} className="mr-1" />
                      <span>{period.time}</span>
                    </div>
                    <div className={`text-xs ${
                      day === activeDay && isPeriodActive(period.time)
                        ? 'text-gray-200'
                        : 'text-teacherApp-textLight'
                    } mt-1`}>
                      {period.room}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
