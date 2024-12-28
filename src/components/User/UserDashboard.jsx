// src/components/User/UserDashboard.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  Popover,
  Card,
  CardContent
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const CommunicationTooltip = ({ communication }) => (
  <Card sx={{ maxWidth: 300, boxShadow: 'none' }}>
    <CardContent>
      <Typography variant="subtitle2" gutterBottom>
        {communication.type} - {new Date(communication.timestamp || communication.scheduledDate).toLocaleString()}
      </Typography>
      {communication.notes && (
        <Typography variant="body2" color="text.secondary">
          Notes: {communication.notes}
        </Typography>
      )}
      {communication.outcome && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Outcome: {communication.outcome}
        </Typography>
      )}
      {communication.status === 'completed' && (
        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
          ✓ Completed
        </Typography>
      )}
    </CardContent>
  </Card>
);

const InteractiveCommunicationChip = ({ communication, isScheduled = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'linkedin post':
      case 'linkedin message':
        return <LinkedInIcon fontSize="small" />;
      case 'email':
        return <EmailIcon fontSize="small" />;
      case 'phone call':
        return <PhoneIcon fontSize="small" />;
      default:
        return <MessageIcon fontSize="small" />;
    }
  };

  const getChipColor = (status) => {
    if (isScheduled) {
      if (status === 'overdue') return 'error';
      if (status === 'today') return 'warning';
      return 'default';
    }
    return 'primary';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Chip
        icon={getIcon(communication.type)}
        label={`${communication.type} - ${formatDate(communication.timestamp || communication.scheduledDate)}`}
        size="small"
        color={getChipColor(communication.status)}
        variant={isScheduled ? "filled" : "outlined"}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{ cursor: 'pointer' }}
        className="m-1"
      />
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <CommunicationTooltip communication={communication} />
      </Popover>
    </>
  );
};

const UserDashboard = () => {
  const companies = useSelector(state => state.companies.companies);
  const communications = useSelector(state => state.communicationTracking.communications);
  const scheduledComms = useSelector(state => state.communicationTracking.scheduledCommunications);
  const [highlightsEnabled, setHighlightsEnabled] = useState(true);

  const getRowStyle = (nextComm) => {
    if (!highlightsEnabled || !nextComm) return {};

    const today = new Date();
    const commDate = new Date(nextComm.scheduledDate);
    
    if (commDate < today) {
      return { backgroundColor: 'rgba(255, 0, 0, 0.1)' };
    } else if (commDate.toDateString() === today.toDateString()) {
      return { backgroundColor: 'rgba(255, 255, 0, 0.1)' };
    }
    return {};
  };

  return (
    <Box className="p-6">
      <Paper className="p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
          <Typography variant="h5">Communication Dashboard</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={highlightsEnabled}
                onChange={(e) => setHighlightsEnabled(e.target.checked)}
              />
            }
            label="Enable Highlights"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Last Five Communications</TableCell>
                <TableCell>Next Scheduled Communication</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => {
                const lastFiveComms = communications[company.id]?.slice(0, 5) || [];
                const nextComm = scheduledComms.find(comm => comm.companyId === company.id);

                return (
                  <TableRow key={company.id} style={getRowStyle(nextComm)}>
                    <TableCell>
                      <Typography variant="body1">
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {lastFiveComms.map((comm, index) => (
                          <InteractiveCommunicationChip 
                            key={index} 
                            communication={comm} 
                          />
                        ))}
                        {lastFiveComms.length === 0 && (
                          <Typography color="textSecondary">
                            No previous communications
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {nextComm ? (
                        <Box display="flex" alignItems="center">
                          <InteractiveCommunicationChip 
                            communication={nextComm} 
                            isScheduled={true} 
                          />
                          {new Date(nextComm.scheduledDate) < new Date() && (
                            <Tooltip title="Overdue communication">
                              <WarningIcon color="error" fontSize="small" className="ml-2" />
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Typography color="textSecondary">
                          No scheduled communications
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserDashboard;