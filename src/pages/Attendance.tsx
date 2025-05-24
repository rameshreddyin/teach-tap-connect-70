
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  { value: "present", label: "Present", color: "bg-green-500", icon: CheckCircle },
  { value: "late", label: "Late", color: "bg-amber-500", icon: Clock },
  { value: "absent", label: "Absent", color: "bg-red-500", icon: XCircle },
  { value: "permitted", label: "Permitted", color: "bg-blue-500", icon: Calendar }
];

const Attendance: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState(students);
  const [selectedClass, setSelectedClass] = useState("9A");
  const [date, setDate] = useState(new Date());
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
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
  
  const handleBulkStatusChange = (status: string) => {
    if (selectedStudents.length === 0) return;
    
    setAttendanceList(
      attendanceList.map(student => 
        selectedStudents.includes(student.id) ? { ...student, status } : student
      )
    );
    
    const option = attendanceOptions.find(opt => opt.value === status);
    if (option) {
      toast.success(`Marked ${selectedStudents.length} students as ${option.label}`);
      setSelectedStudents([]);
      setIsSelectMode(false);
    }
  };
  
  const handleToggleSelect = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedStudents.length === sortedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(sortedStudents.map(s => s.id));
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
  
  // Quick mark all students as present
  const handleMarkAllPresent = () => {
    setAttendanceList(
      attendanceList.map(student => ({ ...student, status: 'present' }))
    );
    toast.success("All students marked present");
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <h1 className="font-bold">Attendance</h1>
        </div>
        
        {isSelectMode ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedStudents.length === sortedStudents.length ? "Deselect All" : "Select All"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsSelectMode(false);
                setSelectedStudents([]);
              }}
              className="text-xs"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSelectMode(true)}
            className="text-xs"
          >
            Select Multiple
          </Button>
        )}
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
        
        {/* Quick Actions Bar */}
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                >
                  <CheckCircle size={16} />
                  All Present
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark all students present?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark all students as present for today. Any existing attendance records will be overwritten.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkAllPresent}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {isSelectMode && selectedStudents.length > 0 && (
            <div className="flex gap-1">
              {attendanceOptions.map(option => (
                <Button
                  key={option.value}
                  size="sm"
                  variant="ghost"
                  className={`p-1.5 ${option.color} text-white rounded-md`}
                  onClick={() => handleBulkStatusChange(option.value)}
                >
                  <option.icon size={14} />
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Status Summary */}
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
          <Card key={student.id} className={`border-none bg-teacherApp-card ${isSelectMode && selectedStudents.includes(student.id) ? 'ring-2 ring-blue-400' : ''}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1" onClick={() => isSelectMode && handleToggleSelect(student.id)}>
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
                
                {isSelectMode ? (
                  <div className="w-5 h-5 rounded border flex items-center justify-center" onClick={() => handleToggleSelect(student.id)}>
                    {selectedStudents.includes(student.id) && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    {attendanceOptions.map(option => (
                      <button
                        key={option.value}
                        className={`p-1.5 rounded-md ${student.status === option.value ? option.color : 'bg-gray-100'} 
                                  ${student.status === option.value ? 'text-white' : 'text-gray-500'}
                                  transition-colors hover:opacity-90`}
                        onClick={() => handleAttendanceChange(student.id, option.value)}
                      >
                        <option.icon size={14} />
                      </button>
                    ))}
                  </div>
                )}
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
