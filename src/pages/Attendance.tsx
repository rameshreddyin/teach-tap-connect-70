
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Enhanced mock data for students with roll numbers and gender
const students = [
  { id: 1, name: "Aiden Cooper", rollNumber: "B101", gender: "male", status: "present", initials: "AC" },
  { id: 2, name: "Brooke Davis", rollNumber: "G101", gender: "female", status: "absent", initials: "BD" },
  { id: 3, name: "Carlos Garcia", rollNumber: "B102", gender: "male", status: "present", initials: "CG" },
  { id: 4, name: "Dina Martinez", rollNumber: "G102", gender: "female", status: "present", initials: "DM" },
  { id: 5, name: "Elijah Jones", rollNumber: "B103", gender: "male", status: "present", initials: "EJ" },
  { id: 6, name: "Fatima Khan", rollNumber: "G103", gender: "female", status: "absent", initials: "FK" },
  { id: 7, name: "George Wilson", rollNumber: "B104", gender: "male", status: "present", initials: "GW" },
  { id: 8, name: "Hannah Lee", rollNumber: "G104", gender: "female", status: "present", initials: "HL" },
  { id: 9, name: "Isaac Newton", rollNumber: "B105", gender: "male", status: "present", initials: "IN" },
  { id: 10, name: "Julia Smith", rollNumber: "G105", gender: "female", status: "late", initials: "JS" },
  { id: 11, name: "Kevin Patel", rollNumber: "B106", gender: "male", status: "present", initials: "KP" },
  { id: 12, name: "Layla Williams", rollNumber: "G106", gender: "female", status: "permitted", initials: "LW" },
];

// Attendance status options with color coding
const attendanceOptions = [
  { value: "present", label: "Present", color: "bg-green-500" },
  { value: "late", label: "Late", color: "bg-amber-500" },
  { value: "absent", label: "Absent", color: "bg-red-500" },
  { value: "permitted", label: "Permitted", color: "bg-blue-500" }
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
  
  // Sort students: girls first, then boys
  const sortedStudents = useMemo(() => {
    return [...attendanceList].sort((a, b) => {
      // First sort by gender (females first)
      if (a.gender !== b.gender) {
        return a.gender === "female" ? -1 : 1;
      }
      // Then sort by roll number within the same gender
      return a.rollNumber.localeCompare(b.rollNumber);
    });
  }, [attendanceList]);
  
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
  
  // Get the count of students by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { present: 0, absent: 0, late: 0, permitted: 0 };
    attendanceList.forEach(student => {
      counts[student.status] = (counts[student.status] || 0) + 1;
    });
    return counts;
  }, [attendanceList]);
  
  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceList(
      attendanceList.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
    
    const option = attendanceOptions.find(opt => opt.value === status);
    if (option) {
      toast.success(`Marked ${option.label}`);
    }
  };
  
  const handleSubmit = () => {
    toast.success("Attendance submitted successfully");
    // In a real app, this would send data to a server
  };
  
  // Get the appropriate badge for a student's status
  const getStatusBadge = (status: string) => {
    const option = attendanceOptions.find(opt => opt.value === status);
    if (!option) return null;
    
    return (
      <Badge className={`${option.color} text-white`}>
        {option.label}
      </Badge>
    );
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} />
        <h1 className="font-bold">Attendance</h1>
      </div>
      
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
        
        <div className="flex justify-between items-center mb-4">
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
            <span className="font-medium text-green-600">{statusCounts.present}</span> / {sortedStudents.length} present
          </div>
        </div>
        
        <div className="flex justify-between gap-2 mb-4">
          {attendanceOptions.map(option => (
            <div key={option.value} className="text-xs flex flex-col items-center">
              <span className={`${option.color} w-3 h-3 rounded-full mb-1`}></span>
              <span>{statusCounts[option.value] || 0}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 mb-8">
        {sortedStudents.map((student) => (
          <Card key={student.id} className="border-none bg-teacherApp-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback className={`text-xs bg-gray-200 ${student.gender === 'female' ? 'text-pink-500' : 'text-blue-500'}`}>
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{student.name}</span>
                      {getStatusBadge(student.status)}
                    </div>
                    <div className="text-xs text-gray-500">{student.rollNumber}</div>
                  </div>
                </div>
                
                <Select
                  value={student.status}
                  onValueChange={(value) => handleAttendanceChange(student.id, value)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
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
