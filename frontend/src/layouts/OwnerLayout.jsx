import React from 'react'

import Sidebar  from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'
function OwnerLayout() {
  return (
   <div className="flex">
      <Sidebar paths={['/','view-all-course','my-course']} panelName={'student'}/>
      <main className="flex-1 sm:ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default OwnerLayout
