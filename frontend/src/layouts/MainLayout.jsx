 import React from 'react'
import Header from '../components/header/Header'
import Landing from '../pages/landing'
import { Outlet } from 'react-router-dom'
import AnimatedFooter from '../components/footer/Footer'
 
 function MainLayout() {
   return (
     <div>
      <Header/>
       <Outlet/>
       <AnimatedFooter/>
     </div>
   )
 }
 
 export default MainLayout
 