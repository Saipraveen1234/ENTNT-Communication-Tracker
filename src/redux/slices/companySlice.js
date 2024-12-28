// src/redux/slices/companySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [
    {
      id: '1',
      name: 'Tech Innovators Inc',
      location: 'San Francisco',
      linkedinProfile: 'linkedin.com/company/tech-innovators',
      emails: ['contact@techinnovators.com', 'support@techinnovators.com'],
      phoneNumbers: ['+1-555-0101', '+1-555-0102'],
      comments: 'Key enterprise client'
    },
    {
      id: '2',
      name: 'Global Software Solutions',
      location: 'New York',
      linkedinProfile: 'linkedin.com/company/global-software',
      emails: ['info@globalsoftware.com'],
      phoneNumbers: ['+1-555-0201'],
      comments: 'Expanding partnership'
    },
    {
      id: '3',
      name: 'DataSphere Analytics',
      location: 'Boston',
      linkedinProfile: 'linkedin.com/company/datasphere',
      emails: ['contact@datasphere.com', 'sales@datasphere.com'],
      phoneNumbers: ['+1-555-0301'],
      comments: 'New client - High potential'
    }
  ]
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompany: (state, action) => {
      state.companies.push({
        ...action.payload,
        id: Date.now().toString()
      });
    },
    updateCompany: (state, action) => {
      const index = state.companies.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
    deleteCompany: (state, action) => {
      state.companies = state.companies.filter(c => c.id !== action.payload);
    }
  }
});

export const {
  addCompany,
  updateCompany,
  deleteCompany
} = companySlice.actions;

export default companySlice.reducer;