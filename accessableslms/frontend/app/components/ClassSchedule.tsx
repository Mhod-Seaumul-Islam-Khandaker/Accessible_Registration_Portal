// app/components/ClassSchedule.tsx
"use client";

import { useAccessibility } from '../context/AccessibilityContext';
import { Section } from '../types/course';

interface ClassScheduleProps {
  enrolledCourses: Section[];
}

export default function ClassSchedule({ enrolledCourses }: ClassScheduleProps) {
  const { fontSizeMultiplier } = useAccessibility();

  if (enrolledCourses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
          style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
        >
          Your Enrolled Courses
        </h3>
        <p
          className="text-gray-600 dark:text-gray-400"
          style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
        >
          No courses enrolled yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3
        className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
        style={{ fontSize: `${18 * fontSizeMultiplier}px` }}
      >
        Your Enrolled Courses
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
              >
                Course Code
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
              >
                Course Title
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
              >
                Section
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
              >
                Location
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                style={{ fontSize: `${12 * fontSizeMultiplier}px` }}
              >
                Credits
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {enrolledCourses.map(section => (
              <tr key={section.id}>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {section.course?.course_code}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {section.course?.title}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {section.section_label}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {section.location || 'TBD'}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {section.course?.credits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}