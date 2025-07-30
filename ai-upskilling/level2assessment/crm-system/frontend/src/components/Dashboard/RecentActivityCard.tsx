import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Timeline,
  Person,
  AttachMoney,
  Email,
  Phone,
  Meeting,
  Assignment,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

interface Activity {
  id: string;
  type: 'customer' | 'opportunity' | 'email' | 'call' | 'meeting' | 'task';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'in-progress';
  user: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Person />;
      case 'opportunity': return <AttachMoney />;
      case 'email': return <Email />;
      case 'call': return <Phone />;
      case 'meeting': return <Meeting />;
      case 'task': return <Assignment />;
      default: return <Timeline />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'customer': return 'primary';
      case 'opportunity': return 'success';
      case 'email': return 'info';
      case 'call': return 'warning';
      case 'meeting': return 'secondary';
      case 'task': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        avatar={<Timeline color="primary" />}
        action={
          <IconButton size="small">
            <Schedule />
          </IconButton>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <List dense>
          {activities.map((activity) => (
            <ListItem key={activity.id} sx={{ px: 2, py: 1 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: `${getActivityColor(activity.type)}.light`,
                    color: `${getActivityColor(activity.type)}.main`,
                    width: 32,
                    height: 32,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {activity.title}
                    </Typography>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={getStatusColor(activity.status) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {activity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {activity.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(activity.timestamp)}
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