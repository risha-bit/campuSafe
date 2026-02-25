import React, { useEffect, useState } from "react";
import type { UserProfile } from "../types/user";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentEmail = localStorage.getItem("currentEmail") || undefined;
                const data = await userService.getProfile(currentEmail);
                if (!data.isProfileComplete) {
                    navigate("/complete-profile");
                    return;
                }
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">Loading Profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500 text-lg">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            {/* Top Navigation / Header Area if needed */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-800 hover:underline flex items-center gap-2"
                >
                    &larr; Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <div className="w-16"></div> {/* Spacer to center title */}
            </div>

            {/* Profile Card */}
            <div className="bg-white shadow-sm border border-gray-300 p-8 w-full max-w-2xl flex flex-col items-center">
                {/* Profile Photo */}
                <div className="w-58 h-58 rounded-full overflow-hidden border-4 border-blue-50 shadow-md mb-6">
                    <img
                        src={profile.profilePhoto || "https://via.placeholder.com/150"}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Main Info */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                <p className="text-gray-500 mb-6">{profile.email}</p>

                {/* Detailed Info Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">USN</p>
                        <p className="text-gray-800 font-medium">{profile.usn}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Branch</p>
                        <p className="text-gray-800 font-medium">{profile.branch}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Course</p>
                        <p className="text-gray-800 font-medium">{profile.course}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Year</p>
                        <p className="text-gray-800 font-medium">{profile.year}</p>
                    </div>
                </div>

                {/* Activity Stats */}

            </div>

            {/* Logout Button (Optional but useful in profile) */}
            <div className="w-full max-w-2xl mt-8 flex justify-center">
                <button
                    onClick={() => {
                        // Handle Logout logic 
                        navigate("/");
                    }}
                    className="px-6 py-3 bg-red-50 text-red-900 font-semibold rounded-lg hover:bg-red-100 transition"
                >
                    Logout from App
                </button>
            </div>

        </div>
    );
};

export default Profile;
