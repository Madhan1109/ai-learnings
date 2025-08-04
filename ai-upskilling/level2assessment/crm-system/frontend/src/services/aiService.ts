import * as tf from '@tensorflow/tfjs';
import { Customer, Opportunity, AnalyticsData } from '../types';

// AI Service for client-side machine learning features
class AIService {
  private leadScoringModel: tf.LayersModel | null = null;
  private sentimentModel: tf.LayersModel | null = null;

  // Initialize AI models
  async initializeModels() {
    try {
      // Load pre-trained models (in production, these would be loaded from a CDN or API)
      console.log('Initializing AI models...');
      
      // For demo purposes, we'll create simple models
      await this.createLeadScoringModel();
      await this.createSentimentModel();
      
      console.log('AI models initialized successfully');
    } catch (error) {
      console.error('Error initializing AI models:', error);
    }
  }

  // Create a simple lead scoring model
  private async createLeadScoringModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [5], units: 10, activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.leadScoringModel = model;
  }

  // Create a simple sentiment analysis model
  private async createSentimentModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.sentimentModel = model;
  }

  // Lead scoring based on customer data
  async scoreLead(customer: Customer): Promise<number> {
    if (!this.leadScoringModel) {
      throw new Error('Lead scoring model not initialized');
    }

    // Extract features from customer data
    const features = this.extractCustomerFeatures(customer);
    
    // Convert to tensor
    const input = tf.tensor2d([features], [1, 5]);
    
    // Make prediction
    const prediction = this.leadScoringModel.predict(input) as tf.Tensor;
    const score = await prediction.data();
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return Math.round(score[0] * 100);
  }

  // Extract features from customer data
  private extractCustomerFeatures(customer: Customer): number[] {
    // Convert customer data to numerical features
    const companySize = this.getCompanySizeScore(customer.company);
    const statusScore = this.getStatusScore(customer.status);
    const sourceScore = this.getSourceScore(customer.source);
    // Use createdAt as a proxy for lastContact since it's not available
    const contactScore = this.getContactScore(customer.createdAt);
    // Use company as a proxy for notes since notes is not available
    const notesScore = this.getNotesScore(customer.company || '');

    return [companySize, statusScore, sourceScore, contactScore, notesScore];
  }

  private getCompanySizeScore(company: string): number {
    const size = company.length;
    return Math.min(size / 50, 1); // Normalize to 0-1
  }

  private getStatusScore(status: string): number {
    const statusMap: Record<string, number> = {
      'lead': 0.3,
      'prospect': 0.6,
      'active': 0.8,
      'inactive': 0.1
    };
    return statusMap[status] || 0.5;
  }

  private getSourceScore(source: string): number {
    const sourceMap: Record<string, number> = {
      'website': 0.7,
      'referral': 0.9,
      'social': 0.6,
      'cold': 0.3,
      'email': 0.5
    };
    return sourceMap[source] || 0.5;
  }

  private getContactScore(lastContact: string): number {
    const daysSinceContact = (Date.now() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - daysSinceContact / 30); // Higher score for recent contact
  }

  private getNotesScore(notes: string): number {
    const wordCount = notes.split(' ').length;
    return Math.min(wordCount / 50, 1); // More notes = higher score
  }

  // Sentiment analysis of text
  async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    if (!this.sentimentModel) {
      throw new Error('Sentiment model not initialized');
    }

    // Simple keyword-based sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'unhappy', 'angry', 'frustrated'];
    
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  // Predictive analytics for sales forecasting
  async predictSales(opportunities: Opportunity[]): Promise<AnalyticsData> {
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
    const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;
    
    const predictedRevenue = totalValue * avgProbability;
    const conversionRate = opportunities.filter(opp => opp.stage === 'closed').length / opportunities.length;
    
    return {
      revenue: {
        current: predictedRevenue,
        previous: predictedRevenue * 0.9,
        growth: 10
      },
      customers: {
        current: opportunities.length,
        previous: Math.floor(opportunities.length * 0.95),
        growth: 5
      },
      conversionRate: {
        current: conversionRate * 100,
        previous: (conversionRate * 100) * 0.9,
        growth: 10
      },
      avgDealSize: {
        current: totalValue / opportunities.length,
        previous: (totalValue / opportunities.length) * 0.95,
        growth: 5
      },
      revenueData: [],
      customerData: [],
      salesData: [],
      insights: []
    };
  }

  // Get AI insights for dashboard
  async getInsights(customers: Customer[], opportunities: Opportunity[]): Promise<string[]> {
    const insights: string[] = [];
    
    // Analyze customer trends
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalCustomers = customers.length;
    const activationRate = (activeCustomers / totalCustomers) * 100;
    
    if (activationRate < 50) {
      insights.push('Customer activation rate is below target. Consider improving onboarding process.');
    }
    
    // Analyze sales pipeline
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
    const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;

    if (avgProbability < 0.5) {
      insights.push('Sales pipeline has low probability deals. Consider focusing on higher probability opportunities.');
    }

    return insights;
  }

  // Cleanup models when component unmounts
  dispose() {
    if (this.leadScoringModel) {
      this.leadScoringModel.dispose();
    }
    if (this.sentimentModel) {
      this.sentimentModel.dispose();
    }
  }
}

export const aiService = new AIService();
export default aiService; 