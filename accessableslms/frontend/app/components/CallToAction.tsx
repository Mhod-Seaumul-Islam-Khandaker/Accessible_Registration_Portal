// components/CallToAction.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CallToAction() {
  const benefits = [
    "Easy course registration and management",
    "Real-time class schedule updates",
    "Direct communication with faculty",
    "Accessibility features for all users",
    "Secure and private data handling",
    "Mobile-friendly interface"
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-red from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Academic Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who are already managing their academic journey efficiently
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Start Free Today
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
            
            <p className="mt-6 text-blue-200 text-sm">
              No credit card required • Free for individual students
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}