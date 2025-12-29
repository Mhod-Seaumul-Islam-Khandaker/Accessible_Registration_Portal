// app/student/schedule/page.tsx
"use client";

import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';
import DashboardLayout from '../../components/dashbord/DashboardLayout';
import ClassSchedule from '../../components/ClassSchedule';
import { useEffect, useState, useCallback } from 'react';
import { Supabase } from '../../lib/supabase-client';
import { Section } from '../../types/course';

export default function SchedulePage() {
  const { user } = useAuth('student');
  const { fontSizeMultiplier } = useAccessibility();
  const [enrolledCourses, setEnrolledCourses] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
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

      // Fetch sections with courses and schedules
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [user, fetchEnrolledCourses]);

  if (!user) return null;

  return (
    <DashboardLayout title="Enrolled Courses" requiredRole="student">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontSize: `${32 * fontSizeMultiplier}px` }}
          >
            Enrolled Courses
          </h1>
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
          >
            View your enrolled courses in a tabular format.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading schedule...</span>
          </div>
        )}

        {/* Schedule Content */}
        {!loading && (
          <ClassSchedule enrolledCourses={enrolledCourses} />
        )}

        {/* Navigation Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/student"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/student/course-selection"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Courses
          </a>
          <a
            href="/student/course-drop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Drop Courses
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}