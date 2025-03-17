import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      alert('Failed to fetch users');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/api/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Users</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.id}</td>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={styles.td}>
                <button onClick={() => handleEditUser(user)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div style={styles.modal}>
          <h2>Edit User</h2>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            style={styles.input}
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            style={styles.select}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button onClick={handleUpdateUser} style={styles.saveButton}>Save</button>
          <button onClick={() => setEditingUser(null)} style={styles.cancelButton}>Cancel</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
  },
};

export default AdminUsersPage;