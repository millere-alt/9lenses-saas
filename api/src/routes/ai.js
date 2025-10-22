import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Initialize Anthropic client
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }
  return new Anthropic({ apiKey });
};

// All routes require authentication
router.use(authenticate);

// POST /api/ai/chat - Send message to AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context, systemPrompt, maxTokens = 4096 } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt || 'You are an expert 9Vectors business assessment coach.',
      messages: [
        {
          role: 'user',
          content: typeof message === 'string' ? message : JSON.stringify(message)
        }
      ]
    });

    res.json({
      response: response.content[0].text,
      usage: response.usage,
      model: response.model
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// POST /api/ai/analyze - Analyze document or data with AI
router.post('/analyze', async (req, res) => {
  try {
    const { content, analysisType, maxTokens = 4096 } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const anthropic = getAnthropicClient();

    const systemPrompts = {
      document: 'You are an expert document analyst. Analyze the provided document and extract key insights, themes, and recommendations.',
      assessment: 'You are an expert business assessment analyst. Analyze the assessment data and provide actionable insights.',
      general: 'You are an expert analyst. Provide clear, actionable analysis of the provided content.'
    };

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompts[analysisType] || systemPrompts.general,
      messages: [
        {
          role: 'user',
          content: `Please analyze the following content:\n\n${content}`
        }
      ]
    });

    res.json({
      analysis: response.content[0].text,
      usage: response.usage,
      model: response.model
    });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

// POST /api/ai/coach - Get AI coaching suggestions
router.post('/coach', async (req, res) => {
  try {
    const { context, workflow, mode = 'coaching', maxTokens = 4096 } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const anthropic = getAnthropicClient();

    const systemPrompt = `You are an expert 9Vectors business assessment coach with deep knowledge of organizational development, strategic planning, and business operations. Your role is to provide intelligent, contextual coaching to help users understand and improve their organization across all 9 lenses.

The 9 Lenses Framework assesses organizations across:
1. Business Model - Revenue streams, value propositions
2. Operations - Processes, efficiency, quality
3. Technology - Infrastructure, innovation, digital transformation
4. People - Culture, talent, leadership
5. Customers - Relationships, satisfaction, retention
6. Finance - Financial health, planning, metrics
7. Strategy - Vision, goals, competitive positioning
8. Marketing - Brand, positioning, customer acquisition
9. Sales - Sales process, pipeline, conversion

Provide specific, actionable coaching based on the user's context.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: JSON.stringify(context)
        }
      ]
    });

    res.json({
      message: response.content[0].text,
      suggestions: extractSuggestions(response.content[0].text),
      usage: response.usage,
      model: response.model,
      type: mode
    });
  } catch (error) {
    console.error('Error in AI coaching:', error);
    res.status(500).json({ error: 'Failed to get coaching suggestions' });
  }
});

// Helper function to extract suggestions from AI response
function extractSuggestions(text) {
  const suggestions = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.match(/^(\d+\.|-|\*)\s+/)) {
      suggestions.push(line.replace(/^(\d+\.|-|\*)\s+/, '').trim());
    }
  }

  return suggestions.slice(0, 5);
}

export default router;
