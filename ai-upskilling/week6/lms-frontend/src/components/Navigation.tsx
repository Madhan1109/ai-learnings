import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Button, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const navItems = [
  { text: 'Dashboard', icon: <HomeIcon />, to: '/' },
  { text: 'Courses', icon: <BookIcon />, to: '/courses' },
  { text: 'Enrollments', icon: <AssignmentIcon />, to: '/enrollments' },
  { text: 'Assessments', icon: <AssignmentIcon />, to: '/assessments' },
  { text: 'Notifications', icon: <NotificationsIcon />, to: '/notifications' },
  { text: 'Chat', icon: <ChatIcon />, to: '/chat' },
  { text: 'Profile', icon: <PersonIcon />, to: '/profile' },
];

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleLogout = () => {
    // TODO: Clear auth context/token
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navItems.map(item => (
          <ListItem key={item.text} component={RouterLink} to={item.to}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem component="button" onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>AI LMS</Typography>
          {!isMobile && (
            <>
              {navItems.map(item => (
                <Button key={item.text} color="inherit" component={RouterLink} to={item.to} startIcon={item.icon} sx={{ ml: 1 }}>
                  {item.text}
                </Button>
              ))}
              <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleLogout} sx={{ ml: 1 }}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
} 