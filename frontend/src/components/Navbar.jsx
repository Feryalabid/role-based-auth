import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      // Decode JWT payload
      role = JSON.parse(atob(token.split('.')[1])).role;
    } catch (err) {
      console.error('Failed to parse token:', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 p-4 text-white flex justify-between items-center">
      <h1 className="font-bold text-xl">MERN Role Auth</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>

        {/* Show Login/Signup only if not logged in */}
        {!token && <Link to="/login" className="hover:underline">Login</Link>}
        {!token && <Link to="/signup" className="hover:underline">Signup</Link>}

        {/* Show Admin link only if role is admin */}
        {role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}

        {/* Show Logout if logged in */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
