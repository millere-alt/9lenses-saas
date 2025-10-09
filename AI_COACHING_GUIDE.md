# 9Lenses AI Coaching System

## Overview

The 9Lenses SaaS platform now includes a comprehensive **Agentic AI Coaching System** powered by Claude AI. This system provides intelligent, context-aware coaching throughout all workflows and content in the application.

## 🎯 Key Features

### 1. **Contextual Intelligence**
- Understands the full 9Lenses framework (9 lenses, 44 sub-lenses, 242+ themes)
- Provides coaching specific to the user's current context
- Adapts responses based on workflow (assessment, dashboard, strategy, learning)

### 2. **Proactive Coaching**
- Automatically offers guidance as users navigate the application
- Explains what each lens, sub-lens, and theme means
- Provides examples and best practices
- Connects insights across multiple lenses

### 3. **Reactive Q&A**
- Users can ask any question about their assessment
- Natural language understanding of user intent
- Provides specific, actionable recommendations
- References relevant data and scores

### 4. **Multiple Integration Points**
- **Floating Widget**: Global AI coach accessible from any page
- **Inline Coaching**: Embedded coaching within workflows
- **Trigger Buttons**: Contextual coaching activation points
- **Auto-coaching**: Automatic guidance when entering new sections

## 🏗️ Architecture

### Core Components

#### 1. **AI Coaching Agent** (`src/services/aiCoachingAgent.js`)
The brain of the system. Handles:
- Communication with Claude AI API
- Context building from 9Lenses framework
- Assessment data integration
- Conversation history management
- Response generation and parsing

```javascript
import { aiCoach } from '../services/aiCoachingAgent';

// Get coaching for current context
const response = await aiCoach.getCoachingForContext({
  workflow: 'assessment',
  currentLens: lens,
  currentSubLens: subLens,
  specificTheme: 'Market Size',
  mode: 'proactive'
});
```

#### 2. **AI Coaching Context** (`src/contexts/AICoachingContext.jsx`)
React Context provider that:
- Manages coaching state across the application
- Provides hooks for requesting coaching
- Tracks assessment context and user scores
- Controls coach visibility and positioning

```javascript
import { useAICoaching } from '../contexts/AICoachingContext';

function MyComponent() {
  const {
    getCoachingForLens,
    getCoachingForTheme,
    askQuestion,
    isLoading
  } = useAICoaching();

  // Request coaching
  await getCoachingForLens(lensId);
}
```

#### 3. **UI Components**

##### AICoach (`src/components/AICoach.jsx`)
The floating coach widget:
- Appears bottom-right by default
- Expandable/collapsible
- Chat interface for Q&A
- Shows coaching messages and suggestions

##### CoachingTrigger (`src/components/CoachingTrigger.jsx`)
Flexible trigger component with multiple variants:
- **Button**: Full coaching button with icon
- **Icon**: Small icon button for compact spaces
- **Banner**: Eye-catching card-style trigger
- **Pill**: Subtle inline trigger

```javascript
import CoachingTrigger from './components/CoachingTrigger';

// Button variant
<CoachingTrigger
  lensId={1}
  variant="button"
  label="Get AI Coaching"
/>

// Banner variant (great for section headers)
<CoachingTrigger
  lensId={1}
  subLensId="1.1"
  variant="banner"
/>
```

##### InlineCoachingCard
Displays coaching directly in the page without triggering the widget:

```javascript
import { InlineCoachingCard } from './components/CoachingTrigger';

<InlineCoachingCard coaching={coachingResponse} />
```

## 🚀 Usage Guide

### Basic Integration

#### 1. Wrap your app with the provider (already done in App.jsx):

```javascript
import { AICoachingProvider } from './contexts/AICoachingContext';
import AICoach from './components/AICoach';

function App() {
  return (
    <AICoachingProvider>
      {/* Your app content */}
      <AICoach />
    </AICoachingProvider>
  );
}
```

#### 2. Use coaching in any component:

```javascript
import { useAICoaching } from '../contexts/AICoachingContext';

function AssessmentPage() {
  const { getCoachingForLens, showCoach } = useAICoaching();

  const handleNeedHelp = async () => {
    showCoach(); // Show the widget
    await getCoachingForLens(currentLensId);
  };

  return (
    <div>
      <button onClick={handleNeedHelp}>Need Help?</button>
    </div>
  );
}
```

### Advanced Usage

#### Context-Aware Coaching

Update the coaching context as users navigate:

```javascript
const { updateAssessmentContext, updateUserScores } = useAICoaching();

// Update when assessment data changes
useEffect(() => {
  updateAssessmentContext({
    company: { name: companyName },
    participant: { name: userName, role: userRole },
    currentLens: currentLens.name
  });
}, [companyName, userName, currentLens]);

// Update when scores are calculated
updateUserScores({
  'Market': { score: 7.5, trend: '+5%' },
  'People': { score: 6.2, trend: '-2%' }
});
```

#### Theme-Specific Coaching

```javascript
const { getCoachingForTheme } = useAICoaching();

// Get coaching for a specific theme
const coaching = await getCoachingForTheme(
  lensId,
  subLensId,
  'Market Size' // theme name
);
```

#### Natural Language Q&A

```javascript
const { askQuestion } = useAICoaching();

const response = await askQuestion(
  "What should I focus on to improve my Financial lens score?",
  'dashboard' // workflow context
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Required: Anthropic API Key
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Optional: AI Model (default: claude-3-5-sonnet-20241022)
VITE_AI_MODEL=claude-3-5-sonnet-20241022

# Optional: Enable/disable AI features (default: true)
VITE_AI_ENABLED=true
```

