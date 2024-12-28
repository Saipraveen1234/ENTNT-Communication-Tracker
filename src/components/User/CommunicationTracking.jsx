// src/components/User/CommunicationTracking.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  Box, Paper, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tooltip, Alert, Tabs, Tab, OutlinedInput
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
  logCommunication,
  scheduleCommunication,
  deleteScheduledCommunication,
  markCommunicationComplete
} from '../../redux/slices/communicationTrackingSlice';

// Constants
const COMMUNICATION_TYPES = [
  'Email',
  'LinkedIn Post',
  'Phone Call',
  'Meeting',
  'Other'
];

// Helper function to format date for input field
const formatDateForInput = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
};

// Helper function to format date for display
const formatDateForDisplay = (date) => {
  try {
    return new Date(date).toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const CommunicationTracking = () => {
  const dispatch = useDispatch();
  const companies = useSelector(state => state.companies.companies);
  const communications = useSelector(state => state.communicationTracking.communications);
  const scheduledComms = useSelector(state => state.communicationTracking.scheduledCommunications);

  // Local state
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('log');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [communicationDetails, setCommunicationDetails] = useState({
    type: '',
    date: formatDateForInput(new Date()),
    time: new Date().toTimeString().slice(0,5),
    notes: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editingComm, setEditingComm] = useState(null);

  // Handlers
  const handleOpenModal = (type, comm = null) => {
    setModalType(type);
    if (comm) {
      const date = new Date(comm.scheduledDate || comm.timestamp);
      setEditingComm(comm);
      setCommunicationDetails({
        type: comm.type || '',
        date: formatDateForInput(date),
        time: date.toTimeString().slice(0,5),
        notes: comm.notes || ''
      });
      setSelectedCompanies([comm.companyId]);
    } else {
      setCommunicationDetails({
        type: '',
        date: formatDateForInput(new Date()),
        time: new Date().toTimeString().slice(0,5),
        notes: ''
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCompanies([]);
    setCommunicationDetails({
      type: '',
      date: formatDateForInput(new Date()),
      time: new Date().toTimeString().slice(0,5),
      notes: ''
    });
    setEditingComm(null);
  };

  const handleDelete = (comm) => {
    try {
      dispatch(deleteScheduledCommunication(comm.id));
      setAlertMessage('Communication deleted successfully');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error deleting communication');
      setShowAlert(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedCompanies.length || !communicationDetails.type) {
      setAlertMessage('Please select companies and communication type');
      setShowAlert(true);
      return;
    }

    try {
      selectedCompanies.forEach(companyId => {
        // Combine date and time
        const dateTime = new Date(`${communicationDetails.date}T${communicationDetails.time}`);
        
        const commData = {
          ...communicationDetails,
          id: editingComm?.id || Date.now(),
          timestamp: dateTime.toISOString(),
          scheduledDate: dateTime.toISOString()
        };
  
        if (modalType === 'log') {
          dispatch(logCommunication({
            companyId,
            communication: commData
          }));
        } else {
          dispatch(scheduleCommunication({
            companyId,
            communication: commData
          }));
        }
      });

      setAlertMessage(`Communication ${editingComm ? 'updated' : modalType === 'log' ? 'logged' : 'scheduled'} successfully`);
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      setAlertMessage('Error saving communication');
      setShowAlert(true);
    }
  };

  const handleMarkComplete = (comm) => {
    try {
      dispatch(markCommunicationComplete({
        scheduleId: comm.id,
        communication: {
          companyId: comm.companyId,
          type: comm.type,
          notes: comm.notes,
          timestamp: new Date().toISOString()
        }
      }));
      setAlertMessage('Communication marked as complete');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error marking communication as complete');
      setShowAlert(true);
    }
  };

  // Render methods
  const renderScheduledCommunications = () => (
    scheduledComms.map((comm) => (
      <TableRow key={comm.id}>
        <TableCell>{companies.find(c => c.id === comm.companyId)?.name || 'Unknown Company'}</TableCell>
        <TableCell>{comm.type}</TableCell>
        <TableCell>{formatDateForDisplay(comm.scheduledDate)}</TableCell>
        <TableCell>{comm.notes}</TableCell>
        <TableCell>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenModal('schedule', comm)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(comm)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark Complete">
            <IconButton onClick={() => handleMarkComplete(comm)} color="success">
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ))
  );

  const renderCommunicationHistory = () => (
    Object.entries(communications).map(([companyId, comms]) =>
      comms.map((comm) => (
        <TableRow key={comm.id}>
          <TableCell>{companies.find(c => c.id === companyId)?.name || 'Unknown Company'}</TableCell>
          <TableCell>{comm.type}</TableCell>
          <TableCell>{formatDateForDisplay(comm.timestamp)}</TableCell>
          <TableCell>{comm.notes}</TableCell>
          <TableCell>{comm.outcome || 'Completed'}</TableCell>
        </TableRow>
      ))
    )
  );

  // JSX
  return (
    <Box className="p-6">
      <Paper className="p-6">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Communications</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal('log')}
              sx={{ mr: 2 }}
            >
              Log Communication
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ScheduleIcon />}
              onClick={() => handleOpenModal('schedule')}
            >
              Schedule Communication
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Scheduled Communications" />
          <Tab label="Communication History" />
        </Tabs>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>{tabValue === 0 ? 'Scheduled Date' : 'Date'}</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tabValue === 0 ? renderScheduledCommunications() : renderCommunicationHistory()}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
  <DialogTitle>
    {modalType === 'log' ? 'Log Communication' : 'Schedule Communication'}
  </DialogTitle>
  <DialogContent>
    <Box sx={{ mt: 2 }}>
      {/* Company Select */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Companies</InputLabel>
        <Select
          multiple
          value={selectedCompanies}
          onChange={(e) => setSelectedCompanies(e.target.value)}
          input={<OutlinedInput label="Select Companies" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((companyId) => (
                <Chip
                  key={companyId}
                  label={companies.find(c => c.id === companyId)?.name}
                  size="small"
                />
              ))}
            </Box>
          )}
        >
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Communication Type */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Communication Type</InputLabel>
        <Select
          value={communicationDetails.type}
          onChange={(e) => setCommunicationDetails({
            ...communicationDetails,
            type: e.target.value
          })}
          label="Communication Type"
        >
          {COMMUNICATION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date and Time Fields */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          type="date"
          label={modalType === 'log' ? 'Communication Date' : 'Scheduled Date'}
          value={communicationDetails.date}
          onChange={(e) => setCommunicationDetails({
            ...communicationDetails,
            date: e.target.value
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          type="time"
          label="Time"
          value={communicationDetails.time}
          onChange={(e) => setCommunicationDetails({
            ...communicationDetails,
            time: e.target.value
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {/* Notes */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Notes"
        value={communicationDetails.notes}
        onChange={(e) => setCommunicationDetails({
          ...communicationDetails,
          notes: e.target.value
        })}
        placeholder="Enter any additional notes..."
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal}>Cancel</Button>
    <Button onClick={handleSubmit} variant="contained" color="primary">
      {editingComm ? 'Update' : modalType === 'log' ? 'Log' : 'Schedule'}
    </Button>
  </DialogActions>
</Dialog>

        {/* Alert */}
        {showAlert && (
          <Alert 
            severity={alertMessage.includes('Error') ? 'error' : 'success'}
            onClose={() => setShowAlert(false)}
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              zIndex: 9999
            }}
          >
            {alertMessage}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default CommunicationTracking;