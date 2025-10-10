# 🚀 AI Coaching Quick Start Guide

Get your 9Vectors AI Coach up and running in 5 minutes!

## ✅ What's Already Installed

The AI coaching system is now fully integrated into your 9Vectors SaaS application:

✅ Anthropic SDK installed (`@anthropic-ai/sdk`)
✅ AI Agent service created
✅ React context providers configured
✅ UI components ready (floating widget, inline coaching, triggers)
✅ App.jsx wrapped with AICoachingProvider
✅ Global AI Coach widget active

## 🎯 Getting Started

### Option 1: Test with Mock Responses (No API Key Needed)

The system is **already working** with intelligent mock responses! Just:

1. **Open the app**: http://localhost:5173
2. **Look for the AI Coach button** (bottom-right corner with a 🤖 icon)
3. **Click it and ask questions** - it responds immediately with mock data

Try asking:
- "What are my biggest strengths?"
- "How can I improve Financial performance?"
- "Explain the Market lens"

### Option 2: Enable Real Claude AI (Recommended)

For full AI capabilities with Claude:

1. **Get an API key** from [Anthropic Console](https://console.anthropic.com/)

2. **Add to `.env` file**:
   ```bash
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. **Restart dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test it!** The AI coach now uses real Claude AI

## 🎨 Where to Find AI Coaching

### 1. Floating Widget (Everywhere)
- **Location**: Bottom-right corner of every page
- **Icon**: 🤖 Bot icon with green pulse
- **Usage**: Click to open, ask any question
- **Features**:
  - Natural language Q&A
  - Context-aware responses
  - Proactive suggestions
  - Expandable/minimizable

### 2. Assessment Pages
The AI coach automatically provides:
- **Lens explanations** when you enter a new section
- **Theme guidance** for each rating
- **Examples** to help accurate assessment
- **Help buttons** next to each section (🤔 icon)

Try: `/assessment/take` for the enhanced experience

### 3. Dashboard
- Click AI coach button for insights about your results
- Ask about specific lenses
- Get improvement recommendations

### 4. Any Page
The coaching trigger components can be added anywhere:

```jsx
import CoachingTrigger from './components/CoachingTrigger';

<CoachingTrigger
  lensId={1}
  variant="button"
  label="Get AI Coaching"
/>
```

## 🧪 Testing the System

### Test 1: Open the Widget
1. Go to any page
2. Click the AI coach button (bottom-right)
3. Type: "Tell me about the 9Vectors framework"
4. ✅ You should get a comprehensive response

### Test 2: Ask About Assessment
1. Start an assessment: `/assessment/take`
2. Look for the "Need help?" pill next to lens names
3. Click it
4. ✅ Coaching specific to that lens appears

### Test 3: Context-Aware Q&A
1. Open the AI coach
2. Ask: "What are my strengths?"
3. Then ask: "How do I improve the weakest areas?"
4. ✅ Responses should reference your assessment data

## 💡 What Questions Can I Ask?

The AI coach understands:

**General Framework Questions:**
- "Explain the Market lens"
- "What's the difference between Assets and Processes?"
- "How are the 9 lenses interconnected?"

**Assessment Help:**
- "What does 'Market Timing' mean?"
- "Give me examples of strong Financial performance"
- "How should I rate 'Employee Characteristics'?"

**Results Analysis:**
- "What are my biggest strengths?"
- "Where should I focus improvement?"
- "How do I compare to industry benchmarks?"

**Strategic Guidance:**
- "What actions should I take this quarter?"
- "How can I improve Operations?"
- "Give me quick wins for Strategy"

## 🔧 Customization

### Change Coach Position
```jsx
const { setPosition } = useAICoaching();

// Move to left side
setPosition('bottom-left');
```

### Add Coaching Anywhere
```jsx
import { useAICoaching } from '../contexts/AICoachingContext';

function MyComponent() {
  const { getCoachingForLens, showCoach } = useAICoaching();

  return (
    <button onClick={async () => {
      showCoach();
      await getCoachingForLens(1); // Market lens
    }}>
      Get Help
    </button>
  );
}
```

### Inline Coaching (No Widget)
```jsx
import { InlineCoachingCard } from './components/CoachingTrigger';
import { useAICoaching } from '../contexts/AICoachingContext';

function MySection() {
  const [coaching, setCoaching] = useState(null);
  const { getCoachingForTheme } = useAICoaching();

  useEffect(() => {
    getCoachingForTheme(1, '1.1', 'Market Size')
      .then(setCoaching);
  }, []);

  return <InlineCoachingCard coaching={coaching} />;
}
```

## 📖 Learn More

- **Full documentation**: See [AI_COACHING_GUIDE.md](AI_COACHING_GUIDE.md)
- **API reference**: Complete hook and component docs
- **Integration examples**: Multiple workflow implementations
- **Production setup**: Backend proxy configuration

## ⚠️ Important Notes

### Security
- ⚠️ **Never commit `.env` file** - it's gitignored by default
- ⚠️ **Production**: Use backend API proxy, not browser-side API calls
- ⚠️ Current setup uses `dangerouslyAllowBrowser: true` for demos only

### Performance
- Mock mode is instant (no API calls)
- Real AI typically responds in 1-3 seconds
- Conversation history limited to last 20 messages
- Responses cached for 15 minutes

### Features
- ✅ Works offline with mock responses
- ✅ Understands all 9 lenses, 44 sub-lenses, 242+ themes
- ✅ Context-aware based on user's current page/workflow
- ✅ Natural language understanding
- ✅ Actionable suggestions with every response

## 🎉 You're Ready!

Your AI coaching system is live and ready to use. The coach will:

1. **Guide users** through assessments with contextual help
2. **Answer questions** about any lens, theme, or strategy
3. **Provide insights** from assessment results
4. **Suggest actions** for improvement
5. **Explain concepts** with relevant examples

Just navigate to your app and click the AI coach button to start!

---

**Need help?** Check the full guide at [AI_COACHING_GUIDE.md](AI_COACHING_GUIDE.md)
