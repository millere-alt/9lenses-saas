import React from 'react';
import { BookOpen, ExternalLink, Award, TrendingUp, Target, Zap } from 'lucide-react';

function BooksPage() {
  const resources = [
    {
      title: '9Lenses Framework Guide',
      description: 'Comprehensive guide to the 9Lenses business assessment framework',
      icon: Target,
      color: 'blue',
      type: 'eBook',
    },
    {
      title: 'Snapshot9 Methodology',
      description: 'Business model analysis using Touch, Volume, and Margin principles',
      icon: Zap,
      color: 'blue',
      type: 'eBook',
    },
    {
      title: 'Strategic Assessment Best Practices',
      description: 'Learn how to conduct effective organizational assessments',
      icon: TrendingUp,
      color: 'blue',
      type: 'Guide',
    },
    {
      title: 'Case Studies & Success Stories',
      description: 'Real-world examples of successful 9Lenses implementations',
      icon: Award,
      color: 'blue',
      type: 'Case Studies',
    },
  ];

  const getColorClasses = (color) => {
    return 'bg-blue-100 text-blue-600 border-blue-200';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600 mt-1">Access books, guides, and learning materials</p>
      </div>

      {/* Featured Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(resource.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                    <BookOpen className="w-4 h-4" />
                    View Resource
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="#"
            className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Documentation</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Training Videos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Webinars</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
