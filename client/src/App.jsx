import React from 'react'
import { Outlet } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import './App.css'


const App = () => {
  return (
    <>
      <Toaster /> 
      <div className=''>
        <Outlet />

      </div>
    </>
  )
}

export default App