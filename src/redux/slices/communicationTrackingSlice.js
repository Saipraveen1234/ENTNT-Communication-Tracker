// src/redux/slices/communicationTrackingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communications: {
    '1': [
      {
        id: 1,
        type: 'Email',
        timestamp: '2024-12-01T10:00:00Z',
        notes: 'Quarterly review follow-up',
        outcome: 'Successful - Got response'
      },
      {
        id: 2,
        type: 'LinkedIn Post',
        timestamp: '2024-12-05T14:30:00Z',
        notes: 'Shared success story',
        outcome: 'Successful - High engagement'
      },
      {
        id: 3,
        type: 'Phone Call',
        timestamp: '2024-12-10T09:00:00Z',
        notes: 'Technical discussion',
        outcome: 'Successful - Issues resolved'
      },
      {
        id: 4,
        type: 'Meeting',
        timestamp: '2024-12-15T11:00:00Z',
        notes: 'Product roadmap discussion',
        outcome: 'Successful - Plan agreed'
      }
    ],
    '2': [
      {
        id: 5,
        type: 'Meeting',
        timestamp: '2024-12-03T11:00:00Z',
        notes: 'Product demo',
        outcome: 'Successful - Demo completed'
      },
      {
        id: 6,
        type: 'Email',
        timestamp: '2024-12-07T16:00:00Z',
        notes: 'Pricing proposal',
        outcome: 'Pending response'
      },
      {
        id: 7,
        type: 'Phone Call',
        timestamp: '2024-12-12T14:00:00Z',
        notes: 'Follow-up call',
        outcome: 'Successful - Questions answered'
      }
    ],
    '3': [
      {
        id: 8,
        type: 'Phone Call',
        timestamp: '2024-12-02T13:00:00Z',
        notes: 'Initial contact',
        outcome: 'Successful - Meeting scheduled'
      },
      {
        id: 9,
        type: 'Meeting',
        timestamp: '2024-12-08T10:00:00Z',
        notes: 'Requirements gathering',
        outcome: 'Successful - Requirements documented'
      },
      {
        id: 10,
        type: 'Email',
        timestamp: '2024-12-14T15:30:00Z',
        notes: 'Project proposal',
        outcome: 'Pending review'
      }
    ]
  },
  scheduledCommunications: [
    {
      id: 11,
      companyId: '1',
      type: 'Meeting',
      scheduledDate: '2024-12-28T10:00:00Z',
      notes: '2025 Planning Meeting'
    },
    {
      id: 12,
      companyId: '2',
      type: 'Phone Call',
      scheduledDate: '2024-12-26T14:00:00Z',
      notes: 'Implementation check-in'
    },
    {
      id: 13,
      companyId: '3',
      type: 'Meeting',
      scheduledDate: '2024-12-27T11:00:00Z',
      notes: 'Contract renewal discussion'
    }
  ]
};


const communicationTrackingSlice = createSlice({
  name: 'communicationTracking',
  initialState,
  reducers: {
    logCommunication: (state, action) => {
      const { companyId, communication } = action.payload;
      if (!state.communications[companyId]) {
        state.communications[companyId] = [];
      }
      state.communications[companyId].unshift({
        ...communication,
        id: Date.now(),
        timestamp: communication.timestamp || new Date().toISOString(),
        status: 'completed'
      });
    },
    scheduleCommunication: (state, action) => {
      const { companyId, communication } = action.payload;
      state.scheduledCommunications.push({
        ...communication,
        id: Date.now(),
        companyId,
        status: 'scheduled'
      });
    },
    deleteScheduledCommunication: (state, action) => {
      state.scheduledCommunications = state.scheduledCommunications.filter(
        comm => comm.id !== action.payload
      );
    },
    markCommunicationComplete: (state, action) => {
      const { scheduleId, communication } = action.payload;
      const companyId = communication.companyId;
      
      // Remove from scheduled
      state.scheduledCommunications = state.scheduledCommunications.filter(
        comm => comm.id !== scheduleId
      );
      
      // Add to communications
      if (!state.communications[companyId]) {
        state.communications[companyId] = [];
      }
      state.communications[companyId].unshift({
        ...communication,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
    }
  }
});

export const {
  logCommunication,
  scheduleCommunication,
  deleteScheduledCommunication,
  updateScheduledCommunication,
  markCommunicationComplete
} = communicationTrackingSlice.actions;

export default communicationTrackingSlice.reducer;