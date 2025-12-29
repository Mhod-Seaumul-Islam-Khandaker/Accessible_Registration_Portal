// types/course.ts
export interface Course {
  id: number;
  course_code: string;
  title: string;
  description?: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  course_id: number;
  section_label: string;
  capacity: number;
  location?: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  course?: Course;
  schedules?: Schedule[];
}

export interface Schedule {
  id: number;
  section_id: number;
  day_of_week: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  start_time: string; // TIME format, e.g., '09:00:00'
  end_time: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  section_id: number;
  student_id: number;
}