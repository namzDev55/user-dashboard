import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Fetch user role to determine if admin
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-role', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data.role === 'admin');
      } catch (error) {
        console.error('Error fetching user role', error);
      }
    };
    if (token) fetchUserRole();
  }, [token]);

  const handleSignUp = async () => {
    try {
      await axios.post('http://localhost:5000/signup', { username, password, email });
      alert('Sign-up successful. You can now log in.');
    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  const handleRoleAssignment = async () => {
    try {
      await axios.post('http://localhost:5000/assign-role', { username, role }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Role assigned successfully.');
    } catch (error) {
      console.error('Error assigning role', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleSignUp}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        {isAdmin && (
          <button
            onClick={handleRoleAssignment}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
          >
            Assign Role
          </button>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;