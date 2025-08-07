import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  useTheme,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as SalesIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AutoAwesome as AIIcon,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  aiFeature?: boolean;
  badge?: number;
}

interface SidebarProps {
  menuItems: MenuItem[];
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, currentPath }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: [
          '0 8px 32px rgba(0, 0, 0, 0.1)',
          '0 16px 64px rgba(0, 0, 0, 0.05)',
          'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        ].join(', '),
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
          borderRadius: '0 0 4px 4px',
        },
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Security />
              </Avatar>
            </motion.div>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                CRM System
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AIIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  AI-Powered
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
              System Online
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, pt: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={currentPath === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 3,
                    mx: 0.5,
                    py: 1.5,
                    px: 2,
                    background: currentPath === item.path 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'transparent',
                    border: currentPath === item.path 
                      ? '1px solid rgba(102, 126, 234, 0.3)'
                      : '1px solid transparent',
                    boxShadow: currentPath === item.path 
                      ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                      : 'none',
                    backdropFilter: currentPath === item.path ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: currentPath === item.path
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)'
                        : 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: currentPath === item.path 
                        ? 'primary.main' 
                        : 'text.secondary',
                      minWidth: 40,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: currentPath === item.path ? 600 : 500,
                      color: currentPath === item.path ? 'primary.main' : 'text.primary',
                    }}
                  />
                  {item.badge && (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          height: 20,
                          minWidth: 20,
                        },
                      }}
                    />
                  )}
                  {item.aiFeature && (
                    <Chip
                      icon={<AIIcon />}
                      label="AI"
                      size="small"
                      color="secondary"
                      sx={{ 
                        ml: 1, 
                        height: 20,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': {
                          fontSize: '0.8rem',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <Box 
          sx={{ 
            p: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.firstName?.charAt(0) || 'M'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Madhan M S'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.role || 'Admin'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
            Last login: 2 hours ago
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Sidebar; 