import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const Events = () => {
    return (
        <div className="section-padding" style={{ background: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '5rem', borderBottom: '2px solid var(--fg)', paddingBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '4rem', textTransform: 'uppercase' }}>Explore / <span style={{ color: 'var(--primary)' }}>Events</span></h1>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1px', background: 'var(--border-strong)', border: '1px solid var(--border-strong)', marginBottom: '4rem' }}>
                    <div style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '0 1.5rem' }}>
                        <Search size={18} style={{ color: 'var(--muted-fg)', marginRight: '1rem' }} />
                        <input
                            type="text"
                            placeholder="Search event database..."
                            style={{ width: '100%', padding: '1.25rem 0', border: 'none', outline: 'none', fontWeight: 'bold', fontSize: '1rem' }}
                        />
                    </div>
                    <button style={{ background: 'white', border: 'none', borderLeft: '1px solid var(--border-strong)', padding: '0 2rem', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} /> Filter
                    </button>
                    <button className="btn btn-primary" style={{ border: 'none', padding: '0 3rem' }}>
                        Host +
                    </button>
                </div>

                {/* Modular Grid Placeholder */}
                <div style={{ padding: '8rem 0', textAlign: 'center', border: '1px dashed var(--border-strong)', background: 'var(--muted)' }}>
                    <Calendar size={60} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                    <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Accessing Database...</h2>
                    <p style={{ fontWeight: '600', color: 'var(--muted-fg)' }}>Real-time event synchronization in progress.</p>
                </div>
            </div>
        </div>
    );
};

export default Events;
