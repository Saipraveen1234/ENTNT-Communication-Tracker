// src/components/Analytics/Insights.jsx
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography 
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const Insights = () => {
  const insights = [
    {
      id: 1,
      title: 'Communication Patterns',
      description: 'Most active communication days are Tuesdays and Thursdays'
    },
    {
      id: 2,
      title: 'Response Rates',
      description: 'Average response time has improved by 15% this month'
    },
    {
      id: 3,
      title: 'Channel Performance',
      description: 'Email communications show highest engagement rates'
    }
  ];

  return (
    <div>
      <Typography variant="h6" className="mb-4">
        Key Insights
      </Typography>
      <List>
        {insights.map((insight) => (
          <ListItem key={insight.id}>
            <ListItemIcon>
              <TrendingUp />
            </ListItemIcon>
            <ListItemText
              primary={insight.title}
              secondary={insight.description}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Insights;