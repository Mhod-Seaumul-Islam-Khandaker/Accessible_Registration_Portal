// app/student/course-selection/page.tsx
"use client";

import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';
import DashboardLayout from '../../components/dashbord/DashboardLayout';
import { useEffect, useState } from 'react';
import { Supabase } from '../../lib/supabase-client';
import { Course, Section, Schedule } from '../../types/course';

interface CourseWithSections extends Course {
  sections: (Section & { schedules: Schedule[] })[];
}

export default function CourseSelectionPage() {
  const { user } = useAuth('student');
  const { fontSizeMultiplier } = useAccessibility();
  const [courses, setCourses] = useState<CourseWithSections[]>([]);
  const [cart, setCart] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      // Fetch courses with sections that have at least one section
      const { data: coursesData, error: coursesError } = await Supabase
        .from('course')
        .select(`
          *,
          sections:section!inner(
            *,
            schedules:schedule(*)
          )
        `)
        .eq('sections.status', 'open');

      if (coursesError) throw coursesError;

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setErrors(['Failed to load courses']);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (section: Section) => {
    if (cart.find(s => s.id === section.id)) return; // Already in cart
    if (cart.find(s => s.course_id === section.course_id)) {
      setErrors(['Cannot add duplicate course']);
      return;
    }
    // Check for time conflicts
    for (const cartSection of cart) {
      if (hasTimeConflict(section, cartSection)) {
        setErrors(['Time conflict detected']);
        return;
      }
    }
    setCart([...cart, section]);
    setErrors([]);
  };

  const removeFromCart = (sectionId: number) => {
    setCart(cart.filter(s => s.id !== sectionId));
  };

  const hasTimeConflict = (section1: Section, section2: Section): boolean => {
    if (!section1.schedules || !section2.schedules) return false;
    for (const sched1 of section1.schedules) {
      for (const sched2 of section2.schedules) {
        if (sched1.day_of_week === sched2.day_of_week) {
          const start1 = new Date(`1970-01-01T${sched1.start_time}`);
          const end1 = new Date(`1970-01-01T${sched1.end_time}`);
          const start2 = new Date(`1970-01-01T${sched2.start_time}`);
          const end2 = new Date(`1970-01-01T${sched2.end_time}`);
          if (start1 < end2 && end1 > start2) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const totalCredits = cart.reduce((sum, section) => {
    const course = courses.find(c => c.id === section.course_id);
    return sum + (course?.credits || 3);
  }, 0);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setErrors([]);

    try {
      // Insert enrollments
      const enrollments = cart.map(section => ({
        section_id: section.id,
        student_id: user.id,
      }));

      const { error } = await Supabase
        .from('enrollment')
        .insert(enrollments);

      if (error) throw error;

      // Redirect to student dashboard
      window.location.href = '/student';
    } catch (error) {
      console.error('Error enrolling:', error);
      setErrors(['Failed to enroll in courses']);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Course Selection" requiredRole="student">
      <div className="max-w-6xl">
        <h1 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
          style={{ fontSize: `${32 * fontSizeMultiplier}px` }}
        >
          Course Selection
        </h1>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2">
            <h2 
              className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
              style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
            >
              Available Courses
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                      style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
                    >
                      {course.course_code}: {course.title}
                    </h3>
                    <p 
                      className="text-gray-600 dark:text-gray-400 mb-4"
                      style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                    >
                      {course.description}
                    </p>
                    <p 
                      className="text-sm text-gray-500 dark:text-gray-500 mb-4"
                      style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
                    >
                      Credits: {course.credits}
                    </p>
                    <div className="space-y-2">
                      {course.sections.map(section => (
                        <div key={section.id} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{section.section_label}</span>
                            <button
                              onClick={() => addToCart(section)}
                              disabled={cart.some(s => s.id === section.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                              {cart.some(s => s.id === section.id) ? 'Added' : 'Add to Cart'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Location: {section.location}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Schedule:</p>
                            {section.schedules?.map(sched => (
                              <p key={sched.id} className="text-sm text-gray-600 dark:text-gray-400">
                                {sched.day_of_week} {sched.start_time.slice(0,5)} - {sched.end_time.slice(0,5)}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
              <h2 
                className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
              >
                Selection Cart
              </h2>
              <p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
              >
                Total Credits: {totalCredits}
              </p>
              {cart.length === 0 ? (
                <p className="text-gray-500">No courses selected</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {cart.map(section => {
                    const course = courses.find(c => c.id === section.course_id);
                    return (
                      <div key={section.id} className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-600 rounded">
                        <div>
                          <p className="font-medium">{course?.course_code}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{section.section_label}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(section.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || submitting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitting ? 'Enrolling...' : 'Enroll in Selected Courses'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}