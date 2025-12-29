// app/student/advising/page.tsx
"use client";

import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';
import DashboardLayout from '../../components/dashbord/DashboardLayout';

export default function AdvisingPage() {
  const { user } = useAuth('student');
  const { fontSizeMultiplier } = useAccessibility();

  if (!user) return null;

  return (
    <DashboardLayout title="Academic Advising" requiredRole="student">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontSize: `${32 * fontSizeMultiplier}px` }}
          >
            Academic Advising
          </h1>
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
          >
            Manage your course enrollment through our advising portal. Choose an option below to add or drop courses.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Course Option */}
          <a href="/student/course-selection">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2
                    className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
                  >
                    Add Course
                  </h2>
                </div>
              </div>
              <p
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
                style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
              >
                Browse available courses and add them to your schedule. Check for time conflicts and credit requirements before enrolling.
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span
                  className="font-medium"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  Start adding courses
                </span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          {/* Drop Course Option */}
          <a href="/student/course-drop">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2
                    className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                    style={{ fontSize: `${20 * fontSizeMultiplier}px` }}
                  >
                    Drop Course
                  </h2>
                </div>
              </div>
              <p
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
                style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
              >
                Remove courses from your current enrollment. Review your schedule and credit load before dropping courses.
              </p>
              <div className="mt-4 flex items-center text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
                <span
                  className="font-medium"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  Start dropping courses
                </span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3
                className="text-lg font-medium text-blue-900 dark:text-blue-100"
                style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
              >
                Need Help?
              </h3>
              <p
                className="mt-2 text-blue-800 dark:text-blue-200"
                style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
              >
                If you need assistance with course selection or have questions about your academic plan, please contact your academic advisor or visit the student services office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}