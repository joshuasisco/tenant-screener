import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const styles = {
    container: {
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
    },
    header: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
    },
    title: {
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    filters: {
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
    },
    filterBtn: {
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid #d1d5db',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
    },
    filterBtnActive: {
          backgroundColor: '#1e3a5f',
          color: 'white',
          border: '1px solid #1e3a5f',
    },
    stats: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
    },
    statCard: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    statNumber: {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    statLabel: {
          color: '#6b7280',
          fontSize: '0.875rem',
    },
    grid: {
          display: 'grid',
          gap: '1rem',
    },
    card: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
    },
    cardHeader: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
    },
    applicantName: {
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    statusBadge: {
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '500',
    },
    statusNew: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    statusReviewing: { backgroundColor: '#fef3c7', color: '#92400e' },
    statusApproved: { backgroundColor: '#d1fae5', color: '#059669' },
    statusRejected: { backgroundColor: '#fee2e2', color: '#dc2626' },
    statusWaitlist: { backgroundColor: '#e5e7eb', color: '#4b5563' },
    infoGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
    },
    infoItem: {
          fontSize: '0.875rem',
    },
    infoLabel: {
          color: '#6b7280',
    },
    infoValue: {
          fontWeight: '500',
          color: '#1f2937',
    },
    actions: {
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
    },
    actionBtn: {
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
    },
    approveBtn: { backgroundColor: '#059669', color: 'white' },
    rejectBtn: { backgroundColor: '#dc2626', color: 'white' },
    waitlistBtn: { backgroundColor: '#6b7280', color: 'white' },
    reviewBtn: { backgroundColor: '#f59e0b', color: 'white' },
    expandBtn: {
          backgroundColor: '#e5e7eb',
          color: '#374151',
          marginLeft: 'auto',
    },
    emailBody: {
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          fontSize: '0.875rem',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflowY: 'auto',
    },
    notesArea: {
          width: '100%',
          padding: '0.75rem',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          resize: 'vertical',
    },
    scoreInput: {
          width: '60px',
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          textAlign: 'center',
    },
    empty: {
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#6b7280',
    },
};

const statusStyles = {
    new: styles.statusNew,
    reviewing: styles.statusReviewing,
    approved: styles.statusApproved,
    rejected: styles.statusRejected,
    waitlist: styles.statusWaitlist,
};

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

  const fetchApplications = async () => {
        setLoading(true);
        let query = supabase.from('tenant_applications').select('*').order('created_at', { ascending: false });

        if (filter !== 'all') {
                query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (error) {
                console.error('Error fetching applications:', error);
        } else {
                setApplications(data || []);
        }
        setLoading(false);
  };

  useEffect(() => {
        fetchApplications();
  }, [filter]);

  const updateApplication = async (id, updates) => {
        const { error } = await supabase
          .from('tenant_applications')
          .update(updates)
          .eq('id', id);

        if (error) {
                console.error('Error updating application:', error);
        } else {
                fetchApplications();
        }
  };

  const stats = {
        total: applications.length,
        new: applications.filter((a) => a.status === 'new').length,
        approved: applications.filter((a) => a.status === 'approved').length,
        avgIncome: applications.length > 0
          ? Math.round(applications.reduce((sum, a) => sum + (a.monthly_income || 0), 0) / applications.length)
                : 0,
  };

  if (loading) {
        return <div style={styles.container}>Loading applications...</div>;
  }

  return (
        <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tenant Applications</h1>
    </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Applications</div>
    </div>
          <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.new}</div>
            <div style={styles.statLabel}>New</div>
    </div>
          <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.approved}</div>
            <div style={styles.statLabel}>Approved</div>
    </div>
          <div style={styles.statCard}>
          <div style={styles.statNumber}>${stats.avgIncome.toLocaleString()}</div>
            <div style={styles.statLabel}>Avg. Income</div>
    </div>
    </div>

      <div style={styles.filters}>
  {['all', 'new', 'reviewing', 'approved', 'rejected', 'waitlist'].map((status) => (
              <button
                                                                                   key={status}
              onClick={() => setFilter(status)}
              style={{
                              ...styles.filterBtn,
                              ...(filter === status ? styles.filterBtnActive : {}),
              }}
          >
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const styles = {
    container: {
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
    },
    header: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
    },
    title: {
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    filters: {
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
    },
    filterBtn: {
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid #d1d5db',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
    },
    filterBtnActive: {
          backgroundColor: '#1e3a5f',
          color: 'white',
          border: '1px solid #1e3a5f',
    },
    stats: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
    },
    statCard: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    statNumber: {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    statLabel: {
          color: '#6b7280',
          fontSize: '0.875rem',
    },
    grid: {
          display: 'grid',
          gap: '1rem',
    },
    card: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
    },
    cardHeader: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
    },
    applicantName: {
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1e3a5f',
    },
    statusBadge: {
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '500',
    },
    statusNew: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    statusReviewing: { backgroundColor: '#fef3c7', color: '#92400e' },
    statusApproved: { backgroundColor: '#d1fae5', color: '#059669' },
    statusRejected: { backgroundColor: '#fee2e2', color: '#dc2626' },
    statusWaitlist: { backgroundColor: '#e5e7eb', color: '#4b5563' },
    infoGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75
