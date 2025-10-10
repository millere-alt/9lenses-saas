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
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Header - Salesforce Style */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-[#0176D3] rounded flex items-center justify-center shadow group-hover:shadow-md transition-all">
                  <span className="text-xl font-bold text-white">9L</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-semibold text-[#032d60]">9Vectors</h1>
                  <p className="text-xs text-gray-600 font-medium">Strategic Business Assessment</p>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <nav className="hidden lg:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-[#0176D3] text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0176D3]'
                      }`}
                    >
                      <Icon size={16} />
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

      {/* Footer - Salesforce Style */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#0176D3]">9Vectors</span> - Transform your business with strategic assessment and data-driven insights
            </p>
            <div className="flex items-center space-x-2 text-sm text-[#0176D3] bg-[#e8f4fd] px-4 py-2 rounded border border-[#0176D3]">
              <Info size={16} />
              <span className="font-medium">Comprehensive Business Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
