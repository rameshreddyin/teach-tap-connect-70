import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, AlertCircle, Search, Filter, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data for announcements - expanded dataset
const generateAnnouncements = () => {
  const categories = ["Meeting", "Event", "Training", "Holiday", "Academic", "Sports", "Cultural"];
  const priorities = ["high", "medium", "low"];
  const titles = [
    "Parent Teacher Meeting", "Science Olympiad Registration", "Curriculum Review Session",
    "Holiday - Foundation Day", "Exam Schedule Released", "Staff Training Workshop",
    "Sports Day Preparations", "Cultural Event Planning", "Library Renovation",
    "New Course Introduction", "Safety Drill", "Annual Function", "Fee Payment Reminder",
    "Student Council Elections", "Art Exhibition", "Mathematics Competition"
  ];
  
  const announcements = [];
  for (let i = 0; i < 150; i++) {
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    
    announcements.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)] + ` - ${i + 1}`,
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      dateObj: date,
      description: `This is announcement ${i + 1}. Important information regarding school activities and updates. Please read carefully and follow the instructions provided.`,
      isNew: Math.random() < 0.3,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  
  return announcements.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
};

const announcements = generateAnnouncements();

const getPriorityIndicator = (priority: string) => {
  if (priority === 'high') {
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
  return null;
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Meeting': 'bg-blue-50 text-blue-700 border-blue-200',
    'Event': 'bg-purple-50 text-purple-700 border-purple-200',
    'Training': 'bg-green-50 text-green-700 border-green-200',
    'Holiday': 'bg-orange-50 text-orange-700 border-orange-200',
    'Academic': 'bg-gray-50 text-gray-700 border-gray-200',
    'Sports': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cultural': 'bg-pink-50 text-pink-700 border-pink-200'
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const groupAnnouncementsByDate = (announcements: any[]) => {
  const groups = {};
  announcements.forEach(announcement => {
    const dateKey = announcement.date;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(announcement);
  });
  return groups;
};

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [visibleCount, setVisibleCount] = useState(20);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [searchTerm, selectedCategory, selectedPriority]);

  const groupedAnnouncements = useMemo(() => {
    return groupAnnouncementsByDate(filteredAnnouncements.slice(0, visibleCount));
  }, [filteredAnnouncements, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 20, filteredAnnouncements.length));
  }, [filteredAnnouncements.length]);

  const toggleGroup = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  const categories = ['all', ...Array.from(new Set(announcements.map(a => a.category)))];
  const priorities = ['all', 'high', 'medium', 'low'];

  return (
    <div className="page-container bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Announcements
        </h1>
        <p className="text-gray-600">Stay updated with the latest school news</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="recent" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Recent</TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Priority</TabsTrigger>
            <TabsTrigger value="category" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Category</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">All</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 mt-4">
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <TabsContent value="recent" className="mt-6">
            <div className="space-y-4">
              {Object.entries(groupedAnnouncements).map(([date, dayAnnouncements]) => (
                <Collapsible key={date} open={expandedGroups.has(date)}>
                  <CollapsibleTrigger
                    onClick={() => toggleGroup(date)}
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{date}</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        {dayAnnouncements.length} announcements
                      </Badge>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${expandedGroups.has(date) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 space-y-3 animate-accordion-down">
                    {dayAnnouncements.map((announcement, index) => (
                      <Card 
                        key={announcement.id}
                        className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ml-4"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fade-in 0.5s ease-out forwards'
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                                {announcement.isNew && (
                                  <Badge className="bg-gray-900 text-white border-none text-xs px-2 py-1 animate-pulse">
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
                            <Clock size={14} className="mr-2" />
                            <span>Posted today</span>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-4">{announcement.description}</p>
                          
                          <div className="pt-4 border-t border-gray-100">
                            <button className="text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors hover:underline">
                              Read more →
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="priority" className="mt-6">
            <div className="space-y-4">
              {['high', 'medium', 'low'].map(priority => {
                const priorityAnnouncements = filteredAnnouncements
                  .filter(a => a.priority === priority)
                  .slice(0, 10);
                
                if (priorityAnnouncements.length === 0) return null;
                
                return (
                  <div key={priority}>
                    <h3 className="font-semibold text-lg mb-3 capitalize flex items-center gap-2">
                      {priority === 'high' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {priority} Priority
                      <Badge variant="outline">{priorityAnnouncements.length}</Badge>
                    </h3>
                    <div className="space-y-3">
                      {priorityAnnouncements.map((announcement, index) => (
                        <Card 
                          key={announcement.id}
                          className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'slide-in-right 0.5s ease-out forwards'
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{announcement.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{announcement.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className={`${getCategoryColor(announcement.category)} text-xs`}>
                                    {announcement.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{announcement.date}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {categories.filter(cat => cat !== 'all').map(category => {
                const categoryAnnouncements = filteredAnnouncements
                  .filter(a => a.category === category)
                  .slice(0, 5);
                
                if (categoryAnnouncements.length === 0) return null;
                
                return (
                  <Card key={category} className="border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{category}</h3>
                        <Badge variant="outline">{categoryAnnouncements.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {categoryAnnouncements.map(announcement => (
                          <div key={announcement.id} className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <h4 className="font-medium text-sm text-gray-900">{announcement.title}</h4>
                            <p className="text-xs text-gray-600">{announcement.date}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {filteredAnnouncements.slice(0, visibleCount).map((announcement, index) => (
                <Card 
                  key={announcement.id}
                  className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
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
          </TabsContent>
        </Tabs>

        {/* Load More Button */}
        {visibleCount < filteredAnnouncements.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              Load More ({filteredAnnouncements.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
