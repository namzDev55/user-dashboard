import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Auth } from 'aws-amplify';
import './index.css';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';

const App = () => {
  const user = useSelector((state) => state.user.user);

  const PrivateRoute = ({ element, role }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (role && user.role !== role) {
      return <Navigate to="/dashboard" />;
    }
    return element;
  };

  return (
    <Router>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/admin" component={AdminPage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  </Router>
  );
};

export default App;