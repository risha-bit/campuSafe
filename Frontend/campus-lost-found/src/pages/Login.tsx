import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = (): void => {
        if (!email.endsWith("@sjec.ac.in")) {
            setError("Invalid  Email");
            return;
        }
        //Fake token for now 
        localStorage.setItem("Token:", "fake-token");
        //clear error
        setError("");
        //Redirect
        navigate("/Dash");
    };
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
            {/* Background Image */}
            <img
                src="/sjec.jpg"
                alt="SJEC Campus"
                className="absolute inset-0 w-full h-full object-contain object-center -z-10"
            />

            {/* Overlay for background effects */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

            {/* Login Card */}
            <div className="relative z-10 p-6 sm:p-8 w-full max-w-sm rounded-2xl shadow-lg border  border-white/50  ">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-base">
                    SJEC Login
                </h2>

                <input
                    type="email"
                    placeholder="Enter your SJEC email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                    className="w-full p-3 sm:p-4 border border-white rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-blue-500 focus:ring-1"
                />

                <button
                    onClick={handleLogin}
                    className="w-full  text-white p-3 sm:p-4 rounded-lg text-sm sm:text-base font-semibold bg-blue-700 transition hover:bg-white hover:text-black"
                >
                    Login
                </button>

                {error && (
                    <p className="text-red-900 text-sm mt-3 text-center">
                        {error}
                    </p>
                )}
            </div>
        </div>

    );
};

export default Login;