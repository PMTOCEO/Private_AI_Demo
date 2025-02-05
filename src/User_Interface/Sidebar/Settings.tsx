import { X, Clock, Bell, Moon, Sun, Palette, User, Mail, Key, LogOut, Camera } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Settings({ isOpen, onClose, isDarkMode, onDarkModeToggle }: SettingsProps) {
  const { user, logout } = useAuth0();
  
  const defaultProfilePicture = isDarkMode
    ? "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/User%20Icons/User%20Icon%20(Dark).png"
    : "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/User%20Icons/User%20Icon%20(Light).png";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-2xl rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl max-h-[90vh] overflow-y-auto`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
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

        {/* Profile Picture Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={user?.picture || defaultProfilePicture}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
            />
            <button
              onClick={() => {
                window.open('https://manage.auth0.com/dashboard/us/pentos/user-profile', '_blank');
              }}
              className={`absolute bottom-0 right-0 rounded-full p-2 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Camera className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
          <h3 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.name}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.email}
          </p>
        </div>

        <div className="space-y-12">
          {/* Account Section */}
          <section>
            <h3 className={`mb-6 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Account
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Username
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open('https://manage.auth0.com/dashboard/us/pentos/user-profile', '_blank');
                  }}
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Email Address
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open('https://manage.auth0.com/dashboard/us/pentos/user-profile', '_blank');
                  }}
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Password
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Change your password
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open('https://manage.auth0.com/dashboard/us/pentos/password-reset', '_blank');
                  }}
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogOut className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                      Sign Out
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Sign out of your account
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className={`text-sm ${
                    isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h3 className={`mb-6 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Appearance
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-gray-500" />}
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Adjust the appearance
                    </span>
                  </div>
                </div>
                <button
                  onClick={onDarkModeToggle}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    isDarkMode ? 'bg-gray-200' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full transition-transform ${
                    isDarkMode ? 'bg-gray-900 translate-x-5' : 'bg-gray-700'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <Palette className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Custom Theme
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Customize colors and appearance
                    </span>
                  </div>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Coming Soon
                </span>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <h3 className={`mb-6 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Privacy
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <Clock className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Auto-delete messages
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      A paid plan is required to securely save chat history in-app
                    </span>
                  </div>
                </div>
                <button
                  className={`relative h-6 w-11 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  disabled
                >
                  <span className="absolute left-[1.25rem] top-0.5 h-5 w-5 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <h3 className={`mb-6 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Notifications
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Push Notifications
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Get notified about important updates
                    </span>
                  </div>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Coming Soon
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}