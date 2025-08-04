import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AutoAwesome,
  TrendingUp,
  TrendingDown,
  Psychology,
  Lightbulb,
  Warning,
  CheckCircle,
  Info,
  Refresh,
} from '@mui/icons-material';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
}

interface AIInsightsProps {
  insights: AIInsight[];
  onRefresh?: () => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights = [], onRefresh }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp />;
      case 'risk': return <Warning />;
      case 'trend': return <Psychology />;
      case 'recommendation': return <Lightbulb />;
      default: return <Info />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'success';
      case 'risk': return 'error';
      case 'trend': return 'info';
      case 'recommendation': return 'warning';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="secondary" />
          <Typography variant="h6">AI Insights</Typography>
        </Box>
        {onRefresh && (
          <Tooltip title="Refresh insights">
            <IconButton onClick={onRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Grid container spacing={3}>
        {insights.map((insight) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${getInsightColor(insight.type)}.light`,
                      color: `${getInsightColor(insight.type)}.main`,
                    }}
                  >
                    {getInsightIcon(insight.type)}
                  </Avatar>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={insight.category}
                      size="small"
                      color={getInsightColor(insight.type) as any}
                      variant="outlined"
                    />
                    <Chip
                      label={insight.impact}
                      size="small"
                      color={getImpactColor(insight.impact) as any}
                    />
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {insight.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {insight.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      AI Confidence
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {insight.confidence}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={insight.confidence}
                    color={getConfidenceColor(insight.confidence)}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Generated {formatTimestamp(insight.timestamp)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {insights.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AutoAwesome sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No AI Insights Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI is analyzing your data. Check back later for insights.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIInsights; 