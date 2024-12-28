// src/components/User/Calendar.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(3),
  height: '100%',
}));

const EventChip = styled(Chip)(({ theme, eventtype }) => ({
  borderRadius: '4px',
  fontWeight: 500,
  backgroundColor: getEventColor(eventtype, 0.1),
  color: getEventColor(eventtype, 1),
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

// Helper function to get event colors based on type
const getEventColor = (type, alpha = 1) => {
  const colors = {
    'Email': `rgba(25, 118, 210, ${alpha})`,
    'LinkedIn Post': `rgba(0, 119, 181, ${alpha})`,
    'Phone Call': `rgba(76, 175, 80, ${alpha})`,
    'Meeting': `rgba(255, 152, 0, ${alpha})`,
    'Other': `rgba(156, 39, 176, ${alpha})`,
  };
  return colors[type] || colors['Other'];
};

const Calendar = () => {
  // Redux state
  const companies = useSelector(state => state.companies.companies);
  const communications = useSelector(state => state.communicationTracking.communications);
  const scheduledComms = useSelector(state => state.communicationTracking.scheduledCommunications);

  // Local state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Format events for FullCalendar
  const formatEvents = () => {
    const events = [];

    // Add past communications
    Object.entries(communications).forEach(([companyId, comms]) => {
      comms.forEach(comm => {
        events.push({
          id: `past-${comm.id}`,
          title: `${companies.find(c => c.id === companyId)?.name} - ${comm.type}`,
          start: comm.timestamp,
          backgroundColor: getEventColor(comm.type),
          extendedProps: {
            type: comm.type,
            notes: comm.notes,
            companyName: companies.find(c => c.id === companyId)?.name,
            status: 'completed'
          }
        });
      });
    });

    // Add scheduled communications
    scheduledComms.forEach(comm => {
      events.push({
        id: `upcoming-${comm.id}`,
        title: `${companies.find(c => c.id === comm.companyId)?.name} - ${comm.type}`,
        start: comm.scheduledDate,
        backgroundColor: getEventColor(comm.type),
        extendedProps: {
          type: comm.type,
          notes: comm.notes,
          companyName: companies.find(c => c.id === comm.companyId)?.name,
          status: 'scheduled'
        }
      });
    });

    return events;
  };

  // Event handlers
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
      <StyledPaper>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="600" color="primary">
            Communication Calendar
          </Typography>
        </Box>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={formatEvents()}
          eventClick={handleEventClick}
          height="calc(100vh - 200px)"
          eventContent={(arg) => (
            <Tooltip title={arg.event.extendedProps.notes || 'No notes available'}>
              <Box sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <EventChip 
                  label={arg.event.extendedProps.type}
                  eventtype={arg.event.extendedProps.type}
                  size="small"
                />
                <Typography variant="caption" noWrap>
                  {arg.event.extendedProps.companyName}
                </Typography>
              </Box>
            </Tooltip>
          )}
        />

        {/* Event Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '12px' }
          }}
        >
          <DialogTitle>
            Communication Details
          </DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Box sx={{ pt: 1 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  {selectedEvent.extendedProps.companyName}
                </Typography>
                <EventChip 
                  label={selectedEvent.extendedProps.type}
                  eventtype={selectedEvent.extendedProps.type}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(selectedEvent.start).toLocaleString()}
                </Typography>
                {selectedEvent.extendedProps.notes && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedEvent.extendedProps.notes}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{ borderRadius: '8px' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Box>
  );
};

export default Calendar;