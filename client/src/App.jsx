import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import ResetPassword from './pages/ResetPassWord';
import { ToastContainer} from 'react-toastify';
import EmailVerify from './pages/EmailVerify';



function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black color-white text-xl flex flex-col">
     <Routes>
       <Route path = '/' element={<Home/>}/>
       <Route path = '/login' element={<Login/>}/>
       <Route path = '/reset-password' element={<ResetPassword/>}/>
       <Route path = '/email-verify' element={<EmailVerify/>}/>
     </Routes>
    <ToastContainer/>
  </div>
  )
}

export default App
