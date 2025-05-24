
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
import { Toggle } from "@/components/ui/toggle";

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

// Simplified attendance status options with subtle colors
const attendanceOptions = [
  { value: "present", label: "Present", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  { value: "late", label: "Late", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  { value: "absent", label: "Absent", color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle },
  { value: "permitted", label: "Permitted", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar }
];

const Attendance: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState(students);
  const [selectedClass, setSelectedClass] = useState("9A");
  const [date, setDate] = useState(new Date());
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const isMobile = useIsMobile();
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short'
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
    setActiveStatus(null);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
    setActiveStatus(null);
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
      toast.success(`Marked ${option.label}`, {
        duration: 1500
      });
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
      toast.success(`Marked ${selectedStudents.length} students as ${option.label}`, {
        duration: 1500
      });
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
    toast.success("Attendance submitted successfully", {
      duration: 2000
    });
    // In a real app, this would send data to a server
  };
  
  // Get the appropriate badge for a student's status
  const getStatusBadge = (status: string) => {
    const option = attendanceOptions.find(opt => opt.value === status);
    if (!option) return null;
    
    return (
      <Badge className={`${option.color} animate-fade-in border`}>
        <option.icon className="mr-1 h-3 w-3" />
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
  
  // Bulk marking with active status
  const setStatusForSelected = (status: string) => {
    if (activeStatus === status) {
      setActiveStatus(null);
    } else {
      setActiveStatus(status);
    }
  };

  // Apply the active status to a student when clicked
  const handleStudentClick = (studentId: number) => {
    if (!activeStatus) return;
    
    handleAttendanceChange(studentId, activeStatus);
  };

  return (
    <div className="page-container pb-24 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={isMobile ? 18 : 20} className="text-gray-800" />
          <h1 className="font-bold text-gray-800 text-xl md:text-2xl">Attendance</h1>
        </div>
      </div>
      
      {/* Date Selection and Class Selection */}
      <div className="mb-4 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <Card className="shadow-sm border-gray-100 mb-3">
          <CardContent className="p-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePreviousDay}
              className="transition-all hover:bg-gray-100"
            >
              <ChevronLeft size={isMobile ? 16 : 18} />
            </Button>
            <span className="font-medium text-gray-800 text-lg">{formattedDate}</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNextDay}
              className="transition-all hover:bg-gray-100"
            >
              <ChevronRight size={isMobile ? 16 : 18} />
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between mb-4 gap-2">
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger className="w-32 bg-white border-gray-200 shadow-sm transition-all hover:border-gray-300">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="animate-scale-in">
              <SelectItem value="9A">Class 9A</SelectItem>
              <SelectItem value="9B">Class 9B</SelectItem>
              <SelectItem value="10A">Class 10A</SelectItem>
              <SelectItem value="10B">Class 10B</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-gray-600 rounded-full px-3 py-1 bg-white shadow-sm border border-gray-100">
            <span className="font-medium text-emerald-600">{statusCounts.present}</span> / {sortedStudents.length} present
          </div>
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
            {/* New UI: Direct attendance marking buttons */}
            {dateStatus === "today" && (
              <div className="mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 mb-1">Quick Mark Mode:</p>
                  <div className="flex gap-2 flex-wrap">
                    {attendanceOptions.map(option => (
                      <Toggle
                        key={option.value}
                        pressed={activeStatus === option.value}
                        onPressedChange={() => setStatusForSelected(option.value)}
                        className={`flex-1 gap-1 border ${
                          activeStatus === option.value 
                            ? option.color
                            : 'bg-white border-gray-200'
                        } transition-all`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{option.label}</span>
                      </Toggle>
                    ))}
                  </div>
                  {activeStatus && (
                    <p className="text-xs text-gray-500 mt-1 animate-fade-in">
                      Click on a student to mark them as <span className="font-medium">{
                        attendanceOptions.find(opt => opt.value === activeStatus)?.label
                      }</span>
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between my-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700 transition-all"
                      >
                        <CheckCircle size={14} className="mr-2" />
                        All Present
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-scale-in max-w-xs mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark all students present?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark all students as present for today.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkAllPresent}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsSelectMode(!isSelectMode)}
                    className="text-xs transition-all hover:bg-gray-100 animate-fade-in"
                  >
                    {isSelectMode ? "Cancel Selection" : "Select Multiple"}
                  </Button>
                </div>
                
                {isSelectMode && selectedStudents.length > 0 && (
                  <div className="flex gap-2 items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-3 animate-fade-in">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-xs transition-all hover:bg-gray-100"
                    >
                      {selectedStudents.length === sortedStudents.length ? "Deselect All" : "Select All"}
                    </Button>
                    
                    <div className="flex gap-1 animate-fade-in">
                      {attendanceOptions.map(option => (
                        <Button
                          key={option.value}
                          size="sm"
                          className={`${option.color} rounded-md transition-all`}
                          onClick={() => handleBulkStatusChange(option.value)}
                        >
                          <option.icon size={14} />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Status count pills - more subtle design */}
            <div className="grid grid-cols-4 gap-1 mb-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
              {attendanceOptions.map((option, index) => {
                const count = statusCounts[option.value] || 0;
                return (
                  <Card 
                    key={option.value} 
                    className={`border-none shadow-sm transition-all ${option.color.split(' ')[0]} bg-opacity-20`}
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <option.icon size={isMobile ? 14 : 16} className={option.color.split(' ')[1]} />
                        <span className="font-medium text-sm ml-2">{count}</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {option.label}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
      
      {/* Student List - Optimized and more modern */}
      <div className="space-y-1.5 mb-6">
        {sortedStudents.map((student, index) => {
          const statusOption = attendanceOptions.find(opt => opt.value === student.status);
          const statusColorClass = statusOption ? statusOption.color.split(' ')[0] : 'bg-white';
          
          return (
            <Card 
              key={student.id} 
              onClick={() => dateStatus === "today" && !isSelectMode ? handleStudentClick(student.id) : undefined}
              className={`border border-gray-100 shadow-sm transition-all duration-200 
                cursor-pointer hover:shadow ${isSelectMode && selectedStudents.includes(student.id) ? 'ring-1 ring-blue-400' : ''}
                ${dateStatus === "today" && !isSelectMode && activeStatus ? 'hover:border-blue-300' : ''}
                ${statusColorClass} bg-opacity-10`}
              style={{ animationDelay: `${300 + index * 20}ms` }}  
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div 
                  className={`flex items-center flex-1 ${dateStatus !== "future" && isSelectMode ? 'cursor-pointer' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dateStatus !== "future" && isSelectMode) {
                      handleToggleSelect(student.id);
                    }
                  }}
                >
                  <Avatar className={`h-9 w-9 mr-3 ${isSelectMode && selectedStudents.includes(student.id) ? 'ring-2 ring-blue-400' : ''} transition-all`}>
                    <AvatarFallback className={`text-xs ${student.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 text-sm">
                        {student.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{student.rollNumber}</span>
                      {getStatusBadge(student.status)}
                    </div>
                  </div>
                </div>
                
                {dateStatus !== "future" && (isSelectMode ? (
                  <div 
                    className="w-5 h-5 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(student.id);
                    }}
                  >
                    {selectedStudents.includes(student.id) && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                ) : (
                  dateStatus === "today" && (
                    <button
                      className={`p-1.5 rounded-full transition-all active:scale-90 ${
                        student.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 
                        student.status === 'absent' ? 'bg-rose-100 text-rose-700' :
                        student.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickToggle(student.id);
                      }}
                    >
                      {student.status === 'present' ? <CheckCircle size={16} /> : 
                       student.status === 'absent' ? <XCircle size={16} /> : 
                       student.status === 'late' ? <Clock size={16} /> : <Calendar size={16} />}
                    </button>
                  )
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Fixed bottom button - simplified */}
      {dateStatus !== "future" && (
        <div className="fixed bottom-16 left-0 right-0 p-3 bg-white border-t border-gray-100 flex justify-center shadow-md animate-fade-in z-10">
          <Button 
            className="w-full max-w-md bg-black hover:bg-gray-800 text-white shadow-md transition-all animate-scale-in"
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
