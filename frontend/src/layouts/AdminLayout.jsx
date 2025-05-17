 import React from 'react'
 import Sidebar  from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'

 function AdminLayout() {
   return (
     <div className="flex justify-center">
      <Sidebar paths={['/', ]} panelName={'admin'}/>
      <main className="flex-1 sm:ml-64">
        <Outlet />
      </main>
    </div>
   )
 }
 
 export default AdminLayout
 