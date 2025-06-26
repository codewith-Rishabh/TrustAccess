// src/pages/Home.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appConext';
import Navbar from '../component/Navbar';

const Home = () => {
    const navigate = useNavigate();
    const { userData, isLoggedin } = useContext(AppContext);
    console.log(userData, "ho raha h");

    // Choose gradient based on auth status
    const backgroundClass = isLoggedin
        ? "bg-gradient-to-br from-[#071925] to-[#71857f]" // After login
        : "bg-gradient-to-br from-blue-900 via-gray-900 to-black"; // Default

    return (
        <div>
            <Navbar />
            <div className={`min-h-screen flex items-center justify-center ${backgroundClass} text-white p-6 transition-all duration-500`}>
                <div className="text-center max-w-lg">
                    <img
                        src="/robot.webp"
                        alt="Robot"
                        className="w-36 h-36 mx-auto rounded-full mb-6 shadow-lg border-4 border-white"
                    />
                    <h1 className="text-4xl font-extrabold mb-4 animate-bounce">
                        Hey {userData?.name || 'Developer'} ...✌️
                    </h1>
                    <h2 className="text-2xl font-semibold mb-2">Welcome to Our App</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Let’s start a quick product tour, and we’ll have you up and running in no time. <br />
                        <span className="text-blue-400 font-semibold">
                            We’re here to make your journey easier and more fun!
                        </span>
                    </p>

                    {!isLoggedin && (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
                        >
                            Get Started 🚀
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
