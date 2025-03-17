import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ViewPoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get(`/api/policies/user/${userId}`);
        setPolicies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
        setError('Failed to fetch policies. Please try again later.');
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [userId]);

  const handleSubmitClaim = async (policyId) => {
    try {
      if (typeof policyId !== 'number') {
        alert('Invalid policyId. Please try again.');
        return;
      }

      const response = await api.post('/api/claims/create', {
        policyId: policyId,
        status: 'PENDING',
      });

      console.log("Claim created:", response.data);

      // Обновляем статус полиса и добавляем номер заявки
      setPolicies(policies.map((policy) =>
        policy.id === policyId ? { ...policy, status: 'CLAIM_PENDING', claimNumber: response.data.claimNumber } : policy
      ));

      alert('Claim submitted successfully and is awaiting review.');
    } catch (error) {
      console.error('Failed to submit claim:', error);
      alert('Failed to submit claim. Please try again later.');
    }
  };

  const isPolicyExpired = (policy) => {
    const endDate = new Date(policy.endDate);
    const currentDate = new Date();
    return endDate < currentDate;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Policies</h1>
      {loading ? (
        <p>Loading policies...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : policies.length > 0 ? (
        <ul style={styles.list}>
          {policies.map((policy) => {
            const expired = isPolicyExpired(policy);
            const isPending = policy.status === 'PENDING';
            const isRejected = policy.status === 'REJECTED';
            const isClaimPending = policy.status === 'CLAIM_PENDING';

            return (
              <li key={policy.id} style={{ 
                ...styles.listItem, 
                ...(isRejected ? styles.rejectedPolicy : {}),
                ...(expired ? styles.expiredPolicy : {})
              }}>
                <strong>Policy Number:</strong> {policy.policyNumber} <br />
                <strong>Policy Type:</strong> {policy.policyType} <br />
                <strong>Start Date:</strong> {new Date(policy.startDate).toLocaleDateString()} <br />
                <strong>End Date:</strong> {new Date(policy.endDate).toLocaleDateString()} <br />
                <strong>Status:</strong> {expired ? 'EXPIRED' : policy.status} <br />

                {isPending && (
                  <p style={styles.pendingMessage}>Please wait for the administrator to approve your policy.</p>
                )}

                {isRejected && (
                  <p style={styles.rejectedMessage}>This policy has been rejected by the administrator.</p>
                )}

                {expired && (
                  <p style={styles.expiredMessage}>This policy has expired and is no longer active.</p>
                )}

                {isClaimPending && (
                  <p style={styles.claimPendingMessage}>Your claim for this policy (Claim Number: {policy.claimNumber}) is currently pending review.</p>
                )}

                {!expired && !isPending && !isRejected && !isClaimPending && (
                  <button
                    onClick={() => handleSubmitClaim(policy.id)}
                    style={styles.claimButton}
                  >
                    Submit Claim
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have no policies.</p>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  claimButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginTop: '10px',
  },
  error: {
    color: 'red',
  },
  pendingMessage: {
    color: '#ffc107',
    fontStyle: 'italic',
  },
  rejectedMessage: {
    color: 'red',
    fontStyle: 'italic',
  },
  expiredMessage: {
    color: '#888',
    fontStyle: 'italic',
  },
  claimPendingMessage: {
    color: '#007bff',
    fontStyle: 'italic',
  },
  rejectedPolicy: {
    backgroundColor: '#f0f0f0',
    color: '#888',
    pointerEvents: 'none',
  },
  expiredPolicy: {
    backgroundColor: '#f0f0f0',
    color: '#888',
    pointerEvents: 'none',
  },
};

export default ViewPoliciesPage;