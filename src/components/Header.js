import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, userRole, setIsLoggedIn, setUserRole }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>Insurance Company</Link>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/" style={styles.link}>Home</Link>
              {userRole === 'ADMIN' && <Link to="/admin" style={styles.link}>Admin</Link>}
              {userRole === 'ADMIN' && <Link to="/admin/users" style={styles.link}>Manage Users</Link>}
              {userRole === 'ADMIN' && <Link to="/admin/policies" style={styles.link}>Manage Policies</Link>} {/* Новая ссылка */}
              {userRole === 'USER' && <Link to="/profile/create-policy" style={styles.link}>Create Policy</Link>}
              {userRole === 'USER' && <Link to="/profile/view-policies" style={styles.link}>View Policies</Link>}
              {userRole === 'USER' && <Link to="/profile/view-claims" style={styles.link}>View Claims</Link>}
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  brand: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '1rem',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '20px',
  },
};

export default Header;