// src/components/User/CommunicationActions.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography,
  Alert
} from '@mui/material';
import { logCommunication } from '../../redux/slices/communicationTrackingSlice';

// Predefined communication types
const COMMUNICATION_TYPES = [
  'LinkedIn Post',
  'LinkedIn Message',
  'Email',
  'Phone Call',
  'Meeting',
  'Other'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CommunicationActions = () => {
  const dispatch = useDispatch();
  const companies = useSelector(state => state.companies.companies);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [communicationDetails, setCommunicationDetails] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCompanies([]);
    setCommunicationDetails({
      type: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleCompanySelect = (event) => {
    const value = event.target.value;
    setSelectedCompanies(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = () => {
    if (!selectedCompanies.length || !communicationDetails.type) {
      setAlertMessage('Please select at least one company and communication type');
      setShowAlert(true);
      return;
    }

    // Log communication for each selected company
    selectedCompanies.forEach(companyId => {
      dispatch(logCommunication({
        companyId,
        communication: {
          type: communicationDetails.type,
          timestamp: new Date(communicationDetails.date).toISOString(),
          notes: communicationDetails.notes,
          status: 'completed'
        }
      }));
    });

    setAlertMessage(`Communication logged for ${selectedCompanies.length} company(ies)`);
    setShowAlert(true);
    handleCloseModal();
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ mb: 2 }}
      >
        Communication Performed
      </Button>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Log Communication</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Companies</InputLabel>
              <Select
                multiple
                value={selectedCompanies}
                onChange={handleCompanySelect}
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
                MenuProps={MenuProps}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <TextField
              fullWidth
              type="date"
              label="Communication Date"
              value={communicationDetails.date}
              onChange={(e) => setCommunicationDetails({
                ...communicationDetails,
                date: e.target.value
              })}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

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
              placeholder="Enter any additional notes about the communication..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {showAlert && (
        <Alert 
          severity={alertMessage.includes('Please select') ? 'error' : 'success'}
          onClose={() => setShowAlert(false)}
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 9999,
            maxWidth: '500px'
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </Box>
  );
};

export default CommunicationActions;