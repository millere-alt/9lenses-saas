import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Home, Sparkles, ArrowRight, CheckCircle, MessageCircle, Target, Users, BarChart3, Lightbulb, Zap } from 'lucide-react';

const AIOnboardingAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    role: null,
    experience: null,
    goals: []
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setTimeout(() => {
      addBotMessage(
        "👋 Hello! I'm your 9Vectors AI Assistant. I'm here to help you understand and navigate the 9Vectors platform.\n\nI can help you with:\n• Understanding what 9Vectors is\n• Learning about the 9 dimensions\n• Starting your first assessment\n• Exploring AI-powered features\n• Answering any questions\n\nWhat would you like to know first?",
        [
          { text: "What is 9Vectors?", action: "explain-9Vectors" },
          { text: "Start an Assessment", action: "start-assessment" },
          { text: "Explore AI Features", action: "ai-features" },
          { text: "I have a question", action: "open-chat" }
        ]
      );
    }, 500);
  }, []);

  const addBotMessage = (text, quickReplies = null, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text,
        quickReplies,
        timestamp: new Date()
      }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      type: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const handleQuickReply = (action, displayText) => {
    addUserMessage(displayText);

    setTimeout(() => {
      switch (action) {
        case "explain-9Vectors":
          handleExplain9Vectors();
          break;
        case "start-assessment":
          handleStartAssessment();
          break;
        case "ai-features":
          handleAIFeatures();
          break;
        case "learn-lenses":
          handleLearnLenses();
          break;
        case "launch-now":
          addBotMessage("Perfect! I'll take you to the assessment launch page where you can set up your first evaluation. 🚀");
          setTimeout(() => navigate('/assessment/launch'), 1500);
          break;
        case "view-ai-dashboard":
          addBotMessage("Great choice! The AI Dashboard has powerful features. Let me show you. 🤖");
          setTimeout(() => navigate('/ai-dashboard'), 1500);
          break;
        case "learn-more-page":
          addBotMessage("I'll take you to our comprehensive learning page where you can explore all 9 lenses in detail. 📚");
          setTimeout(() => navigate('/learn'), 1500);
          break;
        case "dashboard-tour":
          handleDashboardTour();
          break;
        case "open-chat":
          handleOpenChat();
          break;
        default:
          handleOpenChat();
      }
    }, 500);
  };

  const handleExplain9Vectors = () => {
    addBotMessage(
      "9Vectors is a comprehensive business assessment framework that evaluates organizations across **9 interconnected dimensions**.\n\n🎯 It's organized into 3 categories:\n\n**🌱 Assets** (Green) - Your Resources\n• Market\n• People\n• Finance\n\n**⚙️ Processes** (Orange) - Your Operations\n• Strategy\n• Operations\n• Execution\n\n**🏛️ Structures** (Blue) - Your Governance\n• Expectation\n• Governance\n• Entity\n\nThese 9 dimensions work together to give you a complete picture of your organization's health and performance.",
      [
        { text: "Learn About Each Lens", action: "learn-lenses" },
        { text: "Start My Assessment", action: "start-assessment" },
        { text: "Explore AI Features", action: "ai-features" }
      ],
      500
    );
  };

  const handleLearnLenses = () => {
    addBotMessage(
      "Excellent! Each lens examines a critical aspect of your business:\n\n**Assets Category:**\n📊 **Market** - Your market opportunity and positioning\n👥 **People** - Your team, culture, and leadership\n💰 **Finance** - Financial health and sustainability\n\n**Processes Category:**\n💡 **Strategy** - Your plan to win\n⚙️ **Operations** - Operational efficiency\n📈 **Execution** - Performance tracking and delivery\n\n**Structures Category:**\n💬 **Expectation** - Stakeholder alignment\n🛡️ **Governance** - Controls and oversight\n🏢 **Entity** - Legal structure and risk\n\nWould you like to dive deeper into any specific lens?",
      [
        { text: "See Detailed Page", action: "learn-more-page" },
        { text: "Start Assessment", action: "start-assessment" },
        { text: "Ask a Question", action: "open-chat" }
      ],
      500
    );
  };

  const handleStartAssessment = () => {
    addBotMessage(
      "Great! Let me walk you through starting an assessment. 🚀\n\n**Here's how it works:**\n\n1️⃣ **Launch Assessment** - Create a new evaluation\n2️⃣ **Invite Participants** - Add team members to provide input\n3️⃣ **Complete Survey** - Answer questions across all 9 lenses\n4️⃣ **Review Results** - Get comprehensive analysis and insights\n5️⃣ **Take Action** - Use AI recommendations to improve\n\n**Assessment Types:**\n• **Self Assessment** - Quick evaluation by yourself\n• **Team Assessment** - Collaborative multi-participant review\n• **CEO Portal** - Upload documents for AI analysis\n\nWhich would you like to try?",
      [
        { text: "Launch Now", action: "launch-now" },
        { text: "Learn More First", action: "learn-more-page" },
        { text: "Ask a Question", action: "open-chat" }
      ],
      500
    );
  };

  const handleAIFeatures = () => {
    addBotMessage(
      "Our AI suite is incredibly powerful! Here are the key features:\n\n🤖 **AI Strategy Advisor**\nGPT-powered recommendations for each lens with specific action items\n\n📊 **Predictive Analytics**\n6-12 month forecasting with confidence intervals\n\n🎯 **Action Plan Generator**\nAutomated 90-day roadmaps with initiatives and budgets\n\n💬 **AI Assistant**\nConversational AI for questions and insights\n\n📈 **Competitive Benchmarking**\nCompare against industry peers\n\n🛡️ **Risk Detection**\nAI pattern recognition for early warnings\n\n🔔 **Smart Notifications**\nIntelligent alerts for critical issues\n\n🌐 **Metastructure Interconnections**\nPatented framework showing how lenses influence each other\n\nWant to explore these features?",
      [
        { text: "View AI Dashboard", action: "view-ai-dashboard" },
        { text: "Start Assessment First", action: "start-assessment" },
        { text: "Learn About 9Vectors", action: "explain-9Vectors" }
      ],
      500
    );
  };

  const handleDashboardTour = () => {
    addBotMessage(
      "Let me show you around the dashboard! 🎯\n\n**Main Dashboard:**\n• View all your assessments\n• See overall scores across 9 lenses\n• Track progress over time\n• Access detailed reports\n\n**AI Dashboard:**\n• Strategic recommendations\n• Predictive insights\n• Risk analysis\n• Competitive benchmarking\n\n**CEO Portal:**\n• Upload documents\n• AI document analysis\n• Quick insights\n\nWhere would you like to start?",
      [
        { text: "View AI Dashboard", action: "view-ai-dashboard" },
        { text: "Start Assessment", action: "start-assessment" },
        { text: "Ask a Question", action: "open-chat" }
      ],
      500
    );
  };

  const handleOpenChat = () => {
    addBotMessage(
      "Of course! Feel free to ask me anything about 9Vectors. I can help with:\n\n• Understanding specific lenses\n• How to interpret results\n• Best practices for assessments\n• AI features and capabilities\n• Navigation tips\n\nWhat would you like to know?",
      null,
      500
    );
  };

  const handleUserInput = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    addUserMessage(userText);
    setInputValue('');

    // Simple intent detection
    setTimeout(() => {
      const lowerText = userText.toLowerCase();

      if (lowerText.includes('what') && (lowerText.includes('9Vectors') || lowerText.includes('nine lenses'))) {
        handleExplain9Vectors();
      } else if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('assessment')) {
        handleStartAssessment();
      } else if (lowerText.includes('ai') || lowerText.includes('features') || lowerText.includes('intelligent')) {
        handleAIFeatures();
      } else if (lowerText.includes('lens') && (lowerText.includes('what') || lowerText.includes('explain'))) {
        handleLearnLenses();
      } else if (lowerText.includes('dashboard') || lowerText.includes('navigation')) {
        handleDashboardTour();
      } else if (lowerText.includes('market')) {
        addBotMessage(
          "**Market Lens** 📊\n\nThe Market lens evaluates your understanding of:\n• Target market and customer segments\n• Competitive positioning\n• Market timing and trends\n• Customer needs and pain points\n• Market size and growth potential\n\nKey Question: *How well do you understand your target market and competitive landscape?*\n\nWant to learn about other lenses?",
          [
            { text: "See All Lenses", action: "learn-lenses" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "Ask Another Question", action: "open-chat" }
          ]
        );
      } else if (lowerText.includes('people') || lowerText.includes('team') || lowerText.includes('culture')) {
        addBotMessage(
          "**People Lens** 👥\n\nThe People lens assesses:\n• Leadership quality and effectiveness\n• Organizational culture and values\n• Talent acquisition and retention\n• Skills and competency gaps\n• Team structure and collaboration\n• Employee engagement\n\nKey Question: *Do we have the right people in the right roles?*\n\nWant to explore more?",
          [
            { text: "See All Lenses", action: "learn-lenses" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "Ask Another Question", action: "open-chat" }
          ]
        );
      } else if (lowerText.includes('finance') || lowerText.includes('money') || lowerText.includes('financial')) {
        addBotMessage(
          "**Finance Lens** 💰\n\nThe Finance lens examines:\n• Business model and revenue streams\n• Capital structure and funding\n• Financial planning and forecasting\n• Profitability and unit economics\n• Cash flow management\n• Financial controls\n\nKey Question: *Is our business model economically viable and scalable?*\n\nWhat else can I help with?",
          [
            { text: "See All Lenses", action: "learn-lenses" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "Ask Another Question", action: "open-chat" }
          ]
        );
      } else if (lowerText.includes('strategy')) {
        addBotMessage(
          "**Strategy Lens** 💡\n\nThe Strategy lens evaluates:\n• Strategic vision and direction\n• Product and service offerings\n• Pricing strategy\n• Go-to-market approach\n• Competitive differentiation\n• Strategic priorities\n\nKey Question: *Is our strategy clearly defined and differentiated?*\n\nAnything else you'd like to know?",
          [
            { text: "See All Lenses", action: "learn-lenses" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "Ask Another Question", action: "open-chat" }
          ]
        );
      } else if (lowerText.includes('help') || lowerText.includes('guide')) {
        addBotMessage(
          "I'm here to help! Here's what I can do for you:\n\n✅ Explain the 9Vectors framework\n✅ Guide you through starting an assessment\n✅ Show you AI-powered features\n✅ Answer questions about specific lenses\n✅ Help navigate the platform\n\nWhat would you like to explore?",
          [
            { text: "What is 9Vectors?", action: "explain-9Vectors" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "AI Features", action: "ai-features" },
            { text: "Learn About Lenses", action: "learn-lenses" }
          ]
        );
      } else {
        addBotMessage(
          "That's a great question! Let me help you find what you're looking for.\n\nYou can:\n• Ask about specific lenses (Market, People, Finance, etc.)\n• Learn how to start an assessment\n• Explore our AI features\n• Get navigation help\n\nWhat interests you most?",
          [
            { text: "Explain 9Vectors", action: "explain-9Vectors" },
            { text: "Start Assessment", action: "start-assessment" },
            { text: "AI Features", action: "ai-features" },
            { text: "Learn Lenses", action: "learn-lenses" }
          ]
        );
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </button>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-neutral-900">AI Onboarding Assistant</h1>
                  <p className="text-sm text-neutral-600">Your guide to 9Vectors</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-neutral-600">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Welcome to 9Vectors! 👋</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                I'm your AI assistant, here to make your journey simple and intuitive.
                I'll help you understand the platform, guide you through assessments, and show you how to leverage AI-powered insights.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleQuickReply('explain-9Vectors', 'What is 9Vectors?')}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-primary-200 hover:border-primary-400 text-left group"
          >
            <Target className="w-8 h-8 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-neutral-900 mb-1">About 9Vectors</h3>
            <p className="text-xs text-neutral-600">Learn the framework</p>
          </button>

          <button
            onClick={() => handleQuickReply('start-assessment', 'Start an Assessment')}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-200 hover:border-blue-400 text-left group"
          >
            <Zap className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-neutral-900 mb-1">Get Started</h3>
            <p className="text-xs text-neutral-600">Launch assessment</p>
          </button>

          <button
            onClick={() => handleQuickReply('ai-features', 'Explore AI Features')}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-secondary-200 hover:border-secondary-400 text-left group"
          >
            <Sparkles className="w-8 h-8 text-secondary-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-neutral-900 mb-1">AI Features</h3>
            <p className="text-xs text-neutral-600">Explore capabilities</p>
          </button>

          <button
            onClick={() => handleQuickReply('learn-lenses', 'Learn About Each Lens')}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-primary-200 hover:border-primary-400 text-left group"
          >
            <Lightbulb className="w-8 h-8 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-neutral-900 mb-1">9 Vectors</h3>
            <p className="text-xs text-neutral-600">Deep dive</p>
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-neutral-200 overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-neutral-50 to-white">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-green-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-neutral-700">9Vectors AI</span>
                    </div>
                  )}

                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-green-600 text-white ml-auto'
                      : 'bg-white border-2 border-neutral-200 text-neutral-800'
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">
                      {message.text}
                    </div>
                  </div>

                  {message.quickReplies && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply.action, reply.text)}
                          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2"
                        >
                          {reply.text}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleUserInput} className="border-t-2 border-neutral-200 p-4 bg-neutral-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about 9Vectors..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Try asking: "What is 9Vectors?" or "How do I start an assessment?"
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIOnboardingAssistant;
