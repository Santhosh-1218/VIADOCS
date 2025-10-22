import React from 'react';

const PageLoader = ({ visible }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.6)',
        zIndex: 9999,
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        border: '4px solid rgba(63,81,181,0.2)',
        borderTop: '4px solid #3F51B5',
        animation: 'spin 0.6s linear infinite'
      }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default PageLoader;
