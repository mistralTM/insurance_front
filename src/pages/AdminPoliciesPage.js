// AdminPoliciesPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [editingPolicy, setEditingPolicy] = useState(null);

  // Массив с типами полисов
  const policyTypes = ['HEALTH', 'CAR', 'HOME', 'TRAVEL'];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await api.get('/api/policies');
      setPolicies(response.data);
    } catch (error) {
      alert('Failed to fetch policies');
    }
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy);
  };

  const handleUpdatePolicy = async () => {
    try {
      await api.put(`/api/policies/${editingPolicy.id}`, editingPolicy);
      setEditingPolicy(null);
      fetchPolicies();
    } catch (error) {
      alert('Failed to update policy');
    }
  };

  const handleDeletePolicy = async (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await api.delete(`/api/policies/${id}`);
        fetchPolicies();
      } catch (error) {
        alert('Failed to delete policy');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Policies</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Policy Number</th>
            <th style={styles.th}>Policy Type</th>
            <th style={styles.th}>Start Date</th>
            <th style={styles.th}>End Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id}>
              <td style={styles.td}>{policy.id}</td>
              <td style={styles.td}>{policy.policyNumber}</td>
              <td style={styles.td}>{policy.policyType}</td>
              <td style={styles.td}>{new Date(policy.startDate).toLocaleDateString()}</td>
              <td style={styles.td}>{new Date(policy.endDate).toLocaleDateString()}</td>
              <td style={styles.td}>{policy.status}</td>
              <td style={styles.td}>
                <button onClick={() => handleEditPolicy(policy)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDeletePolicy(policy.id)} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPolicy && (
        <div style={styles.modal}>
          <h2>Edit Policy</h2>
          {/* Выпадающий список для выбора типа полиса */}
          <select
            value={editingPolicy.policyType}
            onChange={(e) => setEditingPolicy({ ...editingPolicy, policyType: e.target.value })}
            style={styles.select}
          >
            {policyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="date"
            value={new Date(editingPolicy.startDate).toISOString().split('T')[0]}
            onChange={(e) => setEditingPolicy({ ...editingPolicy, startDate: new Date(e.target.value) })}
            style={styles.input}
          />
          <input
            type="date"
            value={new Date(editingPolicy.endDate).toISOString().split('T')[0]}
            onChange={(e) => setEditingPolicy({ ...editingPolicy, endDate: new Date(e.target.value) })}
            style={styles.input}
          />
          <select
            value={editingPolicy.status}
            onChange={(e) => setEditingPolicy({ ...editingPolicy, status: e.target.value })}
            style={styles.select}
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <button onClick={handleUpdatePolicy} style={styles.saveButton}>Save</button>
          <button onClick={() => setEditingPolicy(null)} style={styles.cancelButton}>Cancel</button>
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

export default AdminPoliciesPage;