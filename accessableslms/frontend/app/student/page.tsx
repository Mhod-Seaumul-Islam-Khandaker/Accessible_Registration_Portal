// app/student/page.tsx
"use client";

import { useAuth } from '../hooks/useAuth';
import { useAccessibility } from '../context/AccessibilityContext';
import DashboardLayout from '../components/dashbord/DashboardLayout';
import { useEffect, useState } from 'react';
import { Supabase } from '../lib/supabase-client';
import { Section, Course } from '../types/course';

const greetings = [
  "Welcome back",
  "Great to see you",
  "Hello there",
  "Good to have you here",
  "Ready to learn",
];

const motivationalQuotes = [
  "Education is the most powerful weapon which you can use to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Every accomplishment starts with the decision to try.",
  "Your education is a dress rehearsal for a life that is yours to lead.",
  "The expert in anything was once a beginner.",
  "Learning is a treasure that will follow its owner everywhere.",
  "Don't watch the clock; do what it does. Keep going.",
];

export default function StudentDashboardPage() {
  const { user } = useAuth('student');
  const { fontSizeMultiplier } = useAccessibility();
  const [greeting, setGreeting] = useState('');
  const [motivation, setMotivation] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    // Set random greeting and motivation on mount
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    setMotivation(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    // Fetch enrolled courses
    if (user) {
      console.log('User found, fetching enrolled courses:', user);
      fetchEnrolledCourses();
    } else {
      console.log('No user found');
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    try {
      console.log('Fetching enrolled courses for user:', user.id);
      
      // First, get enrollments
      const { data: enrollments, error: enrollError } = await Supabase
        .from('enrollment')
        .select('*')
        .eq('student_id', user.id);

      console.log('Enrollments data:', enrollments);
      console.log('Enrollments error:', enrollError);

      if (enrollError) throw enrollError;

      if (!enrollments || enrollments.length === 0) {
        console.log('No enrollments found');
        setEnrolledCourses([]);
        return;
      }

      // Get section IDs
      const sectionIds = enrollments.map(e => e.section_id);
      console.log('Section IDs:', sectionIds);

      // Fetch sections with courses
      const { data: sections, error: sectionError } = await Supabase
        .from('section')
        .select('*, course(*)')
        .in('id', sectionIds);

      console.log('Sections data:', sections);
      console.log('Sections error:', sectionError);

      if (sectionError) throw sectionError;

      setEnrolledCourses(sections || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Student dashboard" requiredRole="student">
      <div className="max-w-4xl">
        {/* Greeting Section */}
        <div className="mb-8">
          <h2 
            className="text-gray-900 dark:text-white font-bold mb-2"
            style={{ fontSize: `${32 * fontSizeMultiplier}px` }}
          >
            {greeting}, {user.name}!
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
          >
            Student ID: {user.student_id}
          </p>
        </div>

        {/* Motivational Quote Section */}
        <div 
          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl p-8 shadow-lg"
          role="region"
          aria-label="Motivational quote"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg 
                className="w-10 h-10 text-white opacity-80" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 
                className="text-white font-semibold mb-3"
                style={{ fontSize: `${24 * fontSizeMultiplier}px` }}
              >
                Greeting and motivation.
              </h3>
              <blockquote>
                <p 
                  className="text-white text-opacity-95 leading-relaxed italic"
                  style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
                >
                  {motivation}
                </p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mt-8">
          <h2 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontSize: `${24 * fontSizeMultiplier}px` }}
          >
            Your Enrolled Courses
          </h2>
          {enrolledCourses.length === 0 ? (
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
            >
              No courses enrolled yet. <a href="/student/course-selection" className="text-blue-600 hover:underline">Select courses</a>
            </p>
          ) : (
            <div>
              <div className="mb-4 flex space-x-4">
                <a href="/student/course-selection" className="text-blue-600 hover:underline">Select more courses</a>
                <a href="/student/course-drop" className="text-red-600 hover:underline">Drop courses</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(section => (
                  <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                      style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
                    >
                      {section.course?.course_code}: {section.course?.title}
                    </h3>
                    <p 
                      className="text-gray-600 dark:text-gray-400 mb-2"
                      style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                    >
                      Section: {section.section_label}
                    </p>
                    <p 
                      className="text-gray-600 dark:text-gray-400 mb-2"
                      style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                    >
                      Location: {section.location}
                    </p>
                    <p 
                      className="text-sm text-gray-500 dark:text-gray-500"
                      style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
                    >
                      Credits: {section.course?.credits}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats or Additional Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 
              className="text-gray-900 dark:text-white font-semibold mb-2"
              style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
            >
              Upcoming Classes
            </h3>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
            >
              View your schedule
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 
              className="text-gray-900 dark:text-white font-semibold mb-2"
              style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
            >
              Advising
            </h3>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
            >
              Connect with advisors
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 
              className="text-gray-900 dark:text-white font-semibold mb-2"
              style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
            >
              Resources
            </h3>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
            >
              Access learning materials
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}