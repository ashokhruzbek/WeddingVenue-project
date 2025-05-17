import React from 'react'
import Sidebar from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
     <div className="flex">
      <Sidebar paths={['/','view-all-course','my-course']} panelName={'user'}/>
      <main className="flex-1 sm:ml-64">
        <Outlet />
      </main>
      </div>
  )
}

export default UserLayout
