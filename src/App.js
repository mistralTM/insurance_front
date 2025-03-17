import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './components/AdminPanel';
import AdminUsersPage from './pages/AdminUsersPage';
import Header from './components/Header';
import Footer from './components/Footer';
import api from './services/api';
import CreatePolicyPage from './pages/CreatePolicyPage';
import ViewPoliciesPage from './pages/ViewPoliciesPage';
import ViewClaimsPage from './pages/ViewClaimsPage';
import AdminPoliciesPage from './pages/AdminPoliciesPage'; // Импорт новой страницы

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/check');
        setUserRole(response.data.role);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUserRole(null);
        setIsLoggedIn(false);
      }
    };

    if (isLoggedIn) {
      checkAuth();
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} userRole={userRole} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<HomePage userRole={userRole} />} />
        <Route path="/login" element={<LoginPage setUserRole={setUserRole} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile/create-policy"
          element={isLoggedIn && userRole === 'USER' ? <CreatePolicyPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/view-policies"
          element={isLoggedIn && userRole === 'USER' ? <ViewPoliciesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/view-claims"
          element={isLoggedIn && userRole === 'USER' ? <ViewClaimsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isLoggedIn && userRole === 'ADMIN' ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={isLoggedIn && userRole === 'ADMIN' ? <AdminUsersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/policies" // Новый маршрут для управления полисами
          element={isLoggedIn && userRole === 'ADMIN' ? <AdminPoliciesPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

function HomePage({ userRole }) {
  return (
    <div>
      <h1>Добро пожаловать!</h1>
      {userRole ? (
        <p>Вы вошли как {userRole === 'USER' ? 'пользователь' : 'админ'}.</p>
      ) : (
        <p>Пожалуйста, войдите или зарегистрируйтесь.</p>
      )}
    </div>
  );
}

export default App;