import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemServ';

export type FilterStatus = 'All' | 'Posted' | 'Claim Pending' | 'Approved' | 'READY_FOR_PICKUP' | 'Completed';

export interface DummyItem {
    id: string;
    name: string;
    location: string;
    status: FilterStatus;
    date: string;
    secretQuestion1?: string;
    secretAnswer1?: string;
    secretQuestion2?: string;
    secretAnswer2?: string;
    secretQuestion3?: string;
    secretAnswer3?: string;
    claimantName?: string;
    claimantEmail?: string;
    claimantPhone?: string;
    claimAnswer1?: string;
    claimAnswer2?: string;
    claimAnswer3?: string;
    pickupCode?: string;
    pickupLocation?: string;
    postedBy?: string;
    image?: string;
}

const Dash: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [items, setItems] = useState<DummyItem[]>([]);

    useEffect(() => {
        itemService.getItems()
            .then((data: DummyItem[]) => setItems(data))
            .catch((error: Error) => console.error("Error fetching items:", error));
    }, []);
    const navigate = useNavigate();

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Apply status filter
            const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;

            // Apply search query filter (by name or location)
            const query = searchQuery.toLowerCase();
            const matchesSearch = (item.name || '').toLowerCase().includes(query) ||
                (item.location || '').toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery, items]);

    const getStatusStyles = (status: FilterStatus) => {
        switch (status) {
            case 'Posted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Claim Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper to render a little status dot
    const renderStatusIndicator = (status: FilterStatus) => {
        const dotColors: Record<string, string> = {
            'All': '',
            'Posted': 'bg-blue-500',
            'Claim Pending': 'bg-yellow-500',
            'Approved': 'bg-green-500',
            'READY_FOR_PICKUP': 'bg-green-500',
            'Completed': 'bg-gray-500',
        };
        return <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${dotColors[status]}`}></span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Header Panel */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-6 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full pb-2">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campus Overview</h1>
                        <p className="text-sm border-b border-transparent sm:text-base text-gray-500 mt-1">Track and manage all community recovered items at SJEC.</p>
                    </div>

                    {/* Search and Filter System */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, item or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                        <div className="relative w-full sm:w-auto">
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                                className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium cursor-pointer transition-all sm:text-sm min-w-[160px]"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Posted">Posted</option>
                                <option value="Claim Pending">Claim Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="READY_FOR_PICKUP">Ready for Pickup</option> {/* Added this option */}
                                <option value="Completed">Completed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    {/* Total Items */}
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors pointer-events-none"></div>
                        <div className="bg-blue-100 text-blue-600 p-3.5 rounded-xl mr-5 relative z-10 shadow-inner">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Found Items</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{items.length}</h3>
                        </div>
                    </div>

                    {/* Active Claims */}
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full blur-2xl group-hover:bg-yellow-100 transition-colors pointer-events-none"></div>
                        <div className="bg-yellow-100 text-yellow-600 p-3.5 rounded-xl mr-5 relative z-10 shadow-inner">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Claims</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                {items.filter(i => i.status === 'Claim Pending').length}
                            </h3>
                        </div>
                    </div>

                    {/* Approved Recoveries */}
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-colors pointer-events-none"></div>
                        <div className="bg-green-100 text-green-600 p-3.5 rounded-xl mr-5 relative z-10 shadow-inner">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Successful Returns</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                {items.filter(i => i.status === 'Approved' || i.status === 'READY_FOR_PICKUP' || i.status === 'Completed').length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 sm:px-6 lg:px-8">
                {/* Informational Header */}
                <div className="mb-6 flex justify-between items-end">
                    <h2 className="text-lg font-semibold text-gray-700">Recent Activity</h2>
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                        {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                    </span>
                </div>

                {/* Items List */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/item/${item.id}`)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1" title={item.name}>
                                        {item.name}
                                    </h3>
                                    <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${getStatusStyles(item.status)}`}>
                                        {renderStatusIndicator(item.status)}
                                        {item.status}
                                    </span>
                                </div>
                                <div className="space-y-2 mt-4 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-2">{item.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State based on Filter Context */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-20 px-6">
                        <div className="bg-blue-50/50 p-5 rounded-full mb-5 shadow-inner border border-blue-100/50">
                            {statusFilter === 'All' && !searchQuery ? (
                                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>

                        <p className="text-xl font-bold text-gray-900 mb-2">
                            {statusFilter === 'All' && !searchQuery
                                ? "No items reported yet."
                                : "No matching items found."}
                        </p>

                        <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
                            {statusFilter === 'All' && !searchQuery
                                ? "Your community needs you. Be the first to help someone recover their belongings today."
                                : `We couldn't find anything matching "${searchQuery}" in the status "${statusFilter}". Try adjusting your filters.`}
                        </p>

                        {(searchQuery || statusFilter !== 'All') && (
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                                className="mt-8 px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear all filters
                            </button>
                        )}

                        {statusFilter === 'All' && !searchQuery && (
                            <button
                                onClick={() => navigate('/post-item')}
                                className="mt-8 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Report a Found Item
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dash;
