// src/components/User/TaskManager.jsx
import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography
} from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Follow-up call with Client A',
      due: '2024-12-28',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Send weekly report',
      due: '2024-12-29',
      status: 'pending'
    }
  ]);

  const completeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div>
      <Typography variant="h6" className="mb-4">
        Communication Tasks
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText
              primary={task.title}
              secondary={`Due: ${task.due}`}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => completeTask(task.id)}
                disabled={task.status === 'completed'}
              >
                <CheckCircle />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => deleteTask(task.id)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TaskManager;