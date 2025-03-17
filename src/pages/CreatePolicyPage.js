import React, { useState } from 'react';
import api from '../services/api';

const CreatePolicyPage = () => {
  const [policyType, setPolicyType] = useState('');
  const [policyDuration, setPolicyDuration] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userId = localStorage.getItem('userId');

  const handleCreatePolicy = async () => {
    if (!policyType) {
      setErrorMessage('Please select a policy type.');
      return;
    }

    if (!policyDuration) {
      setErrorMessage('Please enter a policy duration.');
      return;
    }

    const duration = parseInt(policyDuration, 10);

    if (isNaN(duration) || duration < 1 || duration > 10) {
      setErrorMessage('Policy duration must be a number between 1 and 10.');
      return;
    }

    const startDate = new Date().toISOString();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + duration);

    try {
      const response = await api.post('/api/policies/create', {
        policyType,
        startDate,
        endDate: endDate.toISOString(),
        userId: parseInt(userId),
        status: 'PENDING',
        user: { id: parseInt(userId) },
      });
      alert('Policy created successfully and is awaiting approval.');
      setPolicyType('');
      setPolicyDuration('');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Create a Policy</h1>
        <div style={styles.formGroup}>
          <select
            value={policyType}
            onChange={(e) => setPolicyType(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Policy Type</option>
            <option value="HEALTH">Health Insurance</option>
            <option value="CAR">Car Insurance</option>
            <option value="HOME">Home Insurance</option>
            <option value="TRAVEL">Travel Insurance</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Enter Policy Duration (1-10 years)"
            value={policyDuration}
            onChange={(e) => setPolicyDuration(e.target.value)}
            style={styles.input}
          />
        </div>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button onClick={handleCreatePolicy} style={styles.button}>
          Create Policy
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default CreatePolicyPage;