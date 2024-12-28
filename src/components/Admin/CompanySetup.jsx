import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { addCompany, updateCompany, deleteCompany } from '../../redux/slices/companySlice';

const CompanySetup = () => {
  const dispatch = useDispatch();
  const companies = useSelector(state => state.companies.companies);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [company, setCompany] = useState({
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    communicationPeriodicity: 14,
    comments: ''
  });

  const resetForm = () => {
    setCompany({
      name: '',
      location: '',
      linkedinProfile: '',
      emails: [''],
      phoneNumbers: [''],
      communicationPeriodicity: 14,
      comments: ''
    });
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...company.emails];
    newEmails[index] = value;
    setCompany({ ...company, emails: newEmails });
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...company.phoneNumbers];
    newPhones[index] = value;
    setCompany({ ...company, phoneNumbers: newPhones });
  };

  const addEmail = () => {
    setCompany({ ...company, emails: [...company.emails, ''] });
  };

  const addPhone = () => {
    setCompany({ ...company, phoneNumbers: [...company.phoneNumbers, ''] });
  };

  const removeEmail = (index) => {
    const newEmails = company.emails.filter((_, i) => i !== index);
    setCompany({ ...company, emails: newEmails });
  };

  const removePhone = (index) => {
    const newPhones = company.phoneNumbers.filter((_, i) => i !== index);
    setCompany({ ...company, phoneNumbers: newPhones });
  };

  const handleSave = () => {
    // Validate required fields
    if (!company.name || !company.location) {
      setSnackbarMessage('Company name and location are required');
      setShowSnackbar(true);
      return;
    }

    if (company.id) {
      dispatch(updateCompany(company));
      setSnackbarMessage('Company updated successfully');
    } else {
      dispatch(addCompany({
        ...company,
        createdAt: new Date().toISOString()
      }));
      setSnackbarMessage('Company added successfully');
    }
    
    setShowSnackbar(true);
    resetForm();
  };

  const handleDelete = (companyId) => {
    dispatch(deleteCompany(companyId));
    setSnackbarMessage('Company deleted successfully');
    setShowSnackbar(true);
  };

  const handleEdit = (companyToEdit) => {
    setCompany(companyToEdit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Paper className="p-6 max-w-4xl mx-auto mb-6">
        <Typography variant="h5" className="mb-6">
          {company.id ? 'Edit Company' : 'Add New Company'}
        </Typography>

        <Grid container spacing={3}>
          {/* Form fields remain the same as before */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Company Name"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              helperText="Company name is required"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Location"
              value={company.location}
              onChange={(e) => setCompany({ ...company, location: e.target.value })}
              helperText="Location is required"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn Profile"
              value={company.linkedinProfile}
              onChange={(e) => setCompany({ ...company, linkedinProfile: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" className="mb-2">
              Emails
            </Typography>
            <List>
              {company.emails.map((email, index) => (
                <ListItem key={index} className="px-0">
                  <TextField
                    fullWidth
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                  />
                  <IconButton onClick={() => removeEmail(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              onClick={addEmail}
              variant="text"
              color="primary"
              className="mt-2"
            >
              Add Email
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" className="mb-2">
              Phone Numbers
            </Typography>
            <List>
              {company.phoneNumbers.map((phone, index) => (
                <ListItem key={index} className="px-0">
                  <TextField
                    fullWidth
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder="Enter phone number"
                  />
                  <IconButton onClick={() => removePhone(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              onClick={addPhone}
              variant="text"
              color="primary"
              className="mt-2"
            >
              Add Phone Number
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Communication Periodicity (days)"
              value={company.communicationPeriodicity}
              onChange={(e) => setCompany({ 
                ...company, 
                communicationPeriodicity: parseInt(e.target.value) 
              })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comments"
              value={company.comments}
              onChange={(e) => setCompany({ ...company, comments: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>

          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleSave}
              className="mt-4"
            >
              {company.id ? 'Update Company' : 'Save Company'}
            </Button>
            {company.id && (
              <Button 
                variant="outlined" 
                color="secondary" 
                size="large"
                onClick={resetForm}
                className="mt-4 ml-2"
              >
                Cancel Edit
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Managed Companies Section */}
      <Paper className="p-6 max-w-4xl mx-auto">
        <Typography variant="h5" className="mb-6">
          Managed Companies
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Communication Period</TableCell>
                <TableCell>Emails</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell>{comp.name}</TableCell>
                  <TableCell>{comp.location}</TableCell>
                  <TableCell>{comp.communicationPeriodicity} days</TableCell>
                  <TableCell>{comp.emails.join(', ')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(comp)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comp.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CompanySetup;