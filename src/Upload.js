import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
    title: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '1rem' },
    description: { color: '#6b7280', marginBottom: '2rem' },
    uploadArea: { border: '2px dashed #d1d5db', borderRadius: '12px', padding: '3rem', textAlign: 'center', backgroundColor: 'white', marginBottom: '2rem' },
    uploadBtn: { backgroundColor: '#1e3a5f', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' },
    preview: { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    emailCard: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' },
    processBtn: { backgroundColor: '#059669', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%', marginTop: '1rem' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' },
    success: { backgroundColor: '#d1fae5', color: '#059669', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' },
};

function Upload() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  const parseEmails = (jsonData) => {
        return jsonData.map((email) => ({
                applicant_name: email.applicant_name || email.name || 'Unknown',
                email: email.email || email.from_email || '',
                phone: email.phone || '',
                monthly_income: parseFloat(email.monthly_income || email.income) || null,
                move_in_date: email.move_in_date || null,
                num_occupants: parseInt(email.num_occupants || email.occupants) || 1,
                has_pets: email.has_pets || false,
                email_subject: email.subject || '',
                email_body: email.body || email.message || '',
                status: 'new',
        }));
  };

  const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
                try {
                          const jsonData = JSON.parse(event.target.result);
                          const emailArray = Array.isArray(jsonData) ? jsonData : [jsonData];
                          setEmails(parseEmails(emailArray));
                          setError('');
                } catch (err) {
                          setError('Invalid JSON file.');
                          setEmails([]);
                }
        };
        reader.readAsText(file);
  };

  const processEmails = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
                const { data: { user } } = await supabase.auth.getUser();
                const emailsWithUser = emails.map((email) => ({ ...email, user_id: user.id }));
                const { error: insertError } = await supabase.from('tenant_applications').insert(emailsWithUser);
                if (insertError) throw insertError;
                setSuccess('Successfully imported ' + emails.length + ' tenant applications!');
                setEmails([]);
        } catch (err) {
                setError(err.message);
        } finally {
                setLoading(false);
        }
  };

  return (
        <div style={styles.container}>
      <h1 style={styles.title}>Upload Tenant Emails</h1>
        <p style={styles.description}>Upload a JSON file containing tenant application emails.</p>
  {error && <div style={styles.error}>{error}</div>}
   {success && <div style={styles.success}>{success}</div>}
          <div style={styles.uploadArea}>
             <p>Select a JSON file to upload</p>
            <input type="file" accept=".json" onChange={handleFileUpload} id="file-upload" style={{marginTop: '1rem'}} />
     </div>
   {emails.length > 0 && (
             <div style={styles.preview}>
               <strong>Preview: {emails.length} email(s) ready to import</strong>
    {emails.slice(0, 5).map((email, index) => (
                  <div key={index} style={styles.emailCard}>
                    <div><strong>{email.applicant_name}</strong></div>
                    <div style={{fontSize: '0.875rem', color: '#6b7280'}}>{email.email} | ${email.monthly_income || 'N/A'}/mo</div>
      </div>
              ))}
   {emails.length > 5 && <p style={{textAlign: 'center', color: '#6b7280'}}>...and {emails.length - 5} more</p>}
             <button onClick={processEmails} style={styles.processBtn} disabled={loading}>
   {loading ? 'Importing...' : 'Import ' + emails.length + ' Application(s)'}
  </button>
    </div>
        )}
</div>
  );
}

export default Upload;
