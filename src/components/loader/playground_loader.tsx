import React from 'react';
import './playground_loader.css';

const Loader = () => {
  return (
    <div className="playground-loader-container">
      <div className="loader-con">
        <div style={{ '--i': 0 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 1 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 2 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 3 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 4 } as React.CSSProperties} className="pfile" />
        <div style={{ '--i': 5 } as React.CSSProperties} className="pfile" />
      </div>
    </div>
  );
}

export default Loader;
