import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./Layout.css";

const Layout = () => (
  <>
    <Header />
    <div className="content-container">
      <Outlet />
    </div>
  </>
);

export default Layout;