import type { UserProfile } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const userService = {
    getProfile: async (email?: string): Promise<UserProfile> => {
        if (!email) throw new Error("Email is required");
        try {
            const response = await fetch(`${API_URL}/users/${encodeURIComponent(email)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }
            const data = await response.json();
            // Map MongoDB _id to id if missing
            if (data._id && !data.id) {
                data.id = data._id.toString();
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        if (!data.email) throw new Error("Email is required for update");
        try {
            const response = await fetch(`${API_URL}/users/${encodeURIComponent(data.email)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
            const updatedData = await response.json();
            if (updatedData._id && !updatedData.id) {
                updatedData.id = updatedData._id.toString();
            }
            return updatedData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
