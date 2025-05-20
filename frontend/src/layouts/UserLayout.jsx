import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div> 
      <Sidebar/>
      <Outlet/>
    </div>
  )
}

export default UserLayout