import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, TrendingUp, Users, Target, Clock, Settings, Sparkles, XCircle } from 'lucide-react';

function SmartNotifications({ lensScores, assessmentData }) {
  const [notifications, setNotifications] = useState(generateNotifications());
  const [filter, setFilter] = useState('all');

  function generateNotifications() {
    const now = new Date();
    const notifs = [];

    // Critical alerts
    lensScores?.forEach(lens => {
      if (lens.score < 5.5) {
        notifs.push({
          id: `critical-${lens.name}`,
          type: 'critical',
          category: 'Performance',
          title: `Critical Alert: ${lens.name} Below Threshold`,
          message: `${lens.name} has dropped to ${lens.score}, requiring immediate executive attention.`,
          timestamp: new Date(now.getTime() - 30 * 60000),
          read: false,
          actions: [
            { label: 'View Details', action: 'view' },
            { label: 'Get Recommendations', action: 'recommend' }
          ],
          priority: 1
        });
      }

      if (lens.change < -5) {
        notifs.push({
          id: `decline-${lens.name}`,
          type: 'warning',
          category: 'Trend',
          title: `Rapid Decline in ${lens.name}`,
          message: `${lens.name} has declined ${Math.abs(lens.change)}% in recent period. Intervention recommended.`,
          timestamp: new Date(now.getTime() - 2 * 60 * 60000),
          read: false,
          actions: [
            { label: 'View Trends', action: 'trends' },
            { label: 'Create Action Plan', action: 'plan' }
          ],
          priority: 2
        });
      }
    });

    // Opportunity alerts
    const topLens = lensScores?.reduce((max, lens) => lens.score > max.score ? lens : max, lensScores[0]);
    if (topLens && topLens.score >= 7.5) {
      notifs.push({
        id: 'opportunity-strength',
        type: 'success',
        category: 'Opportunity',
        title: `${topLens.name} Excellence Achieved`,
        message: `${topLens.name} scored ${topLens.score}, placing you in top quartile. Consider leveraging this strength across organization.`,
        timestamp: new Date(now.getTime() - 4 * 60 * 60000),
        read: false,
        actions: [
          { label: 'See Benchmark', action: 'benchmark' },
          { label: 'Share Success', action: 'share' }
        ],
        priority: 3
      });
    }

    // Participation alerts
    if (assessmentData?.completionRate && parseInt(assessmentData.completionRate) < 80) {
      notifs.push({
        id: 'participation-low',
        type: 'warning',
        category: 'Engagement',
        title: 'Low Assessment Participation',
        message: `Current completion rate: ${assessmentData.completionRate}. Send reminders to increase response rate.`,
        timestamp: new Date(now.getTime() - 6 * 60 * 60000),
        read: false,
        actions: [
          { label: 'Send Reminders', action: 'remind' },
          { label: 'View Participants', action: 'participants' }
        ],
        priority: 2
      });
    }

    // AI-generated insights
    notifs.push({
      id: 'ai-insight-1',
      type: 'info',
      category: 'AI Insight',
      title: 'Pattern Detected: Cross-Functional Improvement',
      message: 'AI analysis shows improvements in Strategy are correlated with gains in Operations. Continue aligned initiatives.',
      timestamp: new Date(now.getTime() - 12 * 60 * 60000),
      read: true,
      actions: [
        { label: 'View Analysis', action: 'analysis' }
      ],
      priority: 4
    });

    notifs.push({
      id: 'ai-insight-2',
      type: 'success',
      category: 'Prediction',
      title: 'Positive Trend Forecast',
      message: 'Based on current trajectory, you\'re on track to reach 7.0+ overall score by Q2 2025.',
      timestamp: new Date(now.getTime() - 24 * 60 * 60000),
      read: true,
      actions: [
        { label: 'View Forecast', action: 'forecast' }
      ],
      priority: 4
    });

    // Milestone notifications
    notifs.push({
      id: 'milestone-1',
      type: 'success',
      category: 'Milestone',
      title: 'Assessment Milestone Reached',
      message: `Congratulations! ${assessmentData?.participants || 12} participants have completed the assessment.`,
      timestamp: new Date(now.getTime() - 36 * 60 * 60000),
      read: true,
      actions: [
        { label: 'View Results', action: 'results' }
      ],
      priority: 5
    });

    // Recommendation notifications
    notifs.push({
      id: 'recommendation-1',
      type: 'info',
      category: 'Recommendation',
      title: 'New AI Recommendations Available',
      message: 'Based on your latest scores, we\'ve generated updated strategic recommendations for Financials.',
      timestamp: new Date(now.getTime() - 48 * 60 * 60000),
      read: false,
      actions: [
        { label: 'View Recommendations', action: 'recommend' }
      ],
      priority: 3
    });

    return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  const filterNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return { bg: 'from-red-500 to-red-600', icon: 'bg-red-100 text-red-600', border: 'border-red-200' };
      case 'warning': return { bg: 'from-green-500 to-green-600', icon: 'bg-blue-100 text-blue-600', border: 'border-blue-200' };
      case 'success': return { bg: 'from-primary-500 to-primary-600', icon: 'bg-primary-100 text-primary-600', border: 'border-primary-200' };
      default: return { bg: 'from-secondary-500 to-secondary-600', icon: 'bg-secondary-100 text-secondary-600', border: 'border-secondary-200' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Performance': return TrendingUp;
      case 'Engagement': return Users;
      case 'Opportunity': return Target;
      default: return Sparkles;
    }
  };

  const filteredNotifs = filterNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative">
              <Bell className="w-8 h-8 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                Smart Notifications
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h2>
              <p className="text-white/90 text-lg">AI-powered alerts and intelligent insights</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-700 text-sm">Total</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-700 text-sm">Unread</h4>
          </div>
          <p className="text-3xl font-bold text-blue-700">{unreadCount}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-700 text-sm">Critical</h4>
          </div>
          <p className="text-3xl font-bold text-red-700">{notifications.filter(n => n.type === 'critical').length}</p>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 shadow-lg border-2 border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-primary-700 text-sm">Positive</h4>
          </div>
          <p className="text-3xl font-bold text-primary-700">{notifications.filter(n => n.type === 'success').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'critical', 'warning', 'success', 'info'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize ${
                  filter === f
                    ? 'bg-gradient-to-r from-secondary-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border-2 border-gray-100">
            <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} notifications at this time.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const colors = getTypeColor(notif.type);
            const TypeIcon = getTypeIcon(notif.type);
            const CategoryIcon = getCategoryIcon(notif.category);
            const timeAgo = Math.floor((new Date() - notif.timestamp) / (1000 * 60));

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${colors.border} hover:shadow-xl transition-all ${
                  !notif.read ? 'border-l-8' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{notif.title}</h3>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-600">{notif.category}</span>
                          <span className="text-gray-400">•</span>
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">{notif.message}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {notif.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => markAsRead(notif.id)}
                          className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-indigo-600 hover:from-secondary-600 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          {action.label}
                        </button>
                      ))}
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SmartNotifications;
