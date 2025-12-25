// src/types/form.ts

export interface FormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  student_id: string;
  employee_id: string;
}

export interface Message {
  type: 'error' | 'success' | '';
  text: string;
}
export interface LoginFormData {
  email: string;
  password: string;
}
export interface UserAccount {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  student_id: string | null;
  employee_id: string | null;
}
//More 

