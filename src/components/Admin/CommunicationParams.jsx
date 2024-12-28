// src/components/Admin/CommunicationParams.jsx
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Box,
  Typography 
} from '@mui/material';

const CommunicationParams = () => {
  const [params, setParams] = useState({
    type: '',
    frequency: '',
    template: '',
    rules: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Parameters saved:', params);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" className="mb-4">
        Communication Parameters
      </Typography>
      <FormControl fullWidth className="mb-3">
        <InputLabel>Communication Type</InputLabel>
        <Select
          value={params.type}
          onChange={(e) => setParams({ ...params, type: e.target.value })}
        >
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="meeting">Meeting</MenuItem>
          <MenuItem value="call">Call</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className="mb-3">
        <InputLabel>Frequency</InputLabel>
        <Select
          value={params.frequency}
          onChange={(e) => setParams({ ...params, frequency: e.target.value })}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Save Parameters
      </Button>
    </Box>
  );
};

export default CommunicationParams;