import React, { useContext, useRef, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { AppContext } from '../context/appConext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputsRef = useRef([]);

  // Handle input and move focus
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Paste handler
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      paste.split('').forEach((char, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = char;
        }
      });
    }
  };

  // On email Submit
  const onEmailSubmit = async(e) => {
       e.preventDefault()

       try {
        const res = await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
        if(res.data.success){
          setIsEmailSent(true)
          toast.success(res.data.message)
        }else{
            toast.error(res.data.message)
        }
        
       } catch (error) {
           console.log(error.message)
       }
  }

  // onSubmit OTP
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputsRef.current.map(e =>e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)

  }

  // onSubmitNewPass

  const onSubmitNewPass = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})
      if(res.data.success){
            navigate('/')
           toast.success(res.data.message)
      }else{
      toast.error(res.data.message)
      }
    } catch (error) {
            toast.error(res.data.message)
            console.log(res.data.message,error.message)
    }

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e5151] to-[#decba4] text-white relative px-4">

      {/* Logo top-left */}
      <div className="absolute top-6 left-6">
        <img onClick={() => navigate('/')} src="/logo.webp" alt="Logo" className="w-12 h-12 rounded-full shadow-lg" />
      </div>
      {/* Centered Form */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-white/20">

          {/* Step 1: Enter Email */}
          {!isEmailSent && (
            <form onSubmit={onEmailSubmit}>
              <h1 className="text-3xl font-bold mb-4 text-white">Reset Password</h1>
              <p className="text-gray-200 mb-6">Enter your registered email address</p>

              <div className="relative mb-4">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 pl-10 pr-4 rounded-md bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEmailSent(true)} // simulate
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {isEmailSent && !isOtpSubmited && (
            <form onSubmit={onSubmitOtp}>
              <h1 className="text-3xl font-bold mb-4 text-white">Enter OTP</h1>
              <p className="text-gray-200 mb-6">Enter the 6-digit code sent to your email</p>

              <div className="flex justify-center gap-2 mb-6">
                {Array(6).fill(0).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-12 text-2xl text-center rounded-md bg-white text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsOtpSubmited(true)} // simulate
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 rounded-lg font-semibold transition duration-300"
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* Step 3: Enter New Password */}
          {isEmailSent && isOtpSubmited && (
            <form onSubmit={onSubmitNewPass}>
              <h1 className="text-3xl font-bold mb-4 text-white">Set New Password</h1>
              <p className="text-gray-200 mb-6">Choose a strong new password</p>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full py-2 px-4 rounded-md bg-white/90 text-gray-800 placeholder-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold transition duration-300"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
