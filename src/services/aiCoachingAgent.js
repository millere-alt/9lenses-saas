/**
 * 9Vectors AI Coaching Agent
 *
 * This agentic AI system provides intelligent coaching across all 9Vectors content and workflows.
 * It understands the full framework (9 lenses, 44 sub-lenses, 242+ themes) and provides
 * contextual guidance, recommendations, and insights based on user interactions and assessment data.
 */

import Anthropic from '@anthropic-ai/sdk';
import { LENSES, LENS_CATEGORIES } from '../data/nineLensesSchema';

// Initialize Anthropic client (will use browser-based proxy in production)
const getAnthropicClient = () => {
  // In production, this should go through a backend API to protect the API key
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('Anthropic API key not configured. AI coaching will use mock responses.');
    return null;
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true // Only for demo - use backend proxy in production
  });
};

/**
 * Build comprehensive context about the 9Vectors framework
 */
const build9VectorsContext = () => {
  const context = {
    overview: `The 9Vectors framework is a comprehensive business assessment methodology that evaluates organizations across 9 interconnected dimensions, organized into three categories:

    1. ASSETS (Social Discovery Phase): Market, People, Financial
    2. PROCESSES (Social Design Phase): Strategy, Operations, Execution
    3. STRUCTURES (Social Assurance Phase): Expectations, Governance, Entity

    Each lens contains multiple sub-lenses, and each sub-lens contains specific themes to assess.`,

    lenses: LENSES.map(lens => ({
      id: lens.id,
      name: lens.name,
      category: lens.category,
      description: lens.description,
      subLenses: lens.subLenses.map(subLens => ({
        id: subLens.id,
        name: subLens.name,
        themes: subLens.themes,
        themeCount: subLens.themes.length
      })),
      totalThemes: lens.subLenses.reduce((sum, sl) => sum + sl.themes.length, 0)
    })),

    scoringSystem: {
      green: { range: '7-9', meaning: 'Strong performance', action: 'Maintain and leverage' },
      yellow: { range: '4-6', meaning: 'Moderate performance', action: 'Needs attention and improvement' },
      red: { range: '0-3', meaning: 'Weak performance', action: 'Requires immediate action' }
    }
  };

  return JSON.stringify(context, null, 2);
};

/**
 * Build context from user's assessment data
 */
const buildAssessmentContext = (assessmentData, userScores, currentLens, currentSubLens) => {
  const context = {
    companyInfo: assessmentData?.company || {},
    currentFocus: {
      lens: currentLens?.name,
      lensId: currentLens?.id,
      subLens: currentSubLens?.name,
      subLensId: currentSubLens?.id,
      category: currentLens?.category
    },
    scores: userScores || {},
    strengths: [],
    weaknesses: [],
    trends: []
  };

  // Analyze scores if available
  if (userScores) {
    Object.entries(userScores).forEach(([lensName, data]) => {
      if (data.score >= 7) {
        context.strengths.push({ lens: lensName, score: data.score });
      } else if (data.score < 4) {
        context.weaknesses.push({ lens: lensName, score: data.score });
      }
    });
  }

  return context;
};

/**
 * Main AI Coaching Agent class
 */
export class AICoachingAgent {
  constructor() {
    this.client = getAnthropicClient();
    this.conversationHistory = [];
    this.systemContext = build9VectorsContext();
  }

  /**
   * Get coaching for a specific workflow/page
   */
  async getCoachingForContext(context) {
    const {
      workflow, // 'assessment', 'dashboard', 'strategy', 'learning'
      assessmentData,
      userScores,
      currentLens,
      currentSubLens,
      userQuestion,
      mode = 'proactive' // 'proactive' or 'reactive'
    } = context;

    if (!this.client) {
      return this.getMockResponse(context);
    }

    const assessmentContext = buildAssessmentContext(
      assessmentData,
      userScores,
      currentLens,
      currentSubLens
    );

    const systemPrompt = this.buildSystemPrompt(workflow);
    const userPrompt = this.buildUserPrompt(context, assessmentContext);

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...this.conversationHistory,
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const assistantMessage = response.content[0].text;

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: assistantMessage }
      );

      // Keep conversation history manageable (last 10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        message: assistantMessage,
        suggestions: this.extractSuggestions(assistantMessage),
        type: mode
      };

    } catch (error) {
      console.error('AI Coaching error:', error);
      return this.getMockResponse(context);
    }
  }

  /**
   * Build system prompt based on workflow
   */
  buildSystemPrompt(workflow) {
    const basePrompt = `You are an expert 9Vectors business assessment coach with deep knowledge of organizational development, strategic planning, and business operations. Your role is to provide intelligent, contextual coaching to help users understand and improve their organization across all 9 lenses.

9Vectors FRAMEWORK KNOWLEDGE:
${this.systemContext}

YOUR COACHING APPROACH:
- Be conversational, supportive, and insightful
- Provide specific, actionable recommendations
- Reference specific lenses, sub-lenses, and themes when relevant
- Use business terminology appropriately
- Ask clarifying questions when needed
- Celebrate strengths while addressing weaknesses constructively
- Connect insights across multiple lenses to show interdependencies
- Provide examples and best practices from similar organizations

RESPONSE FORMAT:
- Keep responses concise but comprehensive (2-4 paragraphs)
- Use bullet points for action items
- Highlight key metrics and scores when relevant
- Suggest next steps or follow-up questions`;

    const workflowSpecific = {
      assessment: `\n\nCONTEXT: The user is currently completing an assessment. Focus on:
- Helping them understand what each theme means
- Providing examples to help them rate accurately
- Explaining why certain themes matter for their business
- Encouraging thorough qualitative responses
- Connecting current lens to other related lenses`,

      dashboard: `\n\nCONTEXT: The user is reviewing their assessment results. Focus on:
- Interpreting scores and trends
- Identifying patterns across lenses
- Prioritizing improvement areas
- Celebrating strengths and explaining how to leverage them
- Providing strategic insights from the data`,

      strategy: `\n\nCONTEXT: The user is developing strategy and action plans. Focus on:
- Translating assessment insights into concrete actions
- Prioritizing initiatives based on impact and feasibility
- Connecting strategic goals to specific lenses
- Providing implementation guidance
- Suggesting metrics to track progress`,

      learning: `\n\nCONTEXT: The user is learning about the 9Vectors framework. Focus on:
- Explaining concepts clearly with examples
- Showing how lenses interconnect
- Providing industry-specific context
- Answering methodology questions
- Helping them see the value of each lens`
    };

    return basePrompt + (workflowSpecific[workflow] || '');
  }

  /**
   * Build user prompt with context
   */
  buildUserPrompt(context, assessmentContext) {
    const {
      workflow,
      userQuestion,
      mode,
      currentLens,
      currentSubLens,
      specificTheme
    } = context;

    let prompt = `CURRENT SITUATION:\n`;
    prompt += `Workflow: ${workflow}\n`;
    prompt += `User Context: ${JSON.stringify(assessmentContext, null, 2)}\n\n`;

    if (mode === 'proactive') {
      // Agent proactively offers coaching
      if (currentLens && currentSubLens) {
        prompt += `The user is currently working on "${currentLens.name}" lens, specifically the "${currentSubLens.name}" sub-lens.`;
        if (specificTheme) {
          prompt += ` They are assessing the theme: "${specificTheme}".`;
        }
        prompt += `\n\nProvide helpful coaching about this area. Explain what it means, why it matters, and what good looks like. Give 2-3 specific examples of what they should consider when rating this.`;
      } else if (currentLens) {
        prompt += `The user is viewing the "${currentLens.name}" lens.\n\nProvide an overview of this lens, its importance, and key things to focus on.`;
      } else {
        prompt += `The user is in the ${workflow} workflow.\n\nProvide helpful guidance about what they should focus on and how to get the most value from this experience.`;
      }
    } else {
      // User asked a specific question
      prompt += `USER QUESTION: "${userQuestion}"\n\nProvide a helpful, specific answer based on their current context and the 9Vectors framework.`;
    }

    return prompt;
  }

  /**
   * Extract actionable suggestions from AI response
   */
  extractSuggestions(message) {
    const suggestions = [];
    const lines = message.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      // Look for bullet points or numbered items
      if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        const suggestion = trimmed.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, '');
        if (suggestion.length > 10 && suggestion.length < 200) {
          suggestions.push(suggestion);
        }
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Mock response when API is not configured
   */
  getMockResponse(context) {
    const { currentLens, currentSubLens, specificTheme, userQuestion } = context;

    if (userQuestion) {
      return {
        message: `Great question about "${userQuestion}"! \n\nBased on the 9Vectors framework, here's what you should know:\n\nThis relates to ${currentLens?.name || 'your overall assessment'} and is important because it helps you understand your organization's performance in this critical area. Consider how this connects to your strategic goals and operational excellence.\n\nKey considerations:\n- Assess your current state honestly and objectively\n- Look for evidence and data to support your ratings\n- Consider stakeholder perspectives\n- Think about trends over time\n\nWould you like me to dive deeper into any specific aspect?`,
        suggestions: [
          'Review related themes for a complete picture',
          'Gather data from relevant stakeholders',
          'Compare against industry benchmarks',
          'Document specific examples to support your assessment'
        ],
        type: 'reactive'
      };
    }

    if (specificTheme && currentSubLens && currentLens) {
      return {
        message: `Let's explore "${specificTheme}" within ${currentSubLens.name}.\n\nThis theme is part of the ${currentLens.name} lens (${currentLens.category} category) and focuses on ${this.getThemeDescription(specificTheme, currentLens.name)}.\n\n**Why it matters:**\nStrong performance here contributes to your overall ${currentLens.category.toLowerCase()} foundation and directly impacts your ability to ${this.getImpactArea(currentLens.name)}.\n\n**What to consider when rating:**\n- Current processes and systems in place\n- Quality and consistency of execution\n- Stakeholder satisfaction\n- Measurable outcomes and metrics\n- Trends over the past 6-12 months\n\n**Good looks like:** Organizations excelling here typically have documented processes, clear ownership, regular measurement, and continuous improvement mechanisms.`,
        suggestions: [
          `Gather specific examples related to ${specificTheme}`,
          `Review any existing metrics or KPIs`,
          `Consider input from team members involved`,
          `Think about recent changes or improvements made`
        ],
        type: 'proactive'
      };
    }

    return {
      message: `Welcome to your ${context.workflow} experience! I'm here to help you get the most value from the 9Vectors framework.\n\nThe 9Vectors assessment provides a comprehensive view of your organization across three key phases: Assets (what you have), Processes (what you do), and Structures (how you're organized).\n\nAs you work through this, remember:\n- Be honest and objective in your assessments\n- Provide specific examples in qualitative responses\n- Consider multiple perspectives (employees, customers, partners)\n- Use data and evidence where possible\n\nI'm here to answer questions, explain concepts, and help you interpret results. Just ask!`,
      suggestions: [
        'Start with areas you know well to build momentum',
        'Involve other stakeholders for diverse perspectives',
        'Gather relevant documents and data before assessing',
        'Take breaks between lenses to maintain focus'
      ],
      type: 'proactive'
    };
  }

  getThemeDescription(theme, lensName) {
    const descriptions = {
      'Market': 'understanding your market position and competitive dynamics',
      'People': 'optimizing your human capital and organizational culture',
      'Financial': 'ensuring financial health and sustainable economic performance',
      'Strategy': 'aligning strategic direction with market opportunities',
      'Operations': 'building operational excellence and efficiency',
      'Execution': 'measuring and improving performance execution',
      'Expectations': 'managing stakeholder expectations and alignment',
      'Governance': 'establishing proper governance and oversight',
      'Entity': 'structuring your legal entity and managing risk'
    };
    return descriptions[lensName] || 'organizational effectiveness';
  }

  getImpactArea(lensName) {
    const impacts = {
      'Market': 'compete effectively and capture market opportunities',
      'People': 'attract, retain, and develop top talent',
      'Financial': 'achieve sustainable financial performance',
      'Strategy': 'execute your strategic vision',
      'Operations': 'deliver consistent operational excellence',
      'Execution': 'drive accountability and results',
      'Expectations': 'build strong stakeholder relationships',
      'Governance': 'ensure compliance and ethical operations',
      'Entity': 'manage legal and regulatory requirements'
    };
    return impacts[lensName] || 'achieve your business objectives';
  }

  /**
   * Reset conversation (e.g., when switching contexts)
   */
  resetConversation() {
    this.conversationHistory = [];
  }

  /**
   * Get quick coaching tips for a lens
   */
  async getQuickTips(lensId) {
    const lens = LENSES.find(l => l.id === lensId);
    if (!lens) return null;

    return {
      lens: lens.name,
      category: lens.category,
      tips: [
        `Focus on the ${lens.subLenses.length} sub-lenses: ${lens.subLenses.map(sl => sl.name).join(', ')}`,
        `This lens is part of ${lens.category} - it helps you ${this.getImpactArea(lens.name)}`,
        `Total of ${lens.subLenses.reduce((sum, sl) => sum + sl.themes.length, 0)} themes to assess`,
        `Take your time and provide specific examples in qualitative responses`
      ],
      relatedLenses: this.getRelatedLenses(lens)
    };
  }

  getRelatedLenses(lens) {
    // Define logical relationships between lenses
    const relationships = {
      'Market': ['Strategy', 'Execution'],
      'People': ['Expectations', 'Governance'],
      'Financial': ['Strategy', 'Operations'],
      'Strategy': ['Market', 'Execution'],
      'Operations': ['Financial', 'Execution'],
      'Execution': ['Strategy', 'Operations'],
      'Expectations': ['People', 'Governance'],
      'Governance': ['Expectations', 'Entity'],
      'Entity': ['Governance', 'Financial']
    };

    return relationships[lens.name] || [];
  }
}

// Export singleton instance
export const aiCoach = new AICoachingAgent();

// Export utility functions
export const getCoachingForLens = (lensId, assessmentData) => {
  const lens = LENSES.find(l => l.id === lensId);
  return aiCoach.getCoachingForContext({
    workflow: 'assessment',
    assessmentData,
    currentLens: lens,
    mode: 'proactive'
  });
};

export const getCoachingForTheme = (lensId, subLensId, theme, assessmentData) => {
  const lens = LENSES.find(l => l.id === lensId);
  const subLens = lens?.subLenses.find(sl => sl.id === subLensId);

  return aiCoach.getCoachingForContext({
    workflow: 'assessment',
    assessmentData,
    currentLens: lens,
    currentSubLens: subLens,
    specificTheme: theme,
    mode: 'proactive'
  });
};

export const askCoachingQuestion = (question, context) => {
  return aiCoach.getCoachingForContext({
    ...context,
    userQuestion: question,
    mode: 'reactive'
  });
};
