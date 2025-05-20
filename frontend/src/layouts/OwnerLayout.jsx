import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function OwnerLayout() {
  return <div> 
    <Sidebar/>
    <Outlet/>
  </div>;
}

export default OwnerLayout;
