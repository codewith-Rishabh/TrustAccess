import React, { useContext, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appConext';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Sign Up') {
        const res = await axios.post(`${backendUrl}/api/auth/signup`, { name, email, password });

        if (res.data.success) {
          setIsLoggedin(true);
          getUserData();
          toast.success(res.data.message);
          navigate('/');
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

        if (res.data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const toggleState = () => {
    setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        <div className='text-center mb-6'>
          <h2 className='text-3xl font-bold mb-2'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
          <p className='text-gray-400'>
            {state === 'Sign Up' ? 'Create your Account' : 'Login to your Account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {state === 'Sign Up' && (
            <div className='flex items-center bg-gray-700 p-3 rounded'>
              <FaUser className='text-gray-400 mr-2' />
              <input
                type='text'
                placeholder='Enter Your Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete='name'
                className='bg-transparent outline-none text-white w-full'
              />
            </div>
          )}

          <div className='flex items-center bg-gray-700 p-3 rounded'>
            <MdEmail className='text-gray-400 mr-2' />
            <input
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
              className='bg-transparent outline-none text-white w-full'
            />
          </div>

          <div className='flex items-center bg-gray-700 p-3 rounded'>
            <RiLockPasswordFill className='text-gray-400 mr-2' />
            <input
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={state === 'Sign Up' ? 'new-password' : 'current-password'}
              className='bg-transparent outline-none text-white w-full'
            />
          </div>

          <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold'>
            {state}
          </button>

          {state === 'Login' && (
            <p
              className='text-right text-sm text-blue-400 cursor-pointer hover:underline'
              onClick={() => navigate('/reset-password')}
            >
              Forget Password?
            </p>
          )}
        </form>

        <div className='mt-4 text-center text-sm'>
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span onClick={toggleState} className='text-blue-400 cursor-pointer hover:underline'>
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span onClick={toggleState} className='text-blue-400 cursor-pointer hover:underline'>
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
