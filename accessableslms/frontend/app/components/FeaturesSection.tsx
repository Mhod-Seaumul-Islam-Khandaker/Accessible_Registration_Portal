// components/FeaturesSection.tsx
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  MessageSquare,
  BookOpen,
  Settings
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: "Student Dashboard",
      description: "Personalized dashboard with quick access to courses, schedule, and announcements.",
      color: "blue"
    },
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: "Class Schedule",
      description: "View and manage your class schedule with calendar integration.",
      color: "green"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Course Management",
      description: "Easily add, drop, or switch courses with real-time availability.",
      color: "purple"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Faculty Directory",
      description: "Connect with faculty members, view profiles and contact information.",
      color: "orange"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Chat System",
      description: "Real-time messaging with faculty and fellow students.",
      color: "pink"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Accessibility Features",
      description: "Customize your experience with screen reader support, themes, and more.",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'orange':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'pink':
        return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our portal provides all the tools you need for a successful academic journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${getColorClasses(feature.color)}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}