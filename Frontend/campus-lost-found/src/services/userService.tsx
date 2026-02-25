import type { UserProfile } from "../types/user";

// Mock data and service for user profile
let mockUser: UserProfile = {
    id: "1",
    email: "24g64.minora@sjec.ac.in",
    name: "Minora Risha Dias",
    usn: "4SO24CS130",
    branch: "Computer Science Engineering",
    course: "CSE",
    year: 2,
    profilePhoto: "https://via.placeholder.com/150",
    postsCount: 5,
    claimsCount: 2,
    isProfileComplete: false, // Forces all users to complete ID scan check on first load
};

export const userService = {
    getProfile: async (email?: string): Promise<UserProfile> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && email !== mockUser.email) {
                    reject(new Error("User not found"));
                } else {
                    resolve(mockUser);
                }
            }, 500); // simulate network delay
        });
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockUser = { ...mockUser, ...data, isProfileComplete: true };
                resolve(mockUser);
            }, 1000);
        });
    }
};
