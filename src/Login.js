import React, { useState } from 'react';
import { supabase } from './supabaseClient';
const styles = {
      container: {
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f3f4f6',
              padding: '1rem',
      },
      card: {
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '400px',
      },
      title: {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '0.5rem',
              color: '#1e3a5f',
      },
      subtitle: {
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '1.5rem',
      },
      form: {
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
      },
      inputGroup: {
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
      },
      label: {
              fontWeight: '500',
              color: '#374151',
      },
      input: {
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
      },
      button: {
              padding: '0.75rem',
              backgroundColor: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500',
      },
      toggleBtn: {
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              marginTop: '1rem',
              textAlign: 'center',
              width: '100%',
      },
      error: {
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
      },
      success: {
              backgroundColor: '#d1fae5',
              color: '#059669',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
      },
};

function Login() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isSignUp, setIsSignUp] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');
          setSuccess('');

          try {
                    if (isSignUp) {
                                const { error } = await supabase.auth.signUp({ email, password });
                                if (error) throw error;
                                setSuccess('Check your email for the confirmation link!');
                    } else {
                                const { error } = await supabase.auth.signInWithPassword({ email, password });
                                if (error) throw error;
                    }
          } catch (err) {
                    setError(err.message);
          } finally {
                    setLoading(false);
          }
  };

  return (
          <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Tenant Screener</h1>
            <p style={styles.subtitle}>
  {isSignUp ? 'Create an account' : 'Sign in to manage applications'}
</p>

{error && <div style={styles.error}>{error}</div>}
 {success && <div style={styles.success}>{success}</div>}

         <form onSubmit={handleSubmit} style={styles.form}>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
               required
             />
                   </div>
           <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               style={styles.input}
              required
              minLength={6}
            />
                  </div>
          <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
</button>
    </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={styles.toggleBtn}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
</button>
    </div>
    </div>
  );
}

export default Login;
