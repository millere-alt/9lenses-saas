# 🎓 9Lenses Guided Tour System

## Overview

The 9Lenses platform includes a comprehensive **Guided Tour System** that provides interactive, AI-enhanced onboarding for first-time visitors and contextual walkthroughs for specific features.

## ✨ Features

### 🎯 Intelligent Onboarding
- **Automatic welcome tour** for first-time visitors
- **Spotlight highlighting** of UI elements
- **Step-by-step guidance** with visual cues
- **Progress tracking** across tour steps
- **Smart positioning** of tour tooltips

### 🤖 AI Integration
- **AI coaching integrated** into tour steps
- **Contextual explanations** powered by Claude
- **Interactive Q&A** during tours
- **Personalized guidance** based on user context

### 📚 Multiple Tour Types
1. **Welcome Tour** - First-time visitor introduction (auto-starts)
2. **Framework Deep Dive** - Detailed explanation of 9Lenses
3. **Assessment Guide** - How to complete assessments
4. **Dashboard Walkthrough** - Understanding results
5. **AI Features Tour** - Exploring AI coaching capabilities

### 💾 Persistence
- **LocalStorage tracking** of completed tours
- **Skip functionality** for returning users
- **Tour progress saved** across sessions
- **Reset option** for testing/re-viewing

## 🏗️ Architecture

### Core Components

#### 1. GuidedTourContext ([src/contexts/GuidedTourContext.jsx](src/contexts/GuidedTourContext.jsx))

Manages tour state and navigation:

```javascript
import { useGuidedTour } from '../contexts/GuidedTourContext';

function MyComponent() {
  const {
    isActive,           // Is a tour currently running?
    currentStep,        // Current tour step object
    currentStepIndex,   // Current step number
    totalSteps,         // Total steps in tour
    progress,           // Progress percentage
    startTour,          // Start a tour by type
    nextStep,           // Go to next step
    prevStep,           // Go to previous step
    skipTour,           // Skip the current tour
    endTour             // End tour (with optional completion flag)
  } = useGuidedTour();
}
```

#### 2. GuidedTour Component ([src/components/GuidedTour.jsx](src/components/GuidedTour.jsx))

Renders the tour overlay:
- Dark overlay with spotlight effect
- Positioned tooltip with tour content
- Navigation buttons and progress
- Element highlighting and animations

#### 3. TourMenu Component ([src/components/TourMenu.jsx](src/components/TourMenu.jsx))

Tour selection interface:
- Lists all available tours
- Shows completion status
- Displays duration and step count
- Allows retaking completed tours

#### 4. Tour Steps Data ([src/data/tourSteps.js](src/data/tourSteps.js))

Defines all tour content:
- Step configurations
- AI coaching triggers
- Target elements
- Actions and navigation

## 📖 Usage Guide

### Auto-Start Welcome Tour

The welcome tour automatically starts for first-time visitors on the homepage:

```javascript
// In GuidedTourContext.jsx
useEffect(() => {
  if (!hasSeenWelcome && window.location.pathname === '/') {
    setTimeout(() => {
      startTour(TOUR_TYPES.FIRST_TIME);
    }, 1000); // 1 second delay
  }
}, [hasSeenWelcome]);
```

### Manual Tour Start

Add a tour menu button anywhere:

```javascript
import { TourMenuButton } from './components/TourMenu';

// Button variant
<TourMenuButton />

// Icon variant
<TourMenuButton variant="icon" />
```

Or start a specific tour programmatically:

```javascript
import { useGuidedTour } from '../contexts/GuidedTourContext';
import { TOUR_TYPES } from '../data/tourSteps';

function MyComponent() {
  const { startTour } = useGuidedTour();

  return (
    <button onClick={() => startTour(TOUR_TYPES.FRAMEWORK)}>
      Learn About Framework
    </button>
  );
}
```

### Adding Tour Targets

Add `data-tour` attributes to elements you want to highlight:

```javascript
<button
  data-tour="ai-coach-button"
  className="..."
>
  AI Coach
</button>

<div data-tour="framework-overview">
  {/* Framework content */}
</div>
```

### Creating New Tour Steps

Add steps to [src/data/tourSteps.js](src/data/tourSteps.js):

