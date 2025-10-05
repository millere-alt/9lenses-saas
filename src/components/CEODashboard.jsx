import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BarChart3, Upload, BookOpen, TrendingUp, Users, CheckCircle, Sparkles } from 'lucide-react';

function CEODashboard() {
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);

  const stats = [
    { label: 'Active Assessments', value: '3', change: '+2 this month', icon: PlayCircle, color: 'emerald', gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Completed Assessments', value: '12', change: '+5 this quarter', icon: CheckCircle, color: 'teal', gradient: 'from-teal-400 to-cyan-500' },
    { label: 'Total Participants', value: '47', change: '8 pending invites', icon: Users, color: 'blue', gradient: 'from-blue-400 to-indigo-500' },
    { label: 'Avg Score', value: '6.8', change: '+0.3 vs last quarter', icon: TrendingUp, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
  ];

  const quickActions = [
    {
      title: 'Launch New Assessment',
      description: 'Start a new 9Lenses assessment and invite participants',
      icon: PlayCircle,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      action: () => navigate('/assessment/launch'),
    },
    {
      title: 'View Results & Analytics',
      description: 'Review assessment results and organizational insights',
      icon: BarChart3,
      gradient: 'from-teal-500 via-cyan-500 to-blue-500',
      action: () => navigate('/dashboard'),
    },
    {
      title: 'Upload Files',
      description: 'Upload supporting documents and resources',
      icon: Upload,
      gradient: 'from-blue-500 via-indigo-500 to-violet-500',
      action: () => navigate('/upload'),
    },
    {
      title: 'Browse Resources',
      description: 'Access 9Lenses books and learning materials',
      icon: BookOpen,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      action: () => navigate('/resources'),
    },
  ];

  const recentActivity = [
    { type: 'Assessment Started', description: 'Q1 2025 Strategic Review', time: '2 hours ago' },
    { type: 'Results Available', description: 'Leadership Team Assessment', time: '1 day ago' },
    { type: 'Participant Joined', description: 'Sarah Chen completed assessment', time: '2 days ago' },
    { type: 'File Uploaded', description: 'Financial Reports - Q4 2024', time: '3 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">Welcome back! Here's your organizational overview.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Premium Account</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isHovered = hoveredStat === index;
          return (
            <div
              key={stat.label}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              className={`group relative bg-white rounded-3xl p-6 shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                isHovered ? 'scale-105 shadow-2xl -translate-y-2' : ''
              }`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-6' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                <p className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={action.action}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-left overflow-hidden hover:-translate-y-1"
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-500">{action.title}</h3>
                    <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-500">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">Recent Activity</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="group p-6 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{activity.type}</p>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{activity.description}</p>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-teal-600 whitespace-nowrap ml-4 transition-colors">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CEODashboard;
