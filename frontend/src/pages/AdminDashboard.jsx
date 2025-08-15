import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) navigate('/login');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      alert('Access denied or error fetching users');
      navigate('/');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await axios.delete(`http://localhost:5000/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await axios.patch(`http://localhost:5000/api/user/${id}/role`, { role: newRole }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>
      <h3 className="text-xl font-semibold mb-4">User Management</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="text-center">
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => toggleRole(u._id, u.role)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Toggle Role</button>
                <button onClick={() => deleteUser(u._id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
