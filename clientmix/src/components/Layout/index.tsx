'use client';

import { ReactLenis } from '@studio-freight/react-lenis';


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    
    <ReactLenis root>
      <div>
        {children}
      </div>
    </ReactLenis>
    
  );
};

export default Layout;
