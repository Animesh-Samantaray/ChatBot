import React, { useState } from 'react'
import {  Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import { assets } from './assets/assets'
import './assets/prism.css';
import Loading from './components/Loading'
import Login from './pages/Login'
import Signup from './pages/Signup'
const App = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  const {pathname} = useLocation();
  
  return (
    <>
    {
      !isMenuOpen && <img src={assets.menu_icon} alt="" className='absolute top-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={()=>{
        setIsMenuOpen(true)
      }} />
    }
    <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:texxt-white'>
        <div className='flex h-screen w-screen'>
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      <Routes>
      <Route path='/'  element={<ChatBox/>}/>
      <Route path='/crdits'  element={<Credits/>}/> 
      <Route path='/loading'  element={<Loading/>}/>
      <Route path='/login'  element={<Login/>}/>
      <Route path='/signup'  element={<Signup/>}/>
      </Routes>
    </div>
    </div>
    </>
  )
}

export default App
