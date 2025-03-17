import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ViewClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get(`/api/claims/user/${userId}`);
        setClaims(response.data);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
        alert('Failed to fetch claims. Please try again later.');
      }
    };

    fetchClaims();
  }, [userId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Claims</h1>
      {claims.length > 0 ? (
        <ul style={styles.list}>
          {claims.map((claim) => (
            <li key={claim.id} style={styles.listItem}>
              <strong>Claim Number:</strong> {claim.claimNumber} <br />
              <strong>Status:</strong> {claim.status} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no claims.</p>
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
};

export default ViewClaimsPage;