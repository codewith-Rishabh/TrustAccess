import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/appConext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const EmailVerify = () => {
  const inputsRef = useRef([]);
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

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

  // Submit OTP
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map((input) => input.value).join('');
    try {
      const res = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });
      if (res.data.success) {
        toast.success(res.data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong while verifying");
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526] p-4">
      <form
        onSubmit={onSubmitHandler}
        onPaste={handlePaste}
        className="bg-[#2c3e50] p-8 rounded-xl shadow-xl w-full max-w-md text-center border border-white/10"
      >
        <h1 className="text-3xl font-bold mb-4 text-white">Email Verification</h1>
        <p className="text-gray-300 mb-6">Enter the 6-digit code sent to your email</p>

        <div className="flex justify-center gap-3 mb-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-2xl text-center rounded-lg bg-gray-200 text-gray-800 shadow-inner border border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-2 px-4 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
