import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, Network, Target, TrendingUp, Zap,
  Shield, Server, Lightbulb, ArrowRight, CheckCircle, Star
} from 'lucide-react';

const About9VectorsSimple = () => {
  const navigate = useNavigate();

  const lenses = [
    {
      category: 'ASSETS',
      subtitle: 'What You Have',
      color: 'blue',
      items: [
        { icon: DollarSign, name: 'Financial Capital', description: 'Money, funding, cash flow' },
        { icon: Users, name: 'Human Capital', description: 'People, skills, culture' },
        { icon: Network, name: 'Social Capital', description: 'Relationships, partnerships' }
      ]
    },
    {
      category: 'PROCESSES',
      subtitle: 'What You Do',
      color: 'green',
      items: [
        { icon: Target, name: 'Business Model', description: 'How you create value' },
        { icon: TrendingUp, name: 'Strategy', description: 'Your direction & goals' },
        { icon: Zap, name: 'Execution', description: 'Getting things done' }
      ]
    },
    {
      category: 'STRUCTURES',
      subtitle: 'How You\'re Organized',
      color: 'blue',
      items: [
        { icon: Shield, name: 'Governance', description: 'Decision-making & oversight' },
        { icon: Server, name: 'Infrastructure', description: 'Systems & technology' },
        { icon: Lightbulb, name: 'Intellectual Property', description: 'Knowledge & patents' }
      ]
    }
  ];

  const benefits = [
    'See your complete business picture in one place',
    'Get input from your entire team, not just leadership',
    'AI shows you what to fix first',
    'Track improvements over time',
    'Compare your organization to industry standards',
    'Make decisions based on data, not guesswork'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            What is 9Vectors?
          </h1>
          <p className="text-2xl text-gray-600 mb-6">
            A Simple Way to Assess Your Entire Business
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Think of 9Vectors as a <span className="font-semibold text-blue-600">health check for your organization</span>.
              Just like a doctor checks multiple vital signs, 9Vectors evaluates <span className="font-semibold text-green-600">9 critical areas</span> of
              your business to show you what's working and what needs attention.
            </p>
          </div>
        </div>

        {/* The 9 Vectors Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            The 9 Dimensions
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Every business needs these to succeed
          </p>

          <div className="space-y-12">
            {lenses.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      category.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {category.category}
                    </h3>
                    <p className="text-gray-500 text-lg">{category.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    category.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      category.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {idx + 1}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {category.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={itemIdx}
                        className={`p-6 rounded-xl border-2 ${
                          category.color === 'blue'
                            ? 'border-blue-200 hover:border-blue-400 bg-blue-50'
                            : 'border-green-200 hover:border-green-400 bg-green-50'
                        } transition-all hover:shadow-md`}
                      >
                        <Icon className={`w-8 h-8 mb-3 ${
                          category.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                        <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works (4 Simple Steps)
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Survey', desc: 'Your team answers questions about each dimension' },
              { num: '2', title: 'Analyze', desc: 'AI identifies patterns and gaps across all areas' },
              { num: '3', title: 'Prioritize', desc: 'See which areas need attention most' },
              { num: '4', title: 'Act', desc: 'Get a clear 90-day action plan' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-blue-100">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Why This Matters
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
            Most businesses only look at one or two areas (usually just finances).
            That's like only checking your weight when you go to the doctor.
            9Vectors gives you the complete picture.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md border-2 border-gray-100">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real Example */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16 border-2 border-blue-200">
          <div className="flex items-start gap-4 mb-4">
            <Star className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real Example
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                A tech company thought their main problem was sales (Business Model).
                After a 9Vectors assessment, they discovered:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="text-gray-700">
                  <span className="font-semibold text-blue-600">• Human Capital:</span> High employee turnover was the real issue
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold text-green-600">• Execution:</span> Unclear processes slowed everything down
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold text-blue-600">• Infrastructure:</span> Outdated tools frustrated the team
                </li>
              </ul>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                <span className="font-semibold">The result?</span> By fixing culture and processes first,
                their sales improved naturally within 6 months.
              </p>
            </div>
          </div>
        </div>

        {/* Who Uses It */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Who Uses 9Vectors?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'CEOs & Founders', desc: 'Get clarity on where to focus next' },
              { title: 'Investors & Board Members', desc: 'Monitor portfolio companies comprehensively' },
              { title: 'Consultants & Advisors', desc: 'Deliver structured client assessments' }
            ].map((user, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-gray-100 hover:border-blue-300 transition-colors">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{user.title}</h3>
                <p className="text-gray-600">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to See the Complete Picture?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Try a demo assessment and see what 9Vectors reveals about your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/full-demo')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Try Interactive Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/assessment/create')}
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-colors shadow-lg"
            >
              Start Your Assessment
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About9VectorsSimple;
