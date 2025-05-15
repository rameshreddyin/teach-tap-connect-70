
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Bell, Calendar, User, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Dashboard: React.FC = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-bold">Dashboard</h1>
          <p className="text-teacherApp-textLight text-sm">{formattedDate}</p>
        </div>
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarFallback className="bg-teacherApp-accent text-white">MS</AvatarFallback>
        </Avatar>
      </div>
      
      <section className="mb-6">
        <Card className="bg-teacherApp-card border-none">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-4 p-2 rounded-full bg-gray-200">
                <User size={28} className="text-teacherApp-accent" />
              </div>
              <div>
                <h2 className="font-semibold">Welcome, Ms. Smith</h2>
                <p className="text-sm text-teacherApp-textLight">Mathematics Department</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-6">
        <h2 className="font-semibold mb-3">Today's Schedule</h2>
        <Card className="bg-teacherApp-card border-none mb-3">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-3 flex flex-col items-center justify-center">
                <span className="text-xs text-teacherApp-textLight">Now</span>
                <div className="bg-teacherApp-accent h-1.5 w-1.5 rounded-full mt-1"></div>
                <div className="bg-gray-300 h-6 w-px"></div>
              </div>
              <div>
                <p className="font-medium">Mathematics - Class 9A</p>
                <div className="flex items-center text-xs text-teacherApp-textLight mt-1">
                  <Clock size={12} className="mr-1" />
                  <span>10:00 AM - 10:45 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-teacherApp-card border-none">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-3 flex flex-col items-center">
                <span className="text-xs text-teacherApp-textLight">Next</span>
                <div className="bg-gray-300 h-1.5 w-1.5 rounded-full mt-1"></div>
              </div>
              <div>
                <p className="font-medium">Mathematics - Class 10B</p>
                <div className="flex items-center text-xs text-teacherApp-textLight mt-1">
                  <Clock size={12} className="mr-1" />
                  <span>11:00 AM - 11:45 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/attendance">
          <Card className="bg-teacherApp-card border-none h-28 flex flex-col justify-center items-center">
            <List size={28} className="text-teacherApp-accent mb-2" />
            <p className="font-medium">Attendance</p>
          </Card>
        </Link>
        
        <Link to="/announcements">
          <Card className="bg-teacherApp-card border-none h-28 flex flex-col justify-center items-center">
            <Bell size={28} className="text-teacherApp-accent mb-2" />
            <p className="font-medium">Announcements</p>
          </Card>
        </Link>
        
        <Link to="/timetable" className="col-span-2">
          <Card className="bg-teacherApp-card border-none h-28 flex flex-col justify-center items-center">
            <Calendar size={28} className="text-teacherApp-accent mb-2" />
            <p className="font-medium">Full Timetable</p>
          </Card>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
