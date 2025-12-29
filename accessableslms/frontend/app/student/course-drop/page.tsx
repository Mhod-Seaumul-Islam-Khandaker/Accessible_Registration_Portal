// app/student/course-drop/page.tsx
"use client";

import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';
import DashboardLayout from '../../components/dashbord/DashboardLayout';
import { useEffect, useState, useCallback } from 'react';
import { Supabase } from '../../lib/supabase-client';
import { Course, Section, Schedule } from '../../types/course';

interface EnrolledCourse extends Course {
  sections: (Section & { schedules: Schedule[]; enrollment_id: number })[];
}

interface EnrollmentData {
  id: number;
  section: {
    id: number;
    course_id: number;
    section_label: string;
    capacity: number;
    location?: string;
    status: 'open' | 'closed';
    course: Course;
    schedules: Schedule[];
  };
}

interface SectionWithEnrollment extends Section {
  enrollment_id: number;
}

export default function CourseDropPage() {
  const { user } = useAuth('student');
  const { fontSizeMultiplier } = useAccessibility();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [dropCart, setDropCart] = useState<SectionWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch enrollments with sections and courses
      const { data: enrollmentsData, error: enrollmentsError } = await Supabase
        .from('enrollment')
        .select(`
          id,
          section:section_id (
            id,
            course_id,
            section_label,
            capacity,
            location,
            status,
            course:course_id (
              id,
              course_code,
              title,
              description,
              credits
            ),
            schedules:schedule (
              id,
              day_of_week,
              start_time,
              end_time,
              note
            )
          )
        `)
        .eq('student_id', user.id);

      if (enrollmentsError) throw enrollmentsError;

      // Group by course
      const courseMap = new Map<number, EnrolledCourse>();

      enrollmentsData?.forEach((enrollment: any) => {
        const section = enrollment.section;
        const course = section.course;
        const enrollmentId = enrollment.id;

        if (!courseMap.has(course.id)) {
          courseMap.set(course.id, {
            ...course,
            sections: []
          });
        }

        courseMap.get(course.id)!.sections.push({
          ...section,
          schedules: section.schedules || [],
          enrollment_id: enrollmentId
        });
      });

      setEnrolledCourses(Array.from(courseMap.values()));
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setErrors(['Failed to load enrolled courses']);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const addToDropCart = (section: SectionWithEnrollment) => {
    if (dropCart.find(s => s.id === section.id)) return; // Already in cart
    setDropCart([...dropCart, section]);
    setErrors([]);
  };

  const removeFromDropCart = (sectionId: number) => {
    setDropCart(dropCart.filter(s => s.id !== sectionId));
  };

  const totalCredits = dropCart.reduce((sum, section) => {
    const course = enrolledCourses.find(c => c.id === section.course_id);
    return sum + (course?.credits || 3);
  }, 0);

  const handleProceedToConfirmation = () => {
    if (dropCart.length === 0) {
      setErrors(['Please select at least one course to drop']);
      return;
    }
    setShowConfirmation(true);
    setErrors([]);
  };

  const handleConfirmDrop = async () => {
    if (!user) return;
    setSubmitting(true);
    setErrors([]);

    try {
      // Delete enrollments
      const enrollmentIds = dropCart.map(section => section.enrollment_id);

      const { error } = await Supabase
        .from('enrollment')
        .delete()
        .in('id', enrollmentIds);

      if (error) throw error;

      // Redirect to student dashboard
      window.location.href = '/student';
    } catch (error) {
      console.error('Error dropping courses:', error);
      setErrors(['Failed to drop courses']);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSelection = () => {
    setShowConfirmation(false);
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Course Drop" requiredRole="student">
      <div className="max-w-6xl">
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
          style={{ fontSize: `${32 * fontSizeMultiplier}px` }}
        >
          Course Drop
        </h1>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
          </div>
        )}

        {!showConfirmation ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses List */}
            <div className="lg:col-span-2">
              <h2
                className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
              >
                Your Enrolled Courses
              </h2>
              {loading ? (
                <p>Loading...</p>
              ) : enrolledCourses.length === 0 ? (
                <p className="text-gray-500">No enrolled courses found</p>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map(course => (
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
                                onClick={() => addToDropCart(section)}
                                disabled={dropCart.some(s => s.id === section.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                              >
                                {dropCart.some(s => s.id === section.id) ? 'Selected for Drop' : 'Select to Drop'}
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

            {/* Drop Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
                <h2
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                  style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
                >
                  Courses to Drop
                </h2>
                <p
                  className="text-gray-600 dark:text-gray-400 mb-4"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  Total Credits: {totalCredits}
                </p>
                {dropCart.length === 0 ? (
                  <p className="text-gray-500">No courses selected for drop</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {dropCart.map(section => {
                      const course = enrolledCourses.find(c => c.id === section.course_id);
                      return (
                        <div key={section.id} className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-600 rounded">
                          <div>
                            <p className="font-medium">{course?.course_code}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{section.section_label}</p>
                          </div>
                          <button
                            onClick={() => removeFromDropCart(section.id)}
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
                  onClick={handleProceedToConfirmation}
                  disabled={dropCart.length === 0}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
                >
                  Proceed to Confirmation
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-2xl font-semibold text-gray-900 dark:text-white mb-6"
              style={{ fontSize: `${24 * fontSizeMultiplier}px` }}
            >
              Confirm Course Drop
            </h2>
            <p
              className="text-gray-600 dark:text-gray-400 mb-6"
              style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
            >
              Please review the courses you have selected to drop. This action cannot be undone.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
              >
                Courses to be Dropped ({dropCart.length})
              </h3>
              <div className="space-y-2">
                {dropCart.map(section => {
                  const course = enrolledCourses.find(c => c.id === section.course_id);
                  return (
                    <div key={section.id} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-600 rounded">
                      <div>
                        <p className="font-medium">{course?.course_code}: {course?.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Section: {section.section_label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Credits: {course?.credits}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p
                className="text-lg font-semibold text-gray-900 dark:text-white mt-4"
                style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
              >
                Total Credits to Drop: {totalCredits}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleBackToSelection}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Selection
              </button>
              <button
                onClick={handleConfirmDrop}
                disabled={submitting}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {submitting ? 'Dropping...' : 'Confirm Drop'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}