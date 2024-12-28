// src/components/User/NotificationSection.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Today as TodayIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const NotificationSection = () => {
  const companies = useSelector(state => state.companies.companies);
  const scheduledComms = useSelector(state => state.communicationTracking.scheduledCommunications);
  const [anchorEl, setAnchorEl] = useState(null);

  // Filter communications
  const filterCommunications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = [];
    const dueToday = [];

    scheduledComms.forEach(comm => {
      const commDate = new Date(comm.scheduledDate);
      commDate.setHours(0, 0, 0, 0);
      
      const company = companies.find(c => c.id === comm.companyId);
      if (!company) return;

      const notification = {
        company: company.name,
        type: comm.type,
        date: comm.scheduledDate,
        notes: comm.notes,
        id: comm.id
      };

      if (commDate < today) {
        overdue.push(notification);
      } else if (commDate.getTime() === today.getTime()) {
        dueToday.push(notification);
      }
    });

    return { overdue, dueToday };
  };

  const { overdue, dueToday } = filterCommunications();
  const totalNotifications = overdue.length + dueToday.length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const NotificationList = ({ items, type }) => (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: type === 'overdue' ? 'error.main' : 'warning.main',
          mb: 1
        }}
      >
        {type === 'overdue' ? (
          <WarningIcon color="error" />
        ) : (
          <TodayIcon color="warning" />
        )}
        {type === 'overdue' ? 'Overdue Communications' : "Today's Communications"}
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem 
            key={item.id}
            sx={{
              bgcolor: type === 'overdue' ? 'error.light' : 'warning.light',
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText
              primary={item.company}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" component="span">
                    {item.type} - {formatDate(item.date)}
                  </Typography>
                  {item.notes && (
                    <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                      Notes: {item.notes}
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={totalNotifications} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
            <Chip 
              label={`${totalNotifications} Total`}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>

          {overdue.length > 0 && (
            <NotificationList items={overdue} type="overdue" />
          )}

          {dueToday.length > 0 && (
            <>
              {overdue.length > 0 && <Divider sx={{ my: 2 }} />}
              <NotificationList items={dueToday} type="today" />
            </>
          )}

          {totalNotifications === 0 && (
            <Typography color="textSecondary" align="center">
              No pending notifications
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default NotificationSection;