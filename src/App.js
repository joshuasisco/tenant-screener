import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './Login';
import Dashboard from './Dashboard';
import Upload from './Upload';

const navStyle = {
    backgroundColor: '#1e3a5f',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '1.5rem',
};

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
                setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
        });
        return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!session) return <Login />;

      return (
            <Router>
              <nav style={navStyle}>
            <div>
              <Link to="/" style={{ ...linkStyle, fontWeight: 'bold' }}>Tenant Screener</Link>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/upload" style={linkStyle}>Upload</Link>
    </div>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Sign Out</button>
    </nav>
      <Routes>
            <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Router>
  );
}

export default App;
