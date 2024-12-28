// src/redux/slices/communicationMethodsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  methods: [
    {
      id: 1,
      name: 'LinkedIn Post',
      description: 'Post content on LinkedIn company page',
      sequence: 1,
      mandatory: true
    },
    {
      id: 2,
      name: 'LinkedIn Message',
      description: 'Direct message through LinkedIn',
      sequence: 2,
      mandatory: true
    },
    {
      id: 3,
      name: 'Email',
      description: 'Email communication',
      sequence: 3,
      mandatory: true
    },
    {
      id: 4,
      name: 'Phone Call',
      description: 'Direct phone communication',
      sequence: 4,
      mandatory: false
    },
    {
      id: 5,
      name: 'Other',
      description: 'Other forms of communication',
      sequence: 5,
      mandatory: false
    }
  ]
};

const communicationMethodsSlice = createSlice({
  name: 'communicationMethods',
  initialState,
  reducers: {
    addMethod: (state, action) => {
      const maxSequence = Math.max(...state.methods.map(m => m.sequence));
      state.methods.push({
        ...action.payload,
        id: Date.now(),
        sequence: maxSequence + 1
      });
    },
    updateMethod: (state, action) => {
      const index = state.methods.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.methods[index] = action.payload;
      }
    },
    deleteMethod: (state, action) => {
      state.methods = state.methods.filter(m => m.id !== action.payload);
    },
    reorderMethods: (state, action) => {
      state.methods = action.payload.map((method, index) => ({
        ...method,
        sequence: index + 1
      }));
    }
  }
});

export const { addMethod, updateMethod, deleteMethod, reorderMethods } = communicationMethodsSlice.actions;
export default communicationMethodsSlice.reducer;