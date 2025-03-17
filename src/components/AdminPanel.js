import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Загрузка всех пользователей
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get('/api/claims');
        setClaims(response.data);
      } catch (error) {
        alert('Failed to fetch claims');
      }
    };
    fetchClaims();
  }, []);
  
  // Загрузка полисов выбранного пользователя
  useEffect(() => {
    if (selectedUser) {
      const fetchPolicies = async () => {
        try {
          const response = await api.get(`/policies/user/${selectedUser.id}`);
          setPolicies(response.data);
        } catch (error) {
          alert('Failed to fetch policies');
        }
      };
      fetchPolicies();
    }
  }, [selectedUser]);

  // Загрузка заявок выбранного пользователя
  useEffect(() => {
    if (selectedUser) {
      const fetchClaims = async () => {
        try {
          const response = await api.get(`/api/claims/user/${selectedUser.id}`);
          setClaims(response.data);
        } catch (error) {
          alert('Failed to fetch claims');
        }
      };
      fetchClaims();
    }
  }, [selectedUser]);

  // Обработка выбора пользователя
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Обработка изменения роли пользователя
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      alert('Role updated successfully');
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/claims/${id}/approve`);
      setClaims(claims.map((claim) =>
        claim.id === id ? { ...claim, status: 'APPROVED' } : claim
      ));
      alert('Claim approved successfully');
    } catch (error) {
      console.error('Failed to approve claim:', error);
      alert('Failed to approve claim. Please try again later.');
    }
  };
  
  const handleReject = async (id) => {
    try {
      await api.put(`/api/claims/${id}/reject`);
      setClaims(claims.map((claim) =>
        claim.id === id ? { ...claim, status: 'REJECTED' } : claim
      ));
      alert('Claim rejected successfully');
    } catch (error) {
      console.error('Failed to reject claim:', error);
      alert('Failed to reject claim. Please try again later.');
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
  
      {/* Список заявок */}
      <div style={styles.section}>
        <h2>Claims</h2>
        <ul style={styles.list}>
          {claims.map((claim) => (
            <li key={claim.id} style={styles.listItem}>
              <strong>Claim Number:</strong> {claim.claimNumber} <br />
              <strong>Status:</strong> {claim.status} <br />
              {claim.status === 'PENDING' && (
                <>
                  <button onClick={() => handleApprove(claim.id)} style={styles.approveButton}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(claim.id)} style={styles.rejectButton}>
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
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
  section: {
    marginBottom: '30px',
  },
  subsection: {
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  select: {
    padding: '5px',
    borderRadius: '4px',
  },
  approveButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default AdminPanel;