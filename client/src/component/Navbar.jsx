import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiChevronDown, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { AppContext } from '../context/appConext';
import { toast } from 'react-toastify';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Logout API call
  const logout = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/auth/logout');
      if (res.data.success) {
        setIsLoggedin(false);
        setUserData('');
        toast.success('Logout successful');
      } else {
        setIsLoggedin(true);
      }
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  // verify email function
  const sendVerificationOtp = async () => {
      try {
            
        const res = await axios.post(backendUrl+'/api/auth/send-verify-otp')
        if(res.data.success){
            navigate('/email-verify')
            toast.success(res.data.message)
        }else{
             toast.error(res.data.message)
        }
        
      } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      }
  }

  return (
    <nav className="bg-gradient-to-r from-[#A7C7E7] via-[#E6E6FA] to-[#FFDAB9] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.webp" alt="Logo" className="w-12 h-12 rounded-full mr-3 shadow-sm" />
          <h1 className="text-gray-800 text-2xl font-bold tracking-wide">Rishabh Auth</h1>
        </div>

        {/* Login / User Dropdown */}
        {userData ? (
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold cursor-pointer shadow-md hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800">
                {!userData.isAccountVerified && (
                  <div
                    onClick={sendVerificationOtp}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <FiCheckCircle className="mr-2" />
                    Verify Account
                  </div>
                )}

                <div
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300 font-medium shadow-sm"
          >
            Login
            <FiArrowRight className="ml-2 text-lg" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
 