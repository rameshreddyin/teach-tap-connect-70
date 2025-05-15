
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';

// Mock data for announcements
const announcements = [
  {
    id: 1,
    title: "Parent Teacher Meeting",
    date: "May 20, 2025",
    description: "The annual parent-teacher meeting will be held on Friday. Please prepare your student progress reports.",
    isNew: true,
  },
  {
    id: 2,
    title: "Science Olympiad Registration",
    date: "May 18, 2025",
    description: "Registrations for the National Science Olympiad are now open. Please encourage your students to participate.",
    isNew: true,
  },
  {
    id: 3,
    title: "Curriculum Review Session",
    date: "May 15, 2025",
    description: "All subject teachers are requested to attend the curriculum review session in the conference room.",
    isNew: false,
  },
  {
    id: 4,
    title: "Holiday - Foundation Day",
    date: "May 12, 2025",
    description: "The school will remain closed on Monday on account of the School's Foundation Day.",
    isNew: false,
  },
  {
    id: 5,
    title: "Exam Schedule Released",
    date: "May 10, 2025",
    description: "The final examination schedule has been released. Please review and report any conflicts.",
    isNew: false,
  },
];

const Announcements: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="font-bold mb-6">Announcements</h1>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className="border-none bg-teacherApp-card"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{announcement.title}</h3>
                {announcement.isNew && (
                  <Badge variant="default" className="bg-teacherApp-accent text-white">New</Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-teacherApp-textLight mb-2">
                <Calendar size={12} className="mr-1" />
                <span>{announcement.date}</span>
              </div>
              
              <p className="text-sm">{announcement.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
