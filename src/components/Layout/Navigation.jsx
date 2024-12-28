// src/components/Layout/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography,
  Box
} from '@mui/material';
import { 
  CalendarMonth, 
  Dashboard, 
  Analytics,
  AdminPanelSettings,
  Message
} from '@mui/icons-material';
import NotificationSection from '../User/NotificationSection';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            marginRight: '2rem'
          }}
        >
          <CalendarMonth sx={{ mr: 1 }} />
          Communication Tracker
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/admin"
            color={isActive('/admin') ? 'primary' : 'inherit'}
            startIcon={<AdminPanelSettings />}
          >
            Admin
          </Button>

          <Button
            component={Link}
            to="/dashboard"
            color={isActive('/dashboard') ? 'primary' : 'inherit'}
            startIcon={<Dashboard />}
          >
            Dashboard
          </Button>

          <Button
            component={Link}
            to="/communications"
            color={isActive('/communications') ? 'primary' : 'inherit'}
            startIcon={<Message />}
          >
            Communications
          </Button>

          <Button
            component={Link}
            to="/calendar"
            color={isActive('/calendar') ? 'primary' : 'inherit'}
            startIcon={<CalendarMonth />}
          >
            Calendar
          </Button>

          <Button
            component={Link}
            to="/analytics"
            color={isActive('/analytics') ? 'primary' : 'inherit'}
            startIcon={<Analytics />}
          >
            Analytics
          </Button>
        </Box>

        <NotificationSection />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;