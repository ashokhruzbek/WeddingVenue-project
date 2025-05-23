import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function OwnerLayout() {
  return  (
     <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default OwnerLayout;