```javascript
export const MY_CUSTOM_TOUR = [
  {
    id: 'step-1',
    target: '[data-tour="my-element"]',  // CSS selector or 'body'
    placement: 'bottom',                  // top, bottom, left, right, center
    title: '🎯 Step Title',
    content: `Step description with **bold** text.

    Multi-line supported.`,

    // Optional: Highlight specific element
    highlightElement: '[data-tour="my-element"]',

    // Optional: Add pulse animation
    pulseElement: true,

    // Optional: Trigger AI coaching
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain this feature'
    },

    // Optional: Custom actions
    actions: [
      { label: 'Next', action: 'next', variant: 'primary' },
      { label: 'Skip', action: 'skip', variant: 'secondary' }
    ]
  }
];
```

### Available Tour Step Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique step identifier |
| `target` | string | CSS selector for element to highlight |
| `placement` | string | Tooltip position: `top`, `bottom`, `left`, `right`, `center` |
| `title` | string | Step title (can include emojis) |
| `content` | string | Step description (markdown **bold** supported) |
| `highlightElement` | string | Optional: CSS selector for spotlight |
| `pulseElement` | boolean | Optional: Add pulse animation |
| `showAICoach` | boolean | Optional: Trigger AI coach |
| `aiContext` | object | Optional: AI coaching context |
| `actions` | array | Optional: Custom action buttons |
| `waitForAction` | string | Optional: Wait for user action before continuing |

### Action Button Variants

```javascript
actions: [
  { label: 'Next', action: 'next', variant: 'primary' },
  { label: 'Back', action: 'prev', variant: 'secondary' },
  { label: 'Skip', action: 'skip', variant: 'tertiary' },
  { label: 'Finish', action: 'complete', variant: 'primary' },
  { label: 'Go to Dashboard', action: 'navigate:/dashboard', variant: 'primary' }
]
```

Available actions:
- `next` - Go to next step
- `prev` - Go to previous step
- `skip` - Skip entire tour
- `complete` - Complete and end tour
- `navigate:<path>` - Navigate to URL and end tour
- Custom action names for special handling

## 🎨 Styling & Customization

### Spotlight Effect

The tour creates a spotlight effect by:
1. Dark overlay covering entire screen
2. Highlighted element with border
3. Box shadow creating spotlight illusion

Customize in [src/components/GuidedTour.jsx](src/components/GuidedTour.jsx):

```javascript
boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6),
            0 0 20px rgba(99, 102, 241, 0.3),
            inset 0 0 20px rgba(99, 102, 241, 0.1)`
```

### Tooltip Styling

The tooltip uses gradient headers and clean content areas:

```javascript
<div className="bg-gradient-to-r from-indigo-600 to-purple-600">
  {/* Header */}
</div>
<div className="p-6">
  {/* Content */}
</div>
```

### Pulse Animation

Elements with `pulseElement: true` get animated:

```css
@keyframes tour-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
}
```

## 🔧 Advanced Features

### AI Coaching Integration

Tours can trigger AI coaching at any step:

```javascript
{
  id: 'ai-explanation',
  showAICoach: true,
  aiContext: {
    workflow: 'learning',
    userQuestion: 'Explain the Market lens in detail',
    currentLens: { id: 1, name: 'Market' }
  }
}
```

The AI coach will:
1. Automatically open (if `showAICoach: true`)
2. Request coaching based on `aiContext`
3. Display response alongside tour

### Wait for User Action

Pause the tour until user performs an action:

```javascript
{
  id: 'try-it-yourself',
  content: 'Click the AI Coach button to continue...',
  waitForAction: 'ai-coach-opened',
  actions: [
    { label: 'I Did It', action: 'next', variant: 'primary' },
    { label: 'Skip', action: 'next', variant: 'secondary' }
  ]
}
```

### Conditional Navigation

Navigate to different pages within a tour:

```javascript
{
  id: 'choose-path',
  actions: [
    { label: 'Start Assessment', action: 'navigate:/assessment/launch' },
    { label: 'View Dashboard', action: 'navigate:/dashboard' },
    { label: 'Continue Tour', action: 'next' }
  ]
}
```

### Dynamic Content

Tour content can include variables:

```javascript
{
  content: `Welcome ${userName}! You're currently viewing ${currentPage}.`
}
```

## 📊 Analytics & Tracking

Track tour usage:

```javascript
import { useGuidedTour } from '../contexts/GuidedTourContext';

function Analytics() {
  const { currentTourType, currentStepIndex, isActive } = useGuidedTour();

  useEffect(() => {
    if (isActive) {
      analytics.track('tour_step_viewed', {
        tourType: currentTourType,
        stepIndex: currentStepIndex
      });
    }
  }, [currentStepIndex]);
}
```

Tracked in localStorage:
```javascript
{
  hasSeenWelcome: true,
  completedTours: ['first_time', 'framework', 'assessment']
}
```

## 🐛 Troubleshooting

### Tour Not Starting
- Check `hasSeenWelcome` in localStorage
- Verify tour provider wraps app
- Ensure `GuidedTour` component is rendered
- Check browser console for errors

### Element Not Highlighting
- Verify `data-tour` attribute exists
- Check CSS selector is correct
- Element must be visible when tour starts
- Use `highlightElement` property

### Tooltip Positioning Issues
- Tooltip auto-adjusts to stay in viewport
- Use `placement` to suggest preferred position
- Check parent elements don't have `overflow: hidden`

### AI Coach Not Triggering
- Verify `showAICoach: true`
- Check `aiContext` is properly configured
- Ensure AI coach provider wraps app
- Check API key is configured (or mock mode)

### Reset Tour Progress

```javascript
const { resetTourProgress } = useGuidedTour();

// Reset all tour progress
resetTourProgress();

// Or manually clear localStorage
localStorage.removeItem('9lenses_tour_prefs');
```

## 🎯 Best Practices

### Tour Design
1. **Keep steps concise** - 2-4 sentences per step
2. **Use clear titles** - Include emojis for visual interest
3. **Highlight one thing** - Don't try to explain everything
4. **Show, don't tell** - Point to UI elements
5. **Provide escape** - Always allow skipping

### Content Writing
1. **Use "you"** - Second person, conversational
2. **Be enthusiastic** - Tours should be engaging
3. **Include benefits** - "This helps you..." not "This is..."
4. **Bold keywords** - Use **bold** for emphasis
5. **Action-oriented** - "Click here" vs "The button is here"

### AI Integration
1. **Complement, don't replace** - AI enhances, doesn't repeat tour
2. **Ask good questions** - Specific questions get better AI responses
3. **Provide context** - Include `currentLens`, `workflow` etc.
4. **Test responses** - Verify AI gives helpful answers

### Performance
1. **Lazy load tours** - Tours loaded on demand
2. **Limit animations** - Keep smooth on all devices
3. **Optimize selectors** - Use specific `data-tour` attributes
4. **Test on mobile** - Ensure responsive design works

## 📝 Examples

### Simple Tour

```javascript
export const SIMPLE_TOUR = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    title: 'Welcome!',
    content: 'Let me show you around.',
    actions: [{ label: 'Start', action: 'next', variant: 'primary' }]
  },
  {
    id: 'feature',
    target: '[data-tour="my-feature"]',
    placement: 'bottom',
    title: 'Cool Feature',
    content: 'This is a cool feature.',
    highlightElement: '[data-tour="my-feature"]',
    actions: [
      { label: 'Next', action: 'next', variant: 'primary' },
      { label: 'Back', action: 'prev', variant: 'secondary' }
    ]
  },
  {
    id: 'finish',
    target: 'body',
    placement: 'center',
    title: 'All Done!',
    content: 'You\'re ready to go!',
    actions: [{ label: 'Finish', action: 'complete', variant: 'primary' }]
  }
];
```

### AI-Enhanced Tour

```javascript
export const AI_TOUR = [
  {
    id: 'intro',
    target: 'body',
    placement: 'center',
    title: '🤖 AI-Powered Tour',
    content: 'I\'ll explain everything with AI assistance.',
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      message: 'I\'m excited to show you around with AI help!'
    },
    actions: [{ label: 'Continue', action: 'next', variant: 'primary' }]
  },
  {
    id: 'ai-feature',
    target: '[data-tour="ai-button"]',
    placement: 'left',
    title: '💬 Ask Me Anything',
    content: 'Click to chat with the AI coach.',
    highlightElement: '[data-tour="ai-button"]',
    pulseElement: true,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'What can I ask the AI coach about?'
    }
  }
];
```

## 🔗 Related Documentation

- [AI Coaching Guide](../AI_COACHING_GUIDE.md) - Full AI coaching documentation
- [AI Quick Start](../AI_COACHING_QUICKSTART.md) - Getting started with AI
- [Main README](../README.md) - Platform overview

---

**Need help?** The AI coach can answer questions about the guided tour system too!
