import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="Layout">
      <div className="Header">趣水園</div>
      <div className="Main">{children}</div>
      <div className="Footer">Created by Hedrall</div>
    </div>
  );
};
