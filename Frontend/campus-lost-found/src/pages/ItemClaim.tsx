import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DummyItem } from './Dash';
import { itemService } from '../services/itemServ';

const ItemClaim: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<DummyItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        answer1: '',
        answer2: '',
        answer3: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });

    useEffect(() => {
        if (!id) return;
        itemService.getItemById(id).then(foundItem => {
            if (foundItem.status !== 'Posted') {
                navigate(`/item/${id}`);
            } else {
                setItem(foundItem);
            }
        }).catch(err => {
            console.error(err);
            navigate('/dashboard');
        });
    }, [id, navigate]);

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!item || !id) return;

        try {
            await itemService.claimItem(id, {
                claimantName: formData.contactName,
                claimantEmail: formData.contactEmail,
                claimantPhone: formData.contactPhone,
                claimAnswer1: formData.answer1,
                claimAnswer2: formData.answer2,
                claimAnswer3: formData.answer3,
            });
            console.log('Claim Submitted:', formData);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to claim item");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* Header & Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Item Details
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Claim Item Integration</h1>
                    <p className="text-gray-500 mt-2">
                        You are claiming: <strong className="text-gray-800">{item.name}</strong>
                    </p>
                </div>

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-6 md:p-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-bold text-yellow-800">Verification Required</h3>
                                <div className="mt-1 text-sm text-yellow-700">
                                    <p>
                                        To prove ownership, you must answer the secret questions set by the finder. Incorrect answers will result in a rejected claim.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Secret Questions */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">1. Proof of Ownership</h2>

                            {/* Question 1 */}
                            {item.secretQuestion1 && (
                                <div className="space-y-2">
                                    <label htmlFor="answer1" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Question 1: <span className="font-normal italic">"{item.secretQuestion1}"</span> <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="answer1"
                                        name="answer1"
                                        required
                                        placeholder="Your answer"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                        value={formData.answer1}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* Question 2 */}
                            {item.secretQuestion2 && (
                                <div className="space-y-2">
                                    <label htmlFor="answer2" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Question 2: <span className="font-normal italic">"{item.secretQuestion2}"</span> <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="answer2"
                                        name="answer2"
                                        required
                                        placeholder="Your answer"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                        value={formData.answer2}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* Question 3 */}
                            {item.secretQuestion3 && (
                                <div className="space-y-2">
                                    <label htmlFor="answer3" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Question 3: <span className="font-normal italic">"{item.secretQuestion3}"</span> <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="answer3"
                                        name="answer3"
                                        required
                                        placeholder="Your answer"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                        value={formData.answer3}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Section: Contact Details */}
                        <div className="space-y-5 pt-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">2. Your Contact Details</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                If your claim is approved, the administration or finder will contact you using these details.
                            </p>

                            <div>
                                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="contactName"
                                    name="contactName"
                                    required
                                    placeholder="e.g. John Doe"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    id="contactPhone"
                                    name="contactPhone"
                                    required
                                    placeholder="e.g. +1 234 567 8900"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-1">Student/College Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    required
                                    placeholder="e.g. student@college.edu"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all
                                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                                `}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Submit Proof & Claim Item'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItemClaim;
