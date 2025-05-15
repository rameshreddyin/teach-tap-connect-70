
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for students
const students = [
  { id: 1, name: "Aiden Cooper", present: true, initials: "AC" },
  { id: 2, name: "Brooke Davis", present: false, initials: "BD" },
  { id: 3, name: "Carlos Garcia", present: true, initials: "CG" },
  { id: 4, name: "Dina Martinez", present: true, initials: "DM" },
  { id: 5, name: "Elijah Jones", present: true, initials: "EJ" },
  { id: 6, name: "Fatima Khan", present: false, initials: "FK" },
  { id: 7, name: "George Wilson", present: true, initials: "GW" },
  { id: 8, name: "Hannah Lee", present: true, initials: "HL" },
  { id: 9, name: "Isaac Newton", present: true, initials: "IN" },
  { id: 10, name: "Julia Smith", present: false, initials: "JS" },
  { id: 11, name: "Kevin Patel", present: true, initials: "KP" },
  { id: 12, name: "Layla Williams", present: true, initials: "LW" },
];

const Attendance: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState(students);
  const [selectedClass, setSelectedClass] = useState("9A");
  const [date, setDate] = useState(new Date());
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  const handlePreviousDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    setDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };
  
  const handleAttendanceChange = (studentId: number, isPresent: boolean) => {
    setAttendanceList(
      attendanceList.map(student => 
        student.id === studentId ? { ...student, present: isPresent } : student
      )
    );
  };
  
  const handleSubmit = () => {
    toast.success("Attendance submitted successfully");
    // In a real app, this would send data to a server
  };

  return (
    <div className="page-container">
      <h1 className="font-bold mb-4">Attendance</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePreviousDay}
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="font-medium">{formattedDate}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNextDay}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9A">Class 9A</SelectItem>
              <SelectItem value="9B">Class 9B</SelectItem>
              <SelectItem value="10A">Class 10A</SelectItem>
              <SelectItem value="10B">Class 10B</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-teacherApp-textLight">
            <span className="font-medium text-green-600">{attendanceList.filter(s => s.present).length}</span> / {attendanceList.length} present
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-8">
        {attendanceList.map((student) => (
          <Card key={student.id} className="border-none bg-teacherApp-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback className="text-xs bg-gray-200 text-teacherApp-accent">
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.name}</span>
                </div>
                <Switch 
                  checked={student.present} 
                  onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button 
        className="w-full bg-teacherApp-accent hover:bg-black text-white"
        onClick={handleSubmit}
      >
        Submit Attendance
      </Button>
    </div>
  );
};

export default Attendance;
