import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    role: 'user',
    team: '',
    status: 'active'
  });

  const roles = ['admin', 'manager', 'user'];
  const teams = ['Sales', 'Marketing', 'Support'];

  const handleSave = () => {
    if (currentUser.id) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      setUsers([...users, { ...currentUser, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          setCurrentUser({});
          setOpen(true);
        }}
        className="mb-4"
      >
        Add New User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.team}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setCurrentUser(user);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {currentUser.id ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={currentUser.name || ''}
            onChange={(e) => setCurrentUser({
              ...currentUser,
              name: e.target.value
            })}
            className="mb-3 mt-2"
          />
          <TextField
            fullWidth
            label="Email"
            value={currentUser.email || ''}
            onChange={(e) => setCurrentUser({
              ...currentUser,
              email: e.target.value
            })}
            className="mb-3"
          />
          <FormControl fullWidth className="mb-3">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role || ''}
              onChange={(e) => setCurrentUser({
                ...currentUser,
                role: e.target.value
              })}
            >
              {roles.map(role => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="mb-3">
            <InputLabel>Team</InputLabel>
            <Select
              value={currentUser.team || ''}
              onChange={(e) => setCurrentUser({
                ...currentUser,
                team: e.target.value
              })}
            >
              {teams.map(team => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};