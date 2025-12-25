export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  student_id?: string;
  employee_id?: string;
}
