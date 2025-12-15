// components/HeroSection.tsx
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Calendar } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Welcome to{" "}
              <span className="text-blue-600 dark:text-blue-400">
                accessableSLMS
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your comprehensive student portal for managing courses, schedules, 
              and connecting with faculty. Streamline your academic journey 
              with our intuitive platform.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">10K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access</p>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Existing User? Log In
            </Link>
          </div>
        </div>
        
        {/* Right Content - Illustration */}
        <div className="lg:w-1/2 relative">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30 animate-pulse delay-1000"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Student Dashboard Preview
                  </h3>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Course Registration
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add/Drop courses easily
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Schedule</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        4 Classes
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        3 New
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}