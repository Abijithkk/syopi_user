import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Header2 from "./Header2";
import "./Layout.css";

const Layout = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add specific body classes for mobile/desktop layout management
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isSmallScreen) {
        document.body.classList.add('mobile-app-layout');
        document.body.classList.remove('desktop-app-layout');
      } else {
        document.body.classList.add('desktop-app-layout');
        document.body.classList.remove('mobile-app-layout');
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove('mobile-app-layout', 'desktop-app-layout');
      }
    };
  }, [isSmallScreen]);

  return (
    <div className="app-layout-wrapper">
      {isSmallScreen ? <Header2 /> : <Header />}
      <main className="main-outlet-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;