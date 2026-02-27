import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemServ';

const PostItem: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        customCategory: '',
        location: '',
        dateFound: '',
        secretQuestion1: '',
        secretAnswer1: '',
        secretQuestion2: '',
        secretAnswer2: '',
        secretQuestion3: '',
        secretAnswer3: '',
    });

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const currentEmail = localStorage.getItem("currentEmail") || "";

        // Create new item metadata
        const newItem = {
            name: formData.title,
            location: formData.location,
            category: formData.category === 'Other' ? formData.customCategory : formData.category,
            description: formData.description,
            date: new Date(formData.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            secretQuestion1: formData.secretQuestion1,
            secretAnswer1: formData.secretAnswer1,
            secretQuestion2: formData.secretQuestion2,
            secretAnswer2: formData.secretAnswer2,
            secretQuestion3: formData.secretQuestion3,
            secretAnswer3: formData.secretAnswer3,
            postedBy: currentEmail
        };

        try {
            await itemService.createItem(newItem);
            console.log('API Form Submitted:', formData);
            navigate('/dashboard'); // Go back to dashboard after submitting
        } catch (error) {
            console.error(error);
            alert("Failed to submit item");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Report a Found Item</h1>
                    <p className="text-gray-500 mt-2">Help someone recover what they lost by providing accurate details.</p>
                </div>

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Section: Basic Details */}
                        <div className="space-y-5">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">1. Basic Details</h2>

                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Item Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    placeholder="e.g. Blue Hydroflask Water Bottle"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select category...</option>
                                        <option value="Wallet">Wallet</option>
                                        <option value="ID Card">ID Card</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    {formData.category === 'Other' && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                id="customCategory"
                                                name="customCategory"
                                                required
                                                placeholder="Please specify..."
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                                value={formData.customCategory}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="dateFound" className="block text-sm font-semibold text-gray-700 mb-1">Found Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        id="dateFound"
                                        name="dateFound"
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                        value={formData.dateFound}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Found Location <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    placeholder="e.g. Library 2nd Floor, Main Gate, etc."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={3}
                                    placeholder="Describe where and how you found the item. Do NOT vomit identifying characteristics of the item itself!"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm resize-y"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Section: Verification Context */}
                        <div className="space-y-5 pt-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">2. Claim Verification</h2>
                            <p className="text-sm text-gray-500">
                                To ensure the item goes to its rightful owner, set three secret questions that only the owner would know the answers to.
                                <span className="block mt-1 font-medium text-blue-600">Do not reveal this information in the public description above or the uploaded image.</span>
                            </p>

                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex flex-col gap-6">
                                {/* Question 1 */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-blue-800 text-xs uppercase tracking-wider mb-2">Question 1</h3>
                                    <div>
                                        <input
                                            type="text"
                                            name="secretQuestion1"
                                            required
                                            placeholder="e.g. What is the color of the phone case?"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm mb-2"
                                            value={formData.secretQuestion1}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="secretAnswer1"
                                            required
                                            placeholder="Expected Answer 1"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                            value={formData.secretAnswer1}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-blue-800 text-xs uppercase tracking-wider mb-2">Question 2</h3>
                                    <div>
                                        <input
                                            type="text"
                                            name="secretQuestion2"
                                            required
                                            placeholder="e.g. What was inside the main pocket?"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm mb-2"
                                            value={formData.secretQuestion2}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="secretAnswer2"
                                            required
                                            placeholder="Expected Answer 2"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                            value={formData.secretAnswer2}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-blue-800 text-xs uppercase tracking-wider mb-2">Question 3</h3>
                                    <div>
                                        <input
                                            type="text"
                                            name="secretQuestion3"
                                            required
                                            placeholder="e.g. Any distinctive scratches or marks?"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm mb-2"
                                            value={formData.secretQuestion3}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="secretAnswer3"
                                            required
                                            placeholder="Expected Answer 3"
                                            className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                            value={formData.secretAnswer3}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
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
                                    'Submit Found Item Report'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostItem;