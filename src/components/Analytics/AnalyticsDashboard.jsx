// src/components/Analytics/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Download } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const companies = useSelector(state => state.companies.companies);
  const communications = useSelector(state => state.communicationTracking.communications);
  const scheduledComms = useSelector(state => state.communicationTracking.scheduledCommunications);

  console.log("Companies:", companies);
  console.log("Communications:", communications);
  console.log("Scheduled:", scheduledComms);

  const [dateRange, setDateRange] = useState({
    start: '2024-11-28',
    end: '2024-12-27'
  });
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    generateActivityLogs();
  }, [communications, scheduledComms, companies]);

  const generateActivityLogs = () => {
    const logs = [];
    Object.entries(communications).forEach(([companyId, comms]) => {
      comms.forEach(comm => {
        logs.push({
          date: new Date(comm.timestamp),
          company: companies.find(c => c.id === companyId)?.name || 'Unknown',
          type: comm.type,
          status: 'Completed',
          notes: comm.notes
        });
      });
    });

    scheduledComms.forEach(comm => {
      logs.push({
        date: new Date(comm.scheduledDate),
        company: companies.find(c => c.id === comm.companyId)?.name || 'Unknown',
        type: comm.type,
        status: 'Scheduled',
        notes: comm.notes
      });
    });

    setActivityLogs(logs.sort((a, b) => b.date - a.date));
  };

  const calculateCommunicationFrequency = () => {
    const frequencyData = {};
    Object.entries(communications).forEach(([companyId, comms]) => {
      if (selectedCompany === 'all' || companyId === selectedCompany) {
        comms.forEach(comm => {
          const date = new Date(comm.timestamp);
          if (date >= new Date(dateRange.start) && date <= new Date(dateRange.end)) {
            frequencyData[comm.type] = (frequencyData[comm.type] || 0) + 1;
          }
        });
      }
    });

    if (Object.keys(frequencyData).length === 0) {
      return [
        { type: 'Email', count: 0 },
        { type: 'LinkedIn Post', count: 0 },
        { type: 'Phone Call', count: 0 },
        { type: 'Meeting', count: 0 }
      ];
    }

    return Object.entries(frequencyData).map(([type, count]) => ({
      type,
      count
    }));
  };

  const calculateEngagementEffectiveness = () => {
    const effectiveness = {};
    Object.entries(communications).forEach(([companyId, comms]) => {
      if (selectedCompany === 'all' || companyId === selectedCompany) {
        comms.forEach(comm => {
          if (!effectiveness[comm.type]) {
            effectiveness[comm.type] = {
              total: 0,
              successful: 0
            };
          }
          effectiveness[comm.type].total++;
          if (comm.outcome?.toLowerCase().includes('success')) {
            effectiveness[comm.type].successful++;
          }
        });
      }
    });

    if (Object.keys(effectiveness).length === 0) {
      return [
        { type: 'Email', effectiveness: 0 },
        { type: 'LinkedIn Post', effectiveness: 0 },
        { type: 'Phone Call', effectiveness: 0 },
        { type: 'Meeting', effectiveness: 0 }
      ];
    }

    return Object.entries(effectiveness).map(([type, data]) => ({
      type,
      effectiveness: data.total > 0 ? (data.successful / data.total) * 100 : 0
    }));
  };

  const calculateOverdueTrends = () => {
    const trends = {};
    scheduledComms.forEach(comm => {
      if (selectedCompany === 'all' || comm.companyId === selectedCompany) {
        const dueDate = new Date(comm.scheduledDate);
        if (dueDate < new Date()) {
          const monthYear = dueDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          trends[monthYear] = (trends[monthYear] || 0) + 1;
        }
      }
    });

    if (Object.keys(trends).length === 0) {
      return [
        { month: 'Dec 2024', overdue: 0 }
      ];
    }

    return Object.entries(trends).map(([month, overdue]) => ({
      month,
      overdue
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Communication Analytics Report', 20, 20);

    const frequencyData = calculateCommunicationFrequency();
    doc.autoTable({
      head: [['Communication Type', 'Frequency']],
      body: frequencyData.map(item => [item.type, item.count]),
      startY: 40
    });

    const effectivenessData = calculateEngagementEffectiveness();
    doc.autoTable({
      head: [['Communication Type', 'Effectiveness (%)']],
      body: effectivenessData.map(item => [
        item.type, 
        item.effectiveness.toFixed(1)
      ]),
      startY: doc.lastAutoTable.finalY + 20
    });

    doc.save('analytics-report.pdf');
  };

  const exportToCSV = () => {
    const frequencyData = calculateCommunicationFrequency()
      .map(item => `${item.type},${item.count}`)
      .join('\n');
    
    const blob = new Blob([`Type,Count\n${frequencyData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.csv';
    a.click();
  };

  return (
    <Box className="p-6">
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Company</InputLabel>
                  <Select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    label="Company"
                  >
                    <MenuItem value="all">All Companies</MenuItem>
                    {companies.map(company => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  type="date"
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  type="date"
                  label="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Communication Frequency */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Communication Frequency
            </Typography>
            <Box height={300}>
              <ResponsiveContainer>
                <BarChart data={calculateCommunicationFrequency()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Engagement Effectiveness */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Engagement Effectiveness
            </Typography>
            <Box height={300}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={calculateEngagementEffectiveness()}
                    dataKey="effectiveness"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {calculateEngagementEffectiveness().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Overdue Trends */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Overdue Communication Trends
            </Typography>
            <Box height={300}>
              <ResponsiveContainer>
                <LineChart data={calculateOverdueTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overdue" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Export Buttons */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportToPDF}
              >
                Export as PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportToCSV}
              >
                Export as CSV
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Activity Log */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Real-Time Activity Log
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.date.toLocaleString()}</TableCell>
                      <TableCell>{log.company}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.status}</TableCell>
                      <TableCell>{log.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;