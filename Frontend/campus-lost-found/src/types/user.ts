export interface UserProfile {
    id: string;
    email: string;
    name: string;
    usn: string;
    branch: string;
    course: string;
    year: number;
    profilePhoto: string;
    postsCount: number;
    claimsCount: number;
    isProfileComplete: boolean;
}
