// src/components/Admin/CompanyList.jsx
import React from 'react';
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
  IconButton,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const CompanyList = () => {
  const companies = useSelector(state => state.companies.companies);

  return (
    <Box className="p-6">
      <Paper className="p-4">
        <Typography variant="h5" gutterBottom>
          Managed Companies
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="20%">Company Name</TableCell>
                <TableCell width="15%">Location</TableCell>
                <TableCell width="35%">Contact Information</TableCell>
                <TableCell width="20%">Comments</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {company.name}
                    </Typography>
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
                    <Tooltip title="Edit Company">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Company">
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

export default CompanyList;