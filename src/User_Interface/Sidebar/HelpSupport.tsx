import { X, MessageCircleQuestion, Book, Bug, Heart, ExternalLink } from 'lucide-react';

interface HelpSupportProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  sidebarWidth: number;
}

export function HelpSupport({ isOpen, onClose, isDarkMode, sidebarWidth }: HelpSupportProps) {
  const adjustedWidth = sidebarWidth < 256 ? 256 : sidebarWidth;

  const sections = [
    {
      title: 'Documentation',
      icon: Book,
      description: 'Learn how to use Pentos effectively',
      link: '#',
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'FAQs',
      icon: MessageCircleQuestion,
      description: 'Find answers to common questions',
      link: '#',
      color: isDarkMode ? 'text-green-400' : 'text-green-600'
    },
    {
      title: 'Report an Issue',
      icon: Bug,
      description: 'Help us improve by reporting bugs',
      link: '#',
      color: isDarkMode ? 'text-amber-400' : 'text-amber-600'
    },
    {
      title: 'Support Pentos',
      icon: Heart,
      description: 'Contribute to our project',
      link: '#',
      color: isDarkMode ? 'text-rose-400' : 'text-rose-600'
    }
  ];

  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className={`shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} style={{ width: adjustedWidth }}>
        <div className={`h-0.5 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
        
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Help & Support
            </h2>
            <button
              onClick={onClose}
              className={`rounded-full p-2 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="space-y-4">
            {sections.map(({ title, icon: Icon, description, link, color }) => (
              <a
                key={title}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start gap-4 rounded-lg p-4 transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-6 w-6 shrink-0 transition-transform duration-300 ${color} group-hover:scale-110`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {title}
                    </h3>
                    <ExternalLink className={`h-4 w-4 opacity-50 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100 ${color}`} />
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className={`mt-6 text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}