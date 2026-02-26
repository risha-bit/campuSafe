import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DummyItem } from './Dash';
import { itemService } from '../services/itemServ';

const MyPost: React.FC = () => {
    const navigate = useNavigate();
    const [myItems, setMyItems] = useState<DummyItem[]>([]);

    useEffect(() => {
        const fetchMyItems = async () => {
            try {
                const currentEmail = localStorage.getItem("currentEmail");
                const allItems = await itemService.getItems();
                const userItems = allItems.filter((i: any) => i.postedBy === currentEmail);
                setMyItems(userItems.length > 0 ? userItems : allItems); // Fallback to all items for demonstration if user hasn't posted
            } catch (error) {
                console.error("Failed to fetch my posts", error);
            }
        };
        fetchMyItems();
    }, []);

    const handleAction = async (id: string, newStatus: DummyItem['status']) => {
        try {
            let pickupCode = undefined;
            let pickupLocation = undefined;

            if (newStatus === 'READY_FOR_PICKUP') {
                const locationInput = window.prompt("Where should the student pick up this item? (e.g., 'Security Office', 'Library Desk', 'Admin Block')", "Security Office");
                if (locationInput === null) return; // User cancelled the prompt, abort action

                pickupLocation = locationInput || "Security Office";
                // Generate a fake 6-digit pickup code
                pickupCode = Math.floor(100000 + Math.random() * 900000).toString();
            }

            const updatedItem = await itemService.updateItemStatus(id, { status: newStatus, pickupCode, pickupLocation });

            setMyItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating claim status");
        }
    };

    const getStatusBadge = (status: DummyItem['status']) => {
        switch (status) {
            case 'Posted': return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">Ready for Claim</span>;
            case 'Claim Pending': return <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">Action Required</span>;
            case 'Approved': return <span className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold">Claim Approved</span>;
            case 'READY_FOR_PICKUP': return <span className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold">Ready for Pickup</span>;
            case 'Completed': return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold">Completed</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage My Posts</h1>
                        <p className="text-gray-500 mt-2">Approve or reject claims for the items you have found.</p>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-6">
                    {myItems.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500">You haven't posted any items yet.</p>
                        </div>
                    ) : (
                        myItems.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                    {/* Left: Item Info */}
                                    <div className="w-full md:w-1/3 flex flex-col">
                                        <div className="mb-3">
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h2>
                                        <p className="text-sm text-gray-500 mb-1">Found at: <span className="font-medium text-gray-800">{item.location}</span></p>
                                        <p className="text-sm text-gray-500">Date: <span className="font-medium text-gray-800">{item.date}</span></p>

                                        <div className="mt-auto pt-6">
                                            <button
                                                onClick={() => navigate(`/item/${item.id}`)}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                View Public Details →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Claim Details */}
                                    <div className="w-full md:w-2/3 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        {item.status === 'Claim Pending' ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-10v6h2V7h-2z" />
                                                        </svg>
                                                        Review Claim Request
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Claimant Name</span>
                                                        <span className="block text-sm font-semibold text-gray-900">{item.claimantName || 'Anonymous'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Claimant Contact</span>
                                                        <span className="block text-sm font-semibold text-gray-900">{item.claimantEmail || item.claimantPhone || 'Not provided'}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-3">
                                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted Answers</span>

                                                    {item.secretQuestion1 && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-1">Q: {item.secretQuestion1}</p>
                                                            <p className="text-sm font-semibold text-gray-800">A: {item.claimAnswer1 || <span className="text-red-400 italic">No answer provided</span>}</p>
                                                        </div>
                                                    )}
                                                    {item.secretQuestion2 && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-1">Q: {item.secretQuestion2}</p>
                                                            <p className="text-sm font-semibold text-gray-800">A: {item.claimAnswer2 || <span className="text-red-400 italic">No answer provided</span>}</p>
                                                        </div>
                                                    )}
                                                    {item.secretQuestion3 && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-1">Q: {item.secretQuestion3}</p>
                                                            <p className="text-sm font-semibold text-gray-800">A: {item.claimAnswer3 || <span className="text-red-400 italic">No answer provided</span>}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 pt-3 mt-4 border-t border-gray-200">
                                                    <button
                                                        onClick={() => handleAction(item.id, 'READY_FOR_PICKUP')}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm shadow-sm"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve Claim
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'Posted')}
                                                        className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm shadow-sm"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ) : item.status === 'READY_FOR_PICKUP' ? (
                                            <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-green-50/50 rounded-xl border border-green-100">
                                                <div className="bg-green-100 p-3 rounded-full mb-3">
                                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">Claim Approved</h3>
                                                <p className="text-sm text-gray-600">You have verified the owner. Instruct them to pickup the item at the Security Office.</p>
                                                <div className="mt-4 p-3 bg-white w-full rounded-lg border border-green-200/60 shadow-sm text-left">
                                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Approved Owner</p>
                                                    <p className="text-sm font-semibold text-gray-800 mb-2">{item.claimantName} ({item.claimantEmail})</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 border-t border-gray-100 pt-2">Generated Pickup Code</p>
                                                    <p className="text-xl tracking-widest font-black text-gray-900">{item.pickupCode}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col justify-center items-center text-center p-6">
                                                <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Claims</h3>
                                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">No one has attempted to claim this item yet. You will see review options here once a claim is submitted.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPost;
