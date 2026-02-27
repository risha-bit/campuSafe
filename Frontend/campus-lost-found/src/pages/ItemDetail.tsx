import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DummyItem, FilterStatus } from './Dash';
import { itemService } from '../services/itemServ';

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<DummyItem | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isProcessingClaim, setIsProcessingClaim] = useState(false);
    const [customPickupLocation, setCustomPickupLocation] = useState("");

    const handleAccept = async () => {
        if (!item) return;
        if (!customPickupLocation.trim()) {
            alert("Please specify a meeting point before accepting the claim.");
            return;
        }
        setIsProcessingClaim(true);
        try {
            const code = "PC-" + Math.floor(1000 + Math.random() * 9000);
            await itemService.updateItemStatus(item.id, {
                status: "READY_FOR_PICKUP",
                pickupCode: code,
                pickupLocation: customPickupLocation.trim()
            });
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Failed to accept");
        } finally {
            setIsProcessingClaim(false);
        }
    };

    const handleReject = async () => {
        if (!item) return;
        setIsProcessingClaim(true);
        try {
            await itemService.updateItemStatus(item.id, { status: "Posted" });
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Failed to reject");
        } finally {
            setIsProcessingClaim(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        itemService.getItemById(id)
            .then(foundItem => setItem(foundItem))
            .catch(error => console.error("Item not found", error));
    }, [id]);

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Not Found</h2>
                    <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status: FilterStatus) => {
        switch (status) {
            case 'Posted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Claim Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'READY_FOR_PICKUP': return 'bg-green-100 text-green-800 border-green-200';
            case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderStatusIndicator = (status: FilterStatus) => {
        const dotColors: Record<FilterStatus, string> = {
            'All': '',
            'Posted': 'bg-blue-500',
            'Claim Pending': 'bg-yellow-500',
            'Approved': 'bg-green-500',
            'READY_FOR_PICKUP': 'bg-green-500',
            'Completed': 'bg-gray-500',
        };
        return <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${dotColors[status]}`}></span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Placeholder */}
                        <div className="w-full md:w-1/2 flex-shrink-0">
                            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 relative group cursor-pointer" onClick={() => {
                                if (item.image) {
                                    setIsImageModalOpen(true);
                                }
                            }}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <img
                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=e2e8f0`}
                                        alt={item.name}
                                        className="object-scale-down w-[80%] h-[80%] opacity-90 transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}
                                {item.image && (
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 font-bold bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm transition-opacity">Click to view full image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Item Details */}
                        <div className="w-full md:w-1/2 flex flex-col justify-start">
                            <div className="mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(item.status)}`}>
                                    {renderStatusIndicator(item.status)}
                                    {item.status.toUpperCase()}
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{item.name}</h1>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Found Location</p>
                                        <p className="font-medium text-gray-800">{item.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Found Date</p>
                                        <p className="font-medium text-gray-800">{item.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Posted By</p>
                                        <p className="font-medium text-gray-800 break-all">{item.postedBy || 'Anonymous Campus User'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Description</h3>
                                <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 whitespace-pre-wrap">
                                    {item.description || `A ${item.name} was found at ${item.location} on ${item.date}. Detailed condition and specific attributes have been documented by the finder, but are hidden from the public to verify the actual owner. If this item belongs to you, please begin the verification process below.`}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                {item.postedBy === localStorage.getItem("currentEmail") ? (
                                    item.status === 'Claim Pending' ? (
                                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                                            <h3 className="text-lg font-bold text-yellow-800 mb-2">Claim Request Received!</h3>
                                            <p className="text-sm text-yellow-700 mb-3 font-medium">
                                                Review the claimant's answers and their optional uploaded picture (shown on the left).
                                            </p>
                                            <div className="space-y-3 mb-4 text-sm text-yellow-900 bg-yellow-100/50 p-4 rounded-lg">
                                                <p><strong>Claimant:</strong> {item.claimantName}</p>
                                                <p><strong>Contact:</strong> {item.claimantEmail} / {item.claimantPhone}</p>
                                                <div className="mt-2 border-t border-yellow-200 pt-2">
                                                    {item.secretQuestion1 && <p><strong>Q:</strong> {item.secretQuestion1} <br /><span className="text-gray-700 font-medium whitespace-pre-wrap">A: {item.claimAnswer1}</span></p>}
                                                    {item.secretQuestion2 && <p className="mt-1"><strong>Q:</strong> {item.secretQuestion2} <br /><span className="text-gray-700 font-medium whitespace-pre-wrap">A: {item.claimAnswer2}</span></p>}
                                                    {item.secretQuestion3 && <p className="mt-1"><strong>Q:</strong> {item.secretQuestion3} <br /><span className="text-gray-700 font-medium whitespace-pre-wrap">A: {item.claimAnswer3}</span></p>}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="pickupLocation" className="block text-sm font-bold text-yellow-900 mb-1">Where should they meet you to get it back?</label>
                                                <input
                                                    type="text"
                                                    id="pickupLocation"
                                                    value={customPickupLocation}
                                                    onChange={(e) => setCustomPickupLocation(e.target.value)}
                                                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white placeholder-gray-400 font-medium text-sm"
                                                    placeholder="e.g. Near Library, Security Office, CA Dept."
                                                />
                                                <p className="text-xs text-yellow-700 mt-1">They will be instructed to find you here and tell you their secret Pickup Code.</p>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button disabled={isProcessingClaim || !customPickupLocation.trim()} onClick={handleAccept} className={`flex-1 text-white font-bold py-3 rounded-lg transition-colors shadow-sm ${(isProcessingClaim || !customPickupLocation.trim()) ? 'bg-green-400 cursor-not-allowed opacity-70' : 'bg-green-600 hover:bg-green-700'}`}>Accept & Share Location</button>
                                                <button disabled={isProcessingClaim} onClick={handleReject} className={`flex-1 text-white font-bold py-3 rounded-lg transition-colors shadow-sm ${isProcessingClaim ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>Reject Claim</button>
                                            </div>
                                        </div>
                                    ) : item.status === 'READY_FOR_PICKUP' ? (
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                            <h3 className="text-xl font-bold text-green-800 mb-3">Steps to Return Item</h3>
                                            <ol className="list-decimal list-inside space-y-2 text-sm text-green-900 mb-4 bg-green-100/50 p-4 rounded-lg font-medium">
                                                <li>Take the item to the location you specified: <strong className="text-green-800">{item.pickupLocation}</strong>.</li>
                                                <li>Wait for the claimant: <strong className="text-green-800">{item.claimantName}</strong>.</li>
                                                <li>Ask them for their 4-digit generated Pickup Code.</li>
                                                <li>Verify it matches the code shown below!</li>
                                            </ol>
                                            <div className="flex flex-col items-center justify-center bg-white py-3 px-4 rounded-lg shadow-sm w-full max-w-xs mx-auto mb-3 border border-green-100">
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Verify Their Code</span>
                                                <span className="text-4xl tracking-widest font-black text-gray-900">{item.pickupCode}</span>
                                            </div>
                                            <p className="text-xs text-green-700 font-bold uppercase text-center mt-2 border-t border-green-200 pt-3">Thank you for keeping our campus safe!</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                                            <h3 className="text-sm font-bold text-gray-800">You reported this item</h3>
                                            <p className="text-gray-600 text-xs mt-1">Status: {item.status}. You cannot claim your own reported item.</p>
                                        </div>
                                    )
                                ) : item.status === 'Posted' ? (
                                    <button
                                        onClick={() => navigate(`/claim-item/${item.id}`)}
                                        className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Claim This Item
                                    </button>
                                ) : item.status === 'READY_FOR_PICKUP' ? (
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
                                        <h3 className="text-xl font-bold text-green-800 mb-2">Ready to Get It Back!</h3>
                                        <p className="text-green-700 mb-4 font-medium text-sm">Your claim was approved. Go to the location below and present your code.</p>
                                        <div className="flex flex-col items-center justify-center bg-white py-3 px-4 rounded-lg shadow-sm w-full max-w-xs mx-auto mb-3 border border-green-100">
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Your Pickup Code</span>
                                            <span className="text-4xl tracking-widest font-black text-gray-900">{item.pickupCode}</span>
                                        </div>
                                        <p className="text-sm text-green-800 font-bold px-4 py-2 border border-green-200 bg-green-100/50 rounded-lg inline-block">Meeting Point: {item.pickupLocation}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        This item is currently '{item.status}' and cannot be claimed.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Modal */}
            {isImageModalOpen && item.image && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
                    />
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
