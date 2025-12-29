// app/components/dashbord/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Home, Users, Calendar, GraduationCap, Settings } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  { label: 'Home', href: '/student', icon: <Home size={20} /> },
  { label: 'Advising', href: '/student/advising', icon: <Users size={20} /> },
  { label: 'Class Schedule', href: '/student/schedule', icon: <Calendar size={20} /> },
  { label: 'Faculties', href: '/student/faculties', icon: <GraduationCap size={20} /> },
];

export default function Sidebar({ role }: { role: 'student' | 'teacher' | 'admin' }) {
  const pathname = usePathname();
  const { fontSizeMultiplier } = useAccessibility();

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return studentNavItems;
      case 'teacher':
        return []; // To be implemented later
      case 'admin':
        return []; // To be implemented later
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside 
      className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white dark:bg-blue-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                  style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-medium">
                    {index + 1}.{item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings Link */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ fontSize: `${16 * fontSizeMultiplier}px` }}
          aria-label="Settings"
        >
          <Settings size={20} aria-hidden="true" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}