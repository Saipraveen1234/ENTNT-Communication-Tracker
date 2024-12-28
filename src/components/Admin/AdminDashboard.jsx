// src/components/Admin/AdminPanel.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  Divider
} from '@mui/material';
import { addCompany } from '../../redux/slices/companySlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    linkedinURL: '',
    emails: '',
    phoneNumbers: '',
    comments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCompany = {
      name: formData.companyName,
      location: formData.location,
      linkedinProfile: formData.linkedinURL,
      emails: formData.emails.split(',').map(email => email.trim()),
      phoneNumbers: formData.phoneNumbers.split(',').map(phone => phone.trim()),
      comments: formData.comments,
      id: Date.now()
    };

    dispatch(addCompany(newCompany));
    setFormData({
      companyName: '',
      location: '',
      linkedinURL: '',
      emails: '',
      phoneNumbers: '',
      comments: ''
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          Admin Panel
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  Add New Company
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={formData.linkedinURL}
                  onChange={(e) => setFormData({ ...formData, linkedinURL: e.target.value })}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emails"
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                  variant="outlined"
                  placeholder="email1@example.com, email2@example.com"
                  helperText="Separate multiple emails with commas"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Numbers"
                  value={formData.phoneNumbers}
                  onChange={(e) => setFormData({ ...formData, phoneNumbers: e.target.value })}
                  variant="outlined"
                  placeholder="+1234567890, +0987654321"
                  helperText="Separate multiple numbers with commas"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Add Company
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPanel;