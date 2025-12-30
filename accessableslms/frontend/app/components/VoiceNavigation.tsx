// app/components/VoiceNavigation.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceNavigationProps {
  role: 'student' | 'admin' | 'teacher';
}

const VoiceNavigation: React.FC<VoiceNavigationProps> = ({ role }) => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const rec = new (window as any).webkitSpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleCommand(transcript);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const handleCommand = (command: string) => {
    const commands = getCommands(role);
    const route = commands[command];
    if (route) {
      router.push(route);
    } else {
      console.log('Command not recognized:', command);
      showToastMessage(`Command "${command}" not recognized`);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getCommands = (role: string): Record<string, string> => {
    
    if (role === 'student') {
      return {
        'home': '/student',
        'advising': '/student/advising',
        'class schedule': '/student/schedule',
        'faculties': '/student/faculties',
        'settings': '/student/settings'
      };
    } else if (role === 'admin') {
      return {
        'dashboard': '/admin',
        'courses': '/admin/courses',
        'sections': '/admin/sections',
        'users': '/admin/users',
        'settings': '/admin/settings'
      };
    } else if (role === 'teacher') {
      return {
        // Add teacher commands if needed
      };
    }
    return {};
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return (
    <>
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={!recognition}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isListening
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        <span>{isListening ? 'Listening...' : 'Voice'}</span>
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="text-white hover:text-red-200 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceNavigation;