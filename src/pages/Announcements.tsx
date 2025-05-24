
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle, Search } from 'lucide-react';

// Mock data for active noticeboard announcements
const activeNotices = [
  {
    id: 1,
    title: "Parent Teacher Meeting - Grade 10",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "Parent-Teacher meeting for Grade 10 students will be held on December 15th, 2024 from 9:00 AM to 12:00 PM in the school auditorium.",
    isUrgent: true,
    category: "Meeting",
    postedTime: "2 hours ago"
  },
  {
    id: 2,
    title: "Holiday Notice - Winter Break",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "School will remain closed from December 22nd to January 2nd for winter holidays. Classes will resume on January 3rd, 2025.",
    isUrgent: false,
    category: "Holiday",
    postedTime: "1 day ago"
  },
  {
    id: 3,
    title: "Science Exhibition Registration Open",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "Registration for the Annual Science Exhibition is now open. Students can register with their science teachers by December 20th.",
    isUrgent: false,
    category: "Event",
    postedTime: "3 days ago"
  },
  {
    id: 4,
    title: "Library Renovation Notice",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "Library will be closed for renovation from December 18th to December 21st. All books must be returned by December 17th.",
    isUrgent: true,
    category: "Facility",
    postedTime: "5 days ago"
  },
  {
    id: 5,
    title: "Fee Payment Reminder",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "Monthly fee payment for December is due by December 25th. Please make payments at the school office or online portal.",
    isUrgent: true,
    category: "Payment",
    postedTime: "1 week ago"
  }
];

const getCategoryColor = (category: string) => {
  const colors = {
    'Meeting': 'bg-blue-50 text-blue-700 border-blue-200',
    'Event': 'bg-purple-50 text-purple-700 border-purple-200',
    'Holiday': 'bg-orange-50 text-orange-700 border-orange-200',
    'Facility': 'bg-green-50 text-green-700 border-green-200',
    'Payment': 'bg-red-50 text-red-700 border-red-200'
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotices = useMemo(() => {
    return activeNotices.filter(notice => 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="page-container bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📢 School Noticeboard
        </h1>
        <p className="text-gray-600">Active notices and announcements</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search notices..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Active Notices */}
      <div className="space-y-4">
        {filteredNotices.map((notice, index) => (
          <Card 
            key={notice.id}
            className={`border shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
              notice.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{notice.title}</h3>
                    {notice.isUrgent && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Badge className="bg-red-500 text-white border-none text-xs px-2 py-1 animate-pulse">
                          Urgent
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className={`${getCategoryColor(notice.category)} text-xs font-medium`}>
                    {notice.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar size={14} className="mr-2" />
                <span>{notice.date}</span>
                <Clock size={14} className="ml-4 mr-2" />
                <span>{notice.postedTime}</span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{notice.description}</p>
              
              <div className="pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  📌 Pinned to noticeboard
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No notices found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <p>🔄 Noticeboard updates automatically • Last updated: Just now</p>
      </div>
    </div>
  );
};

export default Announcements;
