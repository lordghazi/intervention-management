import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import InterventionTable from './components/InterventionTable';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUsername('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/connexion" element={
            isLoggedIn ? <Navigate to="/interventions" /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUsername={setUsername} />
          } />
          <Route path="/interventions" element={
            isLoggedIn ? <InterventionTable userRole={userRole} username={username} onLogout={handleLogout} /> : <Navigate to="/connexion" />
          } />
          <Route path="*" element={<Navigate to="/connexion" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;