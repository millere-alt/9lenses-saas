import express from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { authenticate, checkSubscription } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Strategy Advisor
router.post('/strategy-advisor',
  authenticate,
  checkSubscription('BASIC'),
  async (req, res) => {
    try {
      const { assessmentData, context } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic business advisor for the 9Vectors framework. Provide actionable insights based on assessment data.'
          },
          {
            role: 'user',
            content: `Based on this assessment data: ${JSON.stringify(assessmentData)}\n\nContext: ${context}\n\nProvide strategic recommendations.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0].message.content;

      // Log AI usage
      await prisma.aIAnalysis.create({
        data: {
          type: 'strategy_advisor',
          prompt: context,
          response,
          tokensUsed: completion.usage.total_tokens
        }
      });

      // Update usage counter
      await prisma.organization.update({
        where: { id: req.user.organizationId },
        data: {
          usedAIRequests: { increment: 1 }
        }
      });

      res.json({ recommendations: response, tokensUsed: completion.usage.total_tokens });
    } catch (error) {
      console.error('Strategy advisor error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  }
);

// Predictive Analytics
router.post('/predictive-analytics',
  authenticate,
  checkSubscription('PRO'),
  async (req, res) => {
    try {
      const { historicalData, timeframe } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst specializing in business forecasting. Analyze trends and predict future outcomes.'
          },
          {
            role: 'user',
            content: `Analyze this historical data: ${JSON.stringify(historicalData)}\n\nProvide predictions for the next ${timeframe} months.`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      const predictions = completion.choices[0].message.content;

      await prisma.aIAnalysis.create({
        data: {
          type: 'predictive_analytics',
          prompt: `Timeframe: ${timeframe}`,
          response: predictions,
          tokensUsed: completion.usage.total_tokens
        }
      });

      res.json({ predictions });
    } catch (error) {
      console.error('Predictive analytics error:', error);
      res.status(500).json({ error: 'Failed to generate predictions' });
    }
  }
);

// Document Analysis
router.post('/document-analysis',
  authenticate,
  checkSubscription('PRO'),
  async (req, res) => {
    try {
      const { documentText, analysisType } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a document analyst. Extract key insights, themes, and actionable items from business documents.'
          },
          {
            role: 'user',
            content: `Analyze this document for ${analysisType}:\n\n${documentText}`
          }
        ],
        temperature: 0.6,
        max_tokens: 2000
      });

      const analysis = completion.choices[0].message.content;

      res.json({ analysis });
    } catch (error) {
      console.error('Document analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze document' });
    }
  }
);

// Natural Language Assistant
router.post('/assistant',
  authenticate,
  async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant for the 9Vectors platform. Help users understand their assessments, navigate features, and gain insights from their data.'
        },
        ...(conversationHistory || []),
        {
          role: 'user',
          content: message
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 800
      });

      const reply = completion.choices[0].message.content;

      res.json({ reply });
    } catch (error) {
      console.error('Assistant error:', error);
      res.status(500).json({ error: 'Failed to get response' });
    }
  }
);

export default router;
