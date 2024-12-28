// src/components/Admin/CompanyManagement.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { addCompany, updateCompany, deleteCompany } from '../../redux/slices/companySlice';

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const companies = useSelector(state => state.companies.companies);

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyData, setCompanyData] = useState({
    name: '',
    location: '',
    linkedinProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: 'success' });

  // Handlers
  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setCompanyData({
        name: company.name,
        location: company.location,
        linkedinProfile: company.linkedinProfile,
        emails: company.emails.join(', '),
        phoneNumbers: company.phoneNumbers.join(', '),
        comments: company.comments
      });
    } else {
      setEditingCompany(null);
      setCompanyData({
        name: '',
        location: '',
        linkedinProfile: '',
        emails: '',
        phoneNumbers: '',
        comments: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setCompanyData({
      name: '',
      location: '',
      linkedinProfile: '',
      emails: '',
      phoneNumbers: '',
      comments: ''
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!companyData.name || !companyData.location) {
      setAlertMessage({
        text: 'Company name and location are required',
        type: 'error'
      });
      setShowAlert(true);
      return;
    }

    const formattedCompany = {
      id: editingCompany?.id || Date.now().toString(),
      name: companyData.name,
      location: companyData.location,
      linkedinProfile: companyData.linkedinProfile,
      emails: companyData.emails.split(',').map(email => email.trim()).filter(email => email),
      phoneNumbers: companyData.phoneNumbers.split(',').map(phone => phone.trim()).filter(phone => phone),
      comments: companyData.comments
    };

    if (editingCompany) {
      dispatch(updateCompany(formattedCompany));
      setAlertMessage({ text: 'Company updated successfully', type: 'success' });
    } else {
      dispatch(addCompany(formattedCompany));
      setAlertMessage({ text: 'Company added successfully', type: 'success' });
    }

    setShowAlert(true);
    handleCloseDialog();
  };

  const handleDelete = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(companyId));
      setAlertMessage({ text: 'Company deleted successfully', type: 'success' });
      setShowAlert(true);
    }
  };

  return (
    <Box className="p-6">
      <Paper className="p-6">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5">Company Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Company
          </Button>
        </Box>

        {/* Company List */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact Information</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Typography variant="subtitle1">{company.name}</Typography>
                  </TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {company.emails.length > 0 && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {company.emails.join(', ')}
                          </Typography>
                        </Box>
                      )}
                      {company.phoneNumbers.length > 0 && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {company.phoneNumbers.join(', ')}
                          </Typography>
                        </Box>
                      )}
                      {company.linkedinProfile && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinkedInIcon fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {company.linkedinProfile}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {company.comments}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenDialog(company)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(company.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCompany ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={companyData.location}
                    onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    value={companyData.linkedinProfile}
                    onChange={(e) => setCompanyData({ ...companyData, linkedinProfile: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emails (comma separated)"
                    value={companyData.emails}
                    onChange={(e) => setCompanyData({ ...companyData, emails: e.target.value })}
                    helperText="Enter multiple emails separated by commas"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Numbers (comma separated)"
                    value={companyData.phoneNumbers}
                    onChange={(e) => setCompanyData({ ...companyData, phoneNumbers: e.target.value })}
                    helperText="Enter multiple phone numbers separated by commas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments"
                    value={companyData.comments}
                    onChange={(e) => setCompanyData({ ...companyData, comments: e.target.value })}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingCompany ? 'Update' : 'Add'} Company
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert */}
        {showAlert && (
          <Alert 
            severity={alertMessage.type}
            onClose={() => setShowAlert(false)}
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              zIndex: 9999
            }}
          >
            {alertMessage.text}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default CompanyManagement;