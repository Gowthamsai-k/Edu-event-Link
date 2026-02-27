import React, { useState } from 'react';
import Announcement from '../components/Announcement';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Calendar, Users, Zap, ArrowRight, MapPin, Clock } from 'lucide-react';

const Home = () => {
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const stats = [
        { label: 'Active Events', value: '120+', icon: <Calendar size={24} color="var(--primary)" /> },
        { label: 'Communities', value: '45+', icon: <Users size={24} color="var(--fg)" /> },
        { label: 'Growth rate', value: '25%', icon: <Zap size={24} color="var(--primary)" /> },
    ];

    const upcomingEvents = [
        { title: 'Tech Symposium 2026', date: 'Mar 15', time: '10:00 AM', location: 'Main Hall', category: 'Tech' },
        { title: 'Spring Music Fest', date: 'Mar 20', time: '4:00 PM', location: 'Open Grounds', category: 'Music' },
        { title: 'AI Workshop', date: 'Mar 22', time: '2:00 PM', location: 'Lab 42', category: 'Live' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'white' }}>
            {showAnnouncement && (
                <Announcement
                    message="Annual Tech Fest 2026 registration is now open."
                    linkText="Apply"
                    linkHref="#"
                    onClose={() => setShowAnnouncement(false)}
                />
            )}

            <Hero />

            {/* Stats - Grid layout */}
            <section style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {stats.map((stat, idx) => (
                        <div key={idx} style={{
                            padding: '4rem 2rem',
                            borderRight: idx === stats.length - 1 ? 'none' : '1px solid var(--border-strong)',
                            borderBottom: '1px solid var(--border-strong)',
                            textAlign: 'center'
                        }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                            <h3 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: '800' }}>{stat.value}</h3>
                            <p style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--muted-fg)' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Events Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '2px solid var(--fg)', paddingBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Upcoming / <span style={{ color: 'var(--primary)' }}>Events</span></h2>
                        <button className="btn btn-outline">All Events</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {upcomingEvents.map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                style={{ border: '1px solid var(--border-strong)', background: 'white', overflow: 'hidden' }}
                            >
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                                        <span className="green-tag">{event.category}</span>
                                        <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>{event.date}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{event.title}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                                            <Clock size={16} /> {event.time}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                                            <MapPin size={16} /> {event.location}
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>View Details</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
