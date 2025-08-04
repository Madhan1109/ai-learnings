import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Email,
  Phone,
  Event,
  Assignment,
  CheckCircle,
  Schedule,
  Person,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'opportunity';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  status?: 'completed' | 'pending' | 'overdue';
}

interface RecentActivityCardProps {
  activities?: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities = [] }) => {
  const theme = useTheme();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'email':
        return <Email color="primary" />;
      case 'call':
        return <Phone color="success" />;
      case 'meeting':
        return <Event color="warning" />;
      case 'task':
        return <Assignment color="info" />;
      case 'opportunity':
        return <CheckCircle color="secondary" />;
      default:
        return <Schedule color="action" />;
    }
  };

  const getStatusColor = (status?: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List sx={{ p: 0 }}>
          {activities.map((activity) => (
            <ListItem
              key={activity.id}
              sx={{
                px: 0,
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getActivityIcon(activity.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {activity.title}
                    </Typography>
                    {activity.status && (
                      <Chip
                        label={activity.status}
                        size="small"
                        color={getStatusColor(activity.status) as any}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Avatar
                        sx={{ width: 20, height: 20, fontSize: '0.75rem' }}
                        src={activity.user.avatar}
                      >
                        {activity.user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {activity.user.name} • {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
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

export default RecentActivityCard; 