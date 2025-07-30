import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  AutoAwesome,
  TrendingUp,
  Psychology,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

interface AIInsight {
  title: string;
  description: string;
  confidence: number;
  status: 'Active' | 'Pending' | 'Completed';
  type: 'success' | 'warning' | 'info';
}

interface AIInsightsCardProps {
  insights: AIInsight[];
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle color="success" />;
      case 'Pending': return <Warning color="warning" />;
      case 'Completed': return <Info color="info" />;
      default: return <Info color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="AI Insights"
        avatar={<AutoAwesome color="secondary" />}
        action={
          <Chip
            label="Real-time"
            size="small"
            color="secondary"
            variant="outlined"
          />
        }
      />
      <CardContent>
        <List dense>
          {insights.map((insight, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: `${insight.type}.light`, color: `${insight.type}.main`, width: 32, height: 32 }}>
                  {getTypeIcon(insight.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {insight.title}
                    </Typography>
                    <Chip
                      label={insight.status}
                      size="small"
                      color={getStatusColor(insight.status) as any}
                      icon={getStatusIcon(insight.status)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {insight.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Confidence:
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={insight.confidence}
                        color={insight.type}
                        sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {insight.confidence}%
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard; 