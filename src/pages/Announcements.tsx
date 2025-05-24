
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star } from 'lucide-react';

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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'from-red-500 to-red-600';
    case 'medium': return 'from-amber-500 to-orange-500';
    case 'low': return 'from-green-500 to-green-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Meeting': return 'bg-blue-100 text-blue-700';
    case 'Event': return 'bg-purple-100 text-purple-700';
    case 'Training': return 'bg-emerald-100 text-emerald-700';
    case 'Holiday': return 'bg-orange-100 text-orange-700';
    case 'Academic': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const Announcements: React.FC = () => {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Announcements
        </h1>
        <p className="text-gray-500">Stay updated with the latest school news</p>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className="border-none bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardContent className="p-0">
              <div className={`h-2 bg-gradient-to-r ${getPriorityColor(announcement.priority)}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{announcement.title}</h3>
                      {announcement.isNew && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none text-xs px-2 py-1">
                          New
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={`${getCategoryColor(announcement.category)} border-none text-xs font-medium`}>
                      {announcement.category}
                    </Badge>
                  </div>
                  {announcement.priority === 'high' && (
                    <Star className="h-5 w-5 text-red-500 fill-current" />
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={14} className="mr-2" />
                  <span>{announcement.date}</span>
                  <Clock size={14} className="ml-4 mr-2" />
                  <span>Just now</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{announcement.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    Read more →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
