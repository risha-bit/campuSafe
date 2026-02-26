import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Nav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const lastScrollY = React.useRef(0);

    // Add subtle glassmorphism effect and hide/show logic when scrolling
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Directional Hide/Show Logic
            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                // Scrolling down the page
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                // Scrolling up the page
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper for generating active vs inactive styles for NavLinks
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
        return `relative px-4 py-2 font-semibold text-sm rounded-full transition-all duration-300 ease-in-out flex items-center gap-2 group
        ${isActive
                ? 'text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
            }`;
    };

    // Hide navigation entirely on specific auth-oriented pages (like Login and CompleteProfile)
    if (location.pathname === '/' || location.pathname === '/complete-profile') {
        return null;
    }

    return (
        <React.Fragment>
            {/* Elegant Floating Navigation Bar */}
            <nav className={`fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 sm:px-6 transition-all duration-300 ease-in-out ${mobileMenuOpen
                    ? 'opacity-0 scale-95 pointer-events-none'
                    : isVisible
                        ? 'translate-y-0 opacity-100 scale-100'
                        : '-translate-y-24 opacity-0 pointer-events-none'
                }`}>
                <div
                    className={`relative mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3
                    ${isScrolled
                            ? 'bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50'
                            : 'bg-white/95 shadow-sm border border-gray-100'
                        }`}
                >
                    {/* Brand Logo & Name */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            CampuSafe
                        </span>
                    </div>

                    {/* Desktop Navigation Links (Center) */}
                    <div className="hidden md:flex items-center justify-center gap-2">
                        <NavLink to="/dashboard" className={getNavLinkClass}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </NavLink>
                        <NavLink to="/my-posts" className={getNavLinkClass}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            My Posts
                        </NavLink>
                        {/* 
                            We can add MyClaims here if implemented in the future
                            <NavLink to="/my-claims" className={getNavLinkClass}>My Claims</NavLink>
                        */}
                    </div>

                    {/* Desktop CTA & Profile (Right) */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/post-item')}
                            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Report Item
                        </button>

                        <button
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-100 transition-colors bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden"
                            title="Profile"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Premium Full-Screen Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] backdrop-blur-lg bg-white/95 transition-all duration-300 md:hidden flex flex-col items-center justify-center
                ${mobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}
            `}>
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-6 right-6 p-3 bg-white shadow-sm rounded-full text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200 transition-all"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col items-center justify-center gap-8 w-full px-8">
                    <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
                        CampuSafe
                    </span>

                    <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                        className={`text-2xl font-bold transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/my-posts'); }}
                        className={`text-2xl font-bold transition-colors ${location.pathname === '/my-posts' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        My Posts
                    </button>
                    <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                        className={`text-2xl font-bold transition-colors ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Profile Settings
                    </button>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

                    <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/post-item'); }}
                        className="w-full max-w-xs bg-gray-900 text-white py-4 rounded-full text-lg font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Report a Found Item
                    </button>
                </div>
            </div>

            {/* Spacer to prevent content from hiding behind the fixed floating nav */}
            <div className="h-24 md:h-28 bg-gray-50 invisible"></div>
        </React.Fragment>
    );
};

export default Nav;
