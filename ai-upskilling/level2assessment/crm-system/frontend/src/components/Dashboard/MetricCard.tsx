import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend: string;
  trendUp: boolean;
  progress?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
  progress,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        position: 'relative',
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: [
          '0 8px 32px rgba(0, 0, 0, 0.1)',
          '0 16px 64px rgba(0, 0, 0, 0.05)',
          'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        ].join(', '),
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: [
            '0 12px 48px rgba(0, 0, 0, 0.15)',
            '0 24px 96px rgba(0, 0, 0, 0.1)',
            'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          ].join(', '),
          transform: 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : color === 'error' ? '#f44336' : '#9c27b0'} 0%, ${color === 'primary' ? '#764ba2' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : color === 'error' ? '#ef5350' : '#ba68c8'} 50%, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : color === 'error' ? '#f44336' : '#9c27b0'} 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : color === 'error' ? '#f44336' : '#9c27b0'} 0%, ${color === 'primary' ? '#764ba2' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : color === 'error' ? '#ef5350' : '#ba68c8'} 100%)`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Avatar>
          <Chip
            label={trend}
            size="small"
            icon={trendUp ? <TrendingUp /> : <TrendingDown />}
            color={trendUp ? 'success' : 'error'}
            variant="outlined"
            sx={{
              background: trendUp ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              border: trendUp ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)',
              color: trendUp ? 'success.main' : 'error.main',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          />
        </Box>
        
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : color === 'error' ? '#f44336' : '#9c27b0'} 0%, ${color === 'primary' ? '#764ba2' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : color === 'error' ? '#ef5350' : '#ba68c8'} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {value}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: '1rem',
            opacity: 0.8,
          }}
        >
          {title}
        </Typography>
        
        {progress !== undefined && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                background: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : color === 'error' ? '#f44336' : '#9c27b0'} 0%, ${color === 'primary' ? '#764ba2' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : color === 'error' ? '#ef5350' : '#ba68c8'} 100%)`,
                },
              }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              {progress}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard; 