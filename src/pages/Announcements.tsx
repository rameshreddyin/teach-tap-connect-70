
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle } from 'lucide-react';

// Mock data for announcements
const announcements = [
  {
    id: 1,
    title: "Parent Teacher Meeting",
    date: "May 20, 2025",
    description: "The annual parent-teacher meeting will be held on Friday. Please prepare your student progress reports.",
    isNew: true,
    priority: "high",
    category: "Meeting"
  },
  {
    id: 2,
    title: "Science Olympiad Registration",
    date: "May 18, 2025",
    description: "Registrations for the National Science Olympiad are now open. Please encourage your students to participate.",
    isNew: true,
    priority: "medium",
    category: "Event"
  },
  {
    id: 3,
    title: "Curriculum Review Session",
    date: "May 15, 2025",
    description: "All subject teachers are requested to attend the curriculum review session in the conference room.",
    isNew: false,
    priority: "medium",
    category: "Training"
  },
  {
    id: 4,
    title: "Holiday - Foundation Day",
    date: "May 12, 2025",
    description: "The school will remain closed on Monday on account of the School's Foundation Day.",
    isNew: false,
    priority: "low",
    category: "Holiday"
  },
  {
    id: 5,
    title: "Exam Schedule Released",
    date: "May 10, 2025",
    description: "The final examination schedule has been released. Please review and report any conflicts.",
    isNew: false,
    priority: "high",
    category: "Academic"
  },
];

const getPriorityIndicator = (priority: string) => {
  if (priority === 'high') {
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  }
  return null;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Meeting': return 'bg-blue-50 text-blue-900 border-blue-200';
    case 'Event': return 'bg-purple-50 text-purple-900 border-purple-200';
    case 'Training': return 'bg-green-50 text-green-900 border-green-200';
    case 'Holiday': return 'bg-orange-50 text-orange-900 border-orange-200';
    case 'Academic': return 'bg-gray-50 text-gray-900 border-gray-200';
    default: return 'bg-gray-50 text-gray-900 border-gray-200';
  }
};

const Announcements: React.FC = () => {
  return (
    <div className="page-container bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Announcements
        </h1>
        <p className="text-gray-600">Stay updated with the latest school news</p>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                    {announcement.isNew && (
                      <Badge className="bg-gray-900 text-white border-none text-xs px-2 py-1">
                        New
                      </Badge>
                    )}
                    {getPriorityIndicator(announcement.priority)}
                  </div>
                  <Badge variant="outline" className={`${getCategoryColor(announcement.category)} text-xs font-medium`}>
                    {announcement.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar size={14} className="mr-2" />
                <span>{announcement.date}</span>
                <Clock size={14} className="ml-4 mr-2" />
                <span>Just now</span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{announcement.description}</p>
              
              <div className="pt-4 border-t border-gray-100">
                <button className="text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors">
                  Read more →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