**⚠️ IMPORTANT**: In production, **never expose API keys in the browser**. Use a backend proxy/API route instead. The current implementation uses `dangerouslyAllowBrowser: true` which is **only for demos**.

### Production Setup

For production, create a backend API route:

```javascript
// backend/api/coaching.js
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req) {
  const { messages, systemPrompt } = await req.json();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY // Stored securely on server
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages
  });

  return Response.json(response);
}
```

Then update `aiCoachingAgent.js` to call your API instead of Anthropic directly.

## 📊 Coaching Workflows

### 1. Assessment Workflow
- Explains what each lens/sub-lens/theme means
- Provides examples for accurate rating
- Helps users understand scoring system
- Connects themes to business impact

### 2. Dashboard Workflow
- Interprets scores and trends
- Identifies patterns across lenses
- Prioritizes improvement areas
- Celebrates strengths

### 3. Strategy Workflow
- Translates insights into actions
- Prioritizes initiatives
- Provides implementation guidance
- Suggests metrics to track

### 4. Learning Workflow
- Explains concepts with examples
- Shows how lenses interconnect
- Provides industry-specific context
- Answers methodology questions

## 🎨 Customization

### Custom Coaching Logic

Extend the `AICoachingAgent` class:

```javascript
class CustomCoachingAgent extends AICoachingAgent {
  buildSystemPrompt(workflow) {
    const basePrompt = super.buildSystemPrompt(workflow);
    return basePrompt + '\n\nADDITIONAL CONTEXT: ' + myCustomContext;
  }
}
```

### Custom UI Components

Create your own coaching trigger:

```javascript
function MyCustomTrigger() {
  const { showCoach, getCoachingForLens } = useAICoaching();

  return (
    <button onClick={async () => {
      showCoach();
      await getCoachingForLens(1);
    }}>
      Ask AI Coach
    </button>
  );
}
```

## 🧪 Testing

### Mock Mode

When no API key is configured, the system automatically uses mock responses:

```javascript
// In aiCoachingAgent.js
if (!apiKey) {
  console.warn('Using mock responses');
  return this.getMockResponse(context);
}
```

### Test Different Scenarios

```javascript
// Test lens coaching
await getCoachingForLens(1); // Market

// Test theme coaching
await getCoachingForTheme(1, '1.1', 'Market Size');

// Test Q&A
await askQuestion('What are my biggest strengths?');

// Test dashboard coaching
await getDashboardCoaching();
```

## 📈 Analytics & Monitoring

Track coaching usage:

```javascript
const { requestCoaching } = useAICoaching();

const trackCoaching = async (context) => {
  const start = Date.now();
  const response = await requestCoaching(context);
  const duration = Date.now() - start;

  // Send to analytics
  analytics.track('ai_coaching_request', {
    workflow: context.workflow,
    lensId: context.currentLens?.id,
    duration,
    success: !!response
  });

  return response;
};
```

## 🔐 Security Best Practices

1. **Never commit API keys** - Use `.env` files (already in `.gitignore`)
2. **Use backend proxy** - Don't expose keys in browser (production)
3. **Rate limiting** - Implement on your API proxy
4. **Input validation** - Sanitize user questions before sending to API
5. **Content filtering** - Review AI responses for inappropriate content

## 📚 API Reference

### useAICoaching Hook

```typescript
interface AICoachingHook {
  // State
  isCoachVisible: boolean;
  coachingMessage: CoachingResponse | null;
  isLoading: boolean;
  coachPosition: 'bottom-right' | 'sidebar' | 'inline';

  // Actions
  requestCoaching: (context: CoachingContext) => Promise<CoachingResponse>;
  getCoachingForLens: (lensId: number) => Promise<CoachingResponse>;
  getCoachingForTheme: (lensId: number, subLensId: string, themeName: string) => Promise<CoachingResponse>;
  askQuestion: (question: string, workflow?: string) => Promise<CoachingResponse>;
  getDashboardCoaching: (focusLens?: Lens) => Promise<CoachingResponse>;
  getStrategyCoaching: (focus?: any) => Promise<CoachingResponse>;
  toggleCoach: () => void;
  hideCoach: () => void;
  showCoach: () => void;
  updateAssessmentContext: (context: any) => void;
  updateUserScores: (scores: any) => void;
  resetCoaching: () => void;
  setPosition: (position: string) => void;
}
```

### CoachingResponse

```typescript
interface CoachingResponse {
  message: string;           // Main coaching message
  suggestions: string[];     // Actionable suggestions
  type: 'proactive' | 'reactive';
}
```

## 🐛 Troubleshooting

### Coach not appearing
- Check that `AICoachingProvider` wraps your app
- Verify `<AICoach />` is rendered
- Check console for errors

### API errors
- Verify `VITE_ANTHROPIC_API_KEY` is set in `.env`
- Check API key is valid
- Ensure you have API credits

### Mock responses showing instead of real AI
- API key not configured or invalid
- Check browser console for warnings

## 🎯 Best Practices

1. **Update context frequently** - Keep assessment context fresh as users navigate
2. **Use appropriate variants** - Choose trigger styles that fit your UI
3. **Show coaching proactively** - Don't wait for users to ask
4. **Provide examples** - Help AI give better responses with context
5. **Monitor usage** - Track which features users engage with most

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review example implementations in the codebase
- Consult Anthropic's Claude API documentation

---

**Built with Claude AI and the 9Lenses Framework**
