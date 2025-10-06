import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, PlayCircle, BarChart3, Upload, BookOpen, Info, Lightbulb, FileText } from 'lucide-react';

function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/about', icon: Info },
    { label: 'How It Works', href: '/how-it-works', icon: Lightbulb },
    { label: 'Launch Assessment', href: '/assessment/launch', icon: PlayCircle },
    { label: 'Dashboard', href: '/ceo-dashboard', icon: LayoutDashboard },
    { label: 'Results', href: '/dashboard', icon: BarChart3 },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Upload Files', href: '/upload', icon: Upload },
    { label: 'Resources', href: '/resources', icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <span className="text-2xl font-bold text-white">9L</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">9Lenses</h1>
                  <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">Strategic Business Assessment</p>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden lg:flex space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:text-blue-700'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-gradient-to-r from-blue-500 to-green-500 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 font-medium">
              <span className="font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">9Lenses</span> - Transform your business with strategic assessment and data-driven insights
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-700 bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-full border-2 border-blue-200">
              <Info size={16} className="text-blue-600" />
              <span>Comprehensive Business Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
