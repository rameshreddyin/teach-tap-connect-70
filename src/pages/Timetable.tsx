
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

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

// Attendance status options
const attendanceOptions = [
  { value: "present", label: "Present", color: "bg-green-500" },
  { value: "late", label: "Late", color: "bg-amber-500" },
  { value: "absent", label: "Absent", color: "bg-red-500" },
  { value: "permitted", label: "Permitted", color: "bg-blue-500" }
];

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
  
  // State to track attendance for each class
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const isPeriodActive = (timeSlot: string): boolean => {
    // Only check if the period is active when it's the current day
    if (activeDay !== dayMap[today as keyof typeof dayMap]) {
      return false;
    }

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

  const handleAttendanceChange = (periodKey: string, value: string) => {
    setAttendance((prev) => ({
      ...prev,
      [periodKey]: value
    }));

    // Show a toast notification
    const option = attendanceOptions.find(opt => opt.value === value);
    toast.success(`Marked as ${option?.label}`);
  };

  // Generate a unique key for each period to track attendance
  const getPeriodKey = (day: string, index: number, subject: string) => {
    return `${day}-${index}-${subject}`;
  };

  // Get attendance status badge
  const getAttendanceStatus = (periodKey: string) => {
    const status = attendance[periodKey];
    if (!status) return null;
    
    const option = attendanceOptions.find(opt => opt.value === status);
    if (!option) return null;
    
    return (
      <Badge 
        className={`${option.color} text-white mt-1`}
      >
        {option.label}
      </Badge>
    );
  };

  return (
    <div className="page-container">
      <h1 className="font-bold mb-6">Timetable</h1>
      
      <Tabs defaultValue={defaultDay} onValueChange={setActiveDay}>
        <TabsList className="grid grid-cols-6 mb-6 bg-teacherApp-card">
          {weekdays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className={`text-xs py-1 ${day === defaultDay && day === activeDay ? 'bg-white text-black' : ''}`}
            >
              {day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => (
          <TabsContent key={day} value={day} className="mt-0">
            <div className="space-y-3">
              {timetableData[day as keyof typeof timetableData].map((period, index) => {
                const isActive = isPeriodActive(period.time);
                const periodKey = getPeriodKey(day, index, period.subject);
                const status = attendance[periodKey];
                
                return (
                  <Card 
                    key={index}
                    className={`border-none ${
                      isActive
                        ? 'bg-teacherApp-accent text-white'
                        : 'bg-teacherApp-card'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{period.subject}</h3>
                          {period.class && (
                            <div className="text-sm mt-1">{period.class}</div>
                          )}
                          <div className={`flex items-center text-xs ${
                            isActive
                              ? 'text-gray-200'
                              : 'text-teacherApp-textLight'
                          } mt-1`}>
                            <Clock size={12} className="mr-1" />
                            <span>{period.time}</span>
                          </div>
                          <div className={`text-xs ${
                            isActive
                              ? 'text-gray-200'
                              : 'text-teacherApp-textLight'
                          } mt-1`}>
                            {period.room}
                          </div>
                          
                          {getAttendanceStatus(periodKey)}
                        </div>

                        {period.class && (
                          <Select
                            value={status}
                            onValueChange={(value) => handleAttendanceChange(periodKey, value)}
                          >
                            <SelectTrigger 
                              className={`w-32 h-8 text-xs border-0 ${
                                isActive ? 'bg-white text-black' : 'bg-white'
                              }`}
                            >
                              <SelectValue placeholder="Mark" />
                            </SelectTrigger>
                            <SelectContent>
                              {attendanceOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="text-xs flex items-center"
                                >
                                  <div className="flex items-center">
                                    <span className={`w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Timetable;
