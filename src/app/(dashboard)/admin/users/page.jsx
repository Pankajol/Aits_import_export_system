'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewUser() {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/signup');
        setUsers(response.data || []); // Ensure 'accounts' is always an array
        console.log('res',response.data)
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Unable to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">View All Users</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : users.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Country</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Pin Code</th>
                <th className="py-2 px-4 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{user.firstName}</td>
                  <td className="py-2 px-4 border-b">{user.lastName}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.country}</td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">{user.pinCode}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewUser;
