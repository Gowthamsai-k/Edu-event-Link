import { Search, Filter, Calendar, Zap, Users } from 'lucide-react';

const Events = () => {
    return (
        <div className="section-padding" style={{ background: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '5rem', borderBottom: '2px solid var(--fg)', paddingBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '4.5rem', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>Explore / <span style={{ color: 'var(--primary)' }}>Events</span></h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Left Sidebar - My Groups */}
                    <aside style={{ position: 'sticky', top: '120px' }}>
                        <div className="modular-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid var(--fg)', paddingBottom: '1rem' }}>
                                <Users size={20} color="var(--primary)" />
                                <h4 style={{ textTransform: 'uppercase', fontSize: '1rem', fontWeight: '800' }}>My Groups</h4>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {['KLH AI Club', 'Drama Society', 'Chess Masters', 'GDSC KLH'].map(group => (
                                    <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} className="group-item">
                                        <div style={{ width: '32px', height: '32px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-strong)' }}>
                                            <Zap size={14} color="var(--primary)" />
                                        </div>
                                        {group}
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2.5rem', fontSize: '0.75rem' }}>
                                Manage Hub
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main>
                        {/* Toolbar */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1px', background: 'var(--border-strong)', border: '1px solid var(--border-strong)', marginBottom: '3rem' }}>
                            <div style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '0 1.5rem' }}>
                                <Search size={18} style={{ color: 'var(--muted-fg)', marginRight: '1rem' }} />
                                <input
                                    type="text"
                                    placeholder="Find your next experience..."
                                    style={{ width: '100%', padding: '1.25rem 0', border: 'none', outline: 'none', fontWeight: 'bold', fontSize: '1rem' }}
                                />
                            </div>
                            <button style={{ background: 'white', border: 'none', borderLeft: '1px solid var(--border-strong)', padding: '0 2rem', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={18} /> Refine
                            </button>
                        </div>

                        {/* Modular Grid Placeholder */}
                        <div style={{ padding: '8rem 0', textAlign: 'center', border: '1px dashed var(--border-strong)', background: 'var(--muted)' }}>
                            <Calendar size={60} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                            <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Accessing Database...</h2>
                            <p style={{ fontWeight: '600', color: 'var(--muted-fg)' }}>Real-time event synchronization in progress.</p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Events;
