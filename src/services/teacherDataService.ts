
interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  isPresent?: boolean;
  lastAttendance?: string;
}

interface ClassSchedule {
  id: string;
  time: string;
  subject: string;
  class: string;
  room: string;
  day: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  author: string;
}

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  classes: string[];
}

// Mock data service - in production this would connect to your school's API
export class TeacherDataService {
  private static instance: TeacherDataService;
  
  public static getInstance(): TeacherDataService {
    if (!TeacherDataService.instance) {
      TeacherDataService.instance = new TeacherDataService();
    }
    return TeacherDataService.instance;
  }

  // Get teacher profile
  async getTeacherProfile(): Promise<TeacherProfile> {
    // Simulate API call
    await this.delay(500);
    return {
      id: 'teacher_001',
      name: 'Ms. Smith',
      email: 'sarah.smith@school.edu',
      department: 'Mathematics',
      subjects: ['Mathematics', 'Statistics', 'Algebra'],
      classes: ['9A', '10B', '8C', '11A']
    };
  }

  // Get students for a class
  async getStudentsForClass(className: string): Promise<Student[]> {
    await this.delay(300);
    
    // Generate realistic student data
    const students: Student[] = [];
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Lisa', 'Mike', 'Nina', 'Oscar', 'Penny', 'Quinn', 'Rachel', 'Steve', 'Tina'];
    const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fisher', 'Garcia', 'Harris', 'Johnson', 'King', 'Lee', 'Miller', 'Nelson', 'O\'Brien', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Taylor', 'Wilson'];
    
    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      students.push({
        id: `student_${className}_${i + 1}`,
        name: `${firstName} ${lastName}`,
        rollNumber: `${className}${(i + 1).toString().padStart(3, '0')}`,
        class: className,
        isPresent: Math.random() > 0.1, // 90% attendance rate
        lastAttendance: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return students.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Save attendance
  async saveAttendance(classId: string, students: Student[]): Promise<void> {
    await this.delay(800);
    
    // In production, this would save to your school's database
    const attendanceData = {
      classId,
      date: new Date().toISOString(),
      students: students.map(s => ({
        id: s.id,
        isPresent: s.isPresent
      }))
    };
    
    // Save to localStorage for demo purposes
    const existingData = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    existingData.push(attendanceData);
    localStorage.setItem('attendance_records', JSON.stringify(existingData));
    
    console.log('Attendance saved:', attendanceData);
  }

  // Get class schedule
  async getClassSchedule(): Promise<ClassSchedule[]> {
    await this.delay(400);
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = [
      '8:30 AM - 9:15 AM',
      '9:30 AM - 10:15 AM',
      '10:30 AM - 11:15 AM',
      '11:30 AM - 12:15 PM',
      '1:30 PM - 2:15 PM',
      '2:30 PM - 3:15 PM'
    ];
    const classes = ['9A', '10B', '8C', '11A'];
    const rooms = ['Room 101', 'Room 203', 'Room 105', 'Room 301'];
    
    const schedule: ClassSchedule[] = [];
    
    days.forEach(day => {
      const daySchedule = times.slice(0, Math.floor(Math.random() * 3) + 2);
      daySchedule.forEach((time, index) => {
        schedule.push({
          id: `${day}_${index}`,
          time,
          subject: 'Mathematics',
          class: classes[index % classes.length],
          room: rooms[index % rooms.length],
          day
        });
      });
    });
    
    return schedule;
  }

  // Get announcements
  async getAnnouncements(): Promise<Announcement[]> {
    await this.delay(300);
    
    return [
      {
        id: 'ann_1',
        title: 'Parent-Teacher Conference',
        content: 'Parent-teacher conferences are scheduled for next week. Please check your individual schedules for specific timings.',
        priority: 'high',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Principal Office'
      },
      {
        id: 'ann_2',
        title: 'Math Olympiad Registration',
        content: 'Registration for the annual Math Olympiad is now open. Interested students should contact their math teachers.',
        priority: 'medium',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Math Department'
      },
      {
        id: 'ann_3',
        title: 'Holiday Schedule',
        content: 'Please note the updated holiday schedule for this semester. Classes will resume on Monday after the winter break.',
        priority: 'low',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Administration'
      }
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const teacherDataService = TeacherDataService.getInstance();
