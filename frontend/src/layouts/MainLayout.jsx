import React from 'react'
import Header from '../components/header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
 
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-grow pt-20">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
 
export default MainLayout
 