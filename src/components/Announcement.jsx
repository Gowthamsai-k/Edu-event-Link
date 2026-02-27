import React from 'react';
import { Megaphone, X } from 'lucide-react';

const Announcement = ({ message, linkText, linkHref, onClose }) => {
  return (
    <div style={{
      background: 'var(--primary)',
      borderBottom: '1px solid var(--border-strong)',
      color: 'white'
    }}>
      <div className="container" style={{ padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
          <Megaphone size={16} style={{ flexShrink: 0 }} />
          <span>{message}</span>
          {linkText && (
            <a href={linkHref} style={{ textDecoration: 'underline', color: 'white', fontWeight: '700' }}>
              {linkText}
            </a>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '2rem',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.25rem'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Announcement;
