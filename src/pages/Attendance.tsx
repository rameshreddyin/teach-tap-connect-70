
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, CheckCircle, XCircle, Clock, Calendar, Edit } from 'lucide-react';
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  // Determine if the selected date is today, in the past, or in the future
  const dateStatus = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime()) return "today";
    if (selectedDate < today) return "past";
    return "future";
  }, [date]);
  
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

  const handleEditAttendance = () => {
    // In a real app, this would navigate to an edit mode or show a different interface
    toast.info("Editing attendance for previous date");
  };

  // Quick status toggle for mobile
  const handleQuickToggle = (studentId: number) => {
    const student = attendanceList.find(s => s.id === studentId);
    if (!student) return;
    
    let newStatus: string;
    
    // Cycle through statuses: present -> late -> absent -> permitted -> present
    switch(student.status) {
      case 'present': newStatus = 'late'; break;
      case 'late': newStatus = 'absent'; break;
      case 'absent': newStatus = 'permitted'; break;
      case 'permitted': 
      default: newStatus = 'present';
    }
    
    handleAttendanceChange(studentId, newStatus);
  };

  return (
    <div className="page-container pb-24 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={isMobile ? 18 : 20} className="text-gray-800" />
          <h1 className="font-bold text-gray-900 text-xl md:text-2xl">Attendance</h1>
        </div>
        
        {dateStatus !== "future" && !isMobile && (
          isSelectMode ? (
            <div className="flex items-center gap-2 animate-scale-in">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                className="text-xs transition-all hover:bg-gray-100"
              >
                {selectedStudents.length === sortedStudents.length ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedStudents([]);
                }}
                className="text-xs transition-all hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSelectMode(true)}
              className="text-xs transition-all hover:bg-gray-100 animate-fade-in"
            >
              Select Multiple
            </Button>
          )
        )}
      </div>
      
      {/* Date Selection and Class Selection - More compact for mobile */}
      <div className="mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Card className="shadow-sm border border-gray-100 mb-3">
          <CardContent className={`p-3 ${isMobile ? 'py-2' : 'p-4'}`}>
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePreviousDay}
                className="transition-all hover:bg-gray-100 hover:scale-105"
              >
                <ChevronLeft size={isMobile ? 16 : 20} />
              </Button>
              <span className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} text-gray-900`}>{formattedDate}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNextDay}
                className="transition-all hover:bg-gray-100 hover:scale-105"
              >
                <ChevronRight size={isMobile ? 16 : 20} />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger className={`${isMobile ? 'w-28 h-9 text-sm' : 'w-32'} bg-white border-gray-200 shadow-sm transition-all hover:border-gray-300`}>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="animate-scale-in">
              <SelectItem value="9A">Class 9A</SelectItem>
              <SelectItem value="9B">Class 9B</SelectItem>
              <SelectItem value="10A">Class 10A</SelectItem>
              <SelectItem value="10B">Class 10B</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-teacherApp-textLight rounded-full px-3 py-1 bg-white shadow-sm border border-gray-100">
            <span className="font-medium text-green-600">{statusCounts.present}</span> / {sortedStudents.length} present
          </div>
          
          {/* Mobile select mode toggle */}
          {dateStatus !== "future" && isMobile && (
            isSelectMode ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedStudents([]);
                }}
                className="text-xs h-9 transition-all hover:bg-gray-100 ml-auto"
              >
                Cancel Selection
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSelectMode(true)}
                className="text-xs h-9 transition-all hover:bg-gray-100 ml-auto animate-fade-in"
              >
                Select
              </Button>
            )
          )}
        </div>
        
        {/* Status based UI - different for today/past/future */}
        {dateStatus === "future" ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center my-6 shadow-sm border border-gray-100 animate-scale-in">
            <Calendar size={40} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 font-medium">Cannot take attendance for future dates</p>
            <p className="text-sm text-gray-400 mt-1">Please select today or a past date</p>
          </div>
        ) : (
          <>
            {/* Quick Actions Bar */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex gap-2">
                {dateStatus === "today" ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700 transition-all hover:scale-105"
                      >
                        <CheckCircle size={isMobile ? 14 : 16} className={isMobile ? "mr-1" : "mr-2"} />
                        {isMobile ? "All" : "All Present"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-scale-in max-w-xs mx-auto">
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
                ) : (
                  <Button 
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 transition-all hover:scale-105"
                    onClick={handleEditAttendance}
                  >
                    <Edit size={isMobile ? 14 : 16} className={isMobile ? "mr-1" : "mr-2"} />
                    {isMobile ? "Edit" : "Edit Record"}
                  </Button>
                )}
              </div>
              
              {isSelectMode && selectedStudents.length > 0 && dateStatus === "today" && (
                <div className="flex gap-1 animate-fade-in">
                  {attendanceOptions.map(option => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant="ghost"
                      className={`p-1.5 ${option.color} text-white rounded-md transition-all hover:opacity-90 hover:scale-105`}
                      onClick={() => handleBulkStatusChange(option.value)}
                    >
                      <option.icon size={isMobile ? 12 : 14} />
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Status Summary Cards - More compact for mobile */}
            <div className={`grid grid-cols-4 gap-1 mb-4 animate-fade-in`} style={{ animationDelay: "300ms" }}>
              {attendanceOptions.map((option, index) => (
                <Card 
                  key={option.value} 
                  className={`${option.color} bg-opacity-10 border-none shadow-sm transition-all duration-200 hover:scale-105`}
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  <CardContent className={`flex items-center justify-between p-3 ${isMobile ? 'py-2' : ''}`}>
                    <div className="flex items-center">
                      <div className={`${option.color} rounded-full p-1 flex items-center justify-center mr-2`}>
                        <option.icon size={isMobile ? 12 : 16} className="text-white" />
                      </div>
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {statusCounts[option.value] || 0}
                      </span>
                    </div>
                    <span className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {isMobile ? option.label.substring(0, 4) : option.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Select All button for mobile */}
      {isSelectMode && isMobile && (
        <div className="mb-3 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSelectAll}
            className="w-full text-xs border border-gray-200 shadow-sm"
          >
            {selectedStudents.length === sortedStudents.length ? "Deselect All Students" : "Select All Students"}
          </Button>
        </div>
      )}
      
      {/* Student List - Optimized for mobile */}
      <div className="space-y-2 mb-6">
        {sortedStudents.map((student, index) => (
          <Card 
            key={student.id} 
            className={`border-none shadow-sm transition-all duration-200 ${isSelectMode && selectedStudents.includes(student.id) ? 'ring-2 ring-blue-400' : ''}
              ${student.status === 'present' ? 'bg-green-50' : 
                student.status === 'absent' ? 'bg-red-50' : 
                student.status === 'late' ? 'bg-amber-50' : 
                student.status === 'permitted' ? 'bg-blue-50' : 'bg-white'}`}
            style={{ animationDelay: `${400 + index * 30}ms` }}  
          >
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center justify-between">
                <div 
                  className={`flex items-center flex-1 ${dateStatus !== "future" && isSelectMode ? 'cursor-pointer' : ''}`} 
                  onClick={() => dateStatus !== "future" && isSelectMode && handleToggleSelect(student.id)}
                >
                  <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} mr-3 ${isSelectMode && selectedStudents.includes(student.id) ? 'ring-2 ring-blue-400' : ''} transition-all`}>
                    <AvatarFallback className={`text-xs ${student.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                        {student.name}
                      </span>
                      {!isMobile && getStatusBadge(student.status)}
                    </div>
                    <div className={`${isMobile ? 'text-xs flex items-center gap-2' : 'text-xs'} text-gray-500`}>
                      <span>{student.rollNumber}</span>
                      {isMobile && getStatusBadge(student.status)}
                    </div>
                  </div>
                </div>
                
                {dateStatus !== "future" && (isSelectMode ? (
                  <div 
                    className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all`} 
                    onClick={() => handleToggleSelect(student.id)}
                  >
                    {selectedStudents.includes(student.id) && (
                      <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`} />
                    )}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    {dateStatus === "today" ? (
                      isMobile ? (
                        // Mobile: One-tap toggle button
                        <button
                          className={`p-1.5 rounded-full transition-all active:scale-90 ${
                            student.status === 'present' ? 'bg-green-500' : 
                            student.status === 'absent' ? 'bg-red-500' :
                            student.status === 'late' ? 'bg-amber-500' : 'bg-blue-500'
                          } text-white`}
                          onClick={() => handleQuickToggle(student.id)}
                        >
                          {student.status === 'present' ? <CheckCircle size={14} /> : 
                           student.status === 'absent' ? <XCircle size={14} /> : 
                           student.status === 'late' ? <Clock size={14} /> : <Calendar size={14} />}
                        </button>
                      ) : (
                        // Desktop: Individual status buttons
                        attendanceOptions.map(option => (
                          <button
                            key={option.value}
                            className={`p-1.5 rounded-md ${student.status === option.value ? option.color : 'bg-gray-100'} 
                                    ${student.status === option.value ? 'text-white' : 'text-gray-500'}
                                    transition-all hover:scale-110`}
                            onClick={() => handleAttendanceChange(student.id, option.value)}
                          >
                            <option.icon size={14} />
                          </button>
                        ))
                      )
                    ) : (
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="p-1 text-blue-500 hover:text-blue-700 transition-all hover:scale-110"
                        onClick={handleEditAttendance}
                      >
                        <Edit size={isMobile ? 12 : 14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Fixed bottom button for better mobile experience */}
      {dateStatus !== "future" && (
        <div className="fixed bottom-16 left-0 right-0 p-3 bg-white border-t border-gray-200 flex justify-center shadow-lg animate-fade-in z-10">
          <Button 
            className="w-full max-w-md bg-teacherApp-accent hover:bg-black text-white shadow-md hover:shadow-lg transition-all animate-scale-in"
            onClick={handleSubmit}
          >
            {dateStatus === "past" ? "Update Attendance" : "Submit Attendance"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
