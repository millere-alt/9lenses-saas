import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, PlayCircle, BarChart3, Upload, BookOpen, Info, Lightbulb, LogIn, LogOut, User, CreditCard, ChevronDown } from 'lucide-react';
import { useAuth0Extended } from '../contexts/Auth0Context';

function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, organization, login, logout, loading } = useAuth0Extended();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/about', icon: Info },
    { label: 'How It Works', href: '/how-it-works', icon: Lightbulb },
    { label: 'Launch Assessment', href: '/assessment/launch', icon: PlayCircle },
    { label: 'Dashboard', href: '/ceo-dashboard', icon: LayoutDashboard },
    { label: 'Results', href: '/dashboard', icon: BarChart3 },
    { label: 'Upload Files', href: '/upload', icon: Upload },
    { label: 'Resources', href: '/resources', icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">9Vectors</h1>
                  <p className="text-xs text-neutral-700 font-semibold tracking-wide uppercase">Strategic Business Assessment</p>
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
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-700 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Authentication Section */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-neutral-200">
                {loading ? (
                  <div className="px-4 py-2 text-sm text-neutral-500">Loading...</div>
                ) : user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200 shadow-sm hover:shadow-md"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="text-left hidden md:block">
                        <div className="text-sm font-semibold text-neutral-900">
                          {user.profile?.firstName || user.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-orange-600 font-medium">
                          {organization?.subscription?.plan || 'Free'} Plan
                        </div>
                      </div>
                      <ChevronDown size={16} className="text-neutral-600" />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <div className="text-sm font-semibold text-neutral-900">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </div>
                          <div className="text-xs text-neutral-600">{user.email}</div>
                        </div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/billing');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-orange-50 flex items-center space-x-2 transition-colors"
                        >
                          <CreditCard size={16} className="text-orange-600" />
                          <span>Billing & Subscription</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/pricing');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-orange-50 flex items-center space-x-2 transition-colors"
                        >
                          <BarChart3 size={16} className="text-orange-600" />
                          <span>Upgrade Plan</span>
                        </button>

                        <div className="border-t border-neutral-100 mt-2 pt-2">
                          <button
                            onClick={async () => {
                              setShowUserMenu(false);
                              await logout();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-orange-600 transition-colors"
                    >
                      Pricing
                    </button>
                    <button
                      onClick={login}
                      className="group flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <LogIn size={18} className="group-hover:scale-110 transition-transform" />
                      <span>Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-600 font-medium">
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">9Vectors</span> - Transform your business with strategic assessment and data-driven insights
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-700 bg-emerald-50 px-4 py-2 rounded-full">
              <Info size={16} className="text-emerald-600" />
              <span>Comprehensive Business Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
