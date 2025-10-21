import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Target } from 'lucide-react';

function AIAssistant({ assessmentData, lensScores }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your 9Vectors AI Assistant. I can help you understand your assessment results, provide strategic recommendations, answer questions about specific lenses, and guide you through improvement initiatives. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    { text: "What are my biggest strengths?", icon: Sparkles },
    { text: "Where should I focus improvement efforts?", icon: Target },
    { text: "How do I compare to industry benchmarks?", icon: TrendingUp },
    { text: "Give me actionable next steps", icon: Lightbulb }
  ];

  const generateAIResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    // Intent detection and response generation
    if (messageLower.includes('strength') || messageLower.includes('best') || messageLower.includes('highest')) {
      const topLenses = lensScores?.filter(l => l.score >= 7.0).sort((a, b) => b.score - a.score) || [];
      return `Based on your assessment, your top strengths are:

${topLenses.slice(0, 3).map((lens, idx) => `${idx + 1}. **${lens.name}** (${lens.score}/9.0) - Performing ${lens.change > 0 ? 'above' : 'at'} expectations with a ${lens.change > 0 ? '+' : ''}${lens.change}% trend.`).join('\n')}

These high-performing areas can serve as foundations for broader organizational excellence. Consider leveraging these strengths to support improvement in other lenses.

Would you like specific recommendations for maintaining or amplifying these strengths?`;
    }

    if (messageLower.includes('weakness') || messageLower.includes('improve') || messageLower.includes('focus') || messageLower.includes('priority')) {
      const bottomLenses = lensScores?.filter(l => l.score < 6.5).sort((a, b) => a.score - b.score) || [];
      return `I recommend focusing on these priority areas for improvement:

${bottomLenses.slice(0, 3).map((lens, idx) => `${idx + 1}. **${lens.name}** (${lens.score}/9.0) - ${lens.score < 6.0 ? 'Critical' : 'High'} priority
   - Current trend: ${lens.change >= 0 ? 'Stable' : 'Declining'} (${lens.change > 0 ? '+' : ''}${lens.change}%)
   - Impact: Addressing this can improve overall organizational effectiveness`).join('\n\n')}

For detailed action plans and recommendations, I suggest:
1. Review the AI Strategy Advisor for ${bottomLenses[0]?.name}
2. Implement quick wins from the Action Plan Generator
3. Track progress with Predictive Analytics

Would you like me to elaborate on any specific lens?`;
    }

    if (messageLower.includes('benchmark') || messageLower.includes('industry') || messageLower.includes('compare')) {
      const avgScore = lensScores?.reduce((sum, lens) => sum + lens.score, 0) / (lensScores?.length || 1);
      return `**Industry Benchmarking Insights:**

Your overall score: **${avgScore.toFixed(1)}/9.0**
Industry average: **6.2/9.0**
Top quartile: **7.5/9.0**

**Performance Analysis:**
${avgScore >= 7.5 ? '🏆 Excellent! You\'re performing in the top 25% of organizations in your industry.' : avgScore >= 6.2 ? '✓ Good. You\'re performing above industry average. Focus on reaching top quartile (7.5+).' : '⚠️ Below average. Significant improvement opportunities exist across multiple lenses.'}

**Key Competitive Insights:**
- Top performers excel in Systems & Processes (avg 8.2) and Sustainability (avg 7.8)
- Most organizations struggle with Financial management (avg 5.9)
- Strategic clarity is a key differentiator for market leaders

Want to see lens-by-lens comparisons? Check out the Competitive Benchmarking dashboard!`;
    }

    if (messageLower.includes('action') || messageLower.includes('next step') || messageLower.includes('what should')) {
      return `**Your Personalized Action Plan:**

**Immediate Actions (This Week):**
1. 📊 Review financial dashboard and implement weekly cash flow reviews
2. 👥 Launch employee pulse survey to baseline engagement
3. 🎯 Define Q1 OKRs and align leadership team

**This Month:**
1. Deploy AI sales pipeline analytics
2. Map and optimize top 3 critical processes
3. Implement customer health scoring system

**This Quarter:**
1. Execute digital transformation roadmap
2. Launch ESG framework and reporting
3. Optimize organizational structure and decision rights

**Expected Impact:**
- 20-30% improvement across weak lenses
- $500K+ in cost savings and efficiency gains
- 15-25% improvement in employee and customer satisfaction

Use the Action Plan Generator for detailed timelines, budgets, and success criteria. Want me to dive deeper into any of these initiatives?`;
    }

    if (messageLower.includes('financials') || messageLower.includes('money') || messageLower.includes('budget')) {
      const financialLens = lensScores?.find(l => l.name === 'Financials');
      return `**Financial Lens Analysis:**

Current Score: **${financialLens?.score || 'N/A'}/9.0**
Priority: ${(financialLens?.score || 7) < 6.0 ? 'Critical ⚠️' : 'Medium 📊'}

**Key Issues Detected:**
- Cash flow visibility and management needs improvement
- Financial planning and forecasting require strengthening
- Capital allocation and ROI tracking could be more rigorous

**Recommended Actions:**
1. Implement real-time financial dashboard with weekly reviews
2. Deploy zero-based budgeting framework
3. Establish cash flow forecasting with 90-day projections
4. Conduct expense audit targeting 10% cost reduction

**Expected Outcomes:**
- $500K+ annual savings
- Improved cash position and runway visibility
- Faster, data-driven financial decision-making

Would you like specific recommendations for improving financial operations?`;
    }

    // Default response with helpful guidance
    return `I understand you're asking about: "${userMessage}"

I can help you with:
- 📊 **Assessment Analysis**: Understanding your scores and trends
- 🎯 **Strategic Recommendations**: Specific advice for each lens
- 📈 **Performance Tracking**: Monitoring progress over time
- 🏆 **Benchmarking**: How you compare to peers
- 🗺️ **Action Planning**: Prioritized improvement initiatives
- ⚠️ **Risk Detection**: Identifying potential issues early

Try asking questions like:
- "What are my top priorities?"
- "How can I improve Financials?"
- "Show me quick wins for Operations"
- "What's my competitive position?"

What would be most helpful for you right now?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              AI Assistant
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">Natural language insights and strategic guidance</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-primary-600'
                  : 'bg-gradient-to-br from-secondary-600 to-indigo-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">
                        {line.split('**').map((part, j) =>
                          j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-secondary-600 to-indigo-600">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="border-t-2 border-gray-100 p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q.text)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 hover:border-secondary-400 rounded-xl text-sm text-gray-700 hover:text-secondary-700 transition-all text-left"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{q.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t-2 border-gray-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your assessment..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-indigo-600 hover:from-secondary-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
