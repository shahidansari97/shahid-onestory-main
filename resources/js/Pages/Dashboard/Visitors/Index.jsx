import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from '@/Components/Dashboard/Wrapper.jsx';
import { HiUserGroup, HiUserAdd, HiUsers } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import '../../../../css/visitor.css'

const convertGMTToLocalTime = (gmtDateTime) => {
    if (!gmtDateTime) return '-';
    // If the timestamp doesn't have timezone info, add 'Z' to indicate UTC
    const utcString = gmtDateTime.includes('T') && !gmtDateTime.includes('+') && !gmtDateTime.includes('Z') 
        ? gmtDateTime + 'Z' 
        : gmtDateTime;
    const date = new Date(utcString);
    return date.toLocaleString('en-US');
};

const formatDuration = (seconds) => {
    const total = Number(seconds || 0);
    if (!Number.isFinite(total) || total <= 0) return '0s';

    if (total < 60) return `${Math.floor(total)}s`;

    const mins = Math.floor(total / 60);
    const secs = Math.floor(total % 60);
    if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;

    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
};


export default function Index() {
    const {
        visitors,
        currentPage,
        lastPage,
        search: initialSearch = '',
        startDate: initialStartDate = '',
        endDate: initialEndDate = '',
        totalVisitors,
        guestVisitors,
        returnVisitors,
        filter: initialFilter = 'all',
        viewFilter: initialViewFilter = 'today',
        timeSpentFilter: initialTimeSpentFilter = 'gt_0',
    } = usePage().props;
    // Add todayVisitors prop (ensure backend provides this)
    const { todayVisitors = 0 } = usePage().props;
    const [search, setSearch] = useState(initialSearch);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const activeFilter = ['all', 'guest', 'returning'].includes(initialFilter) ? initialFilter : 'all';
    const timeRangeFilter = initialViewFilter === 'today' ? 'today' : 'all';
    const [timeSpentFilter, setTimeSpentFilter] = useState(initialTimeSpentFilter);
    const [pageInput, setPageInput] = useState("");
    const [visitorsList, setVisitorsList] = useState(visitors);

    const deleteVisitor = async (id) => {
        if (!confirm('Delete this visitor and all related visits?')) return;
        try {
            const response = await axios.post(route('admin.visitors.delete'), { id });
            if (response.data.success) {
                setVisitorsList((prev) => prev.filter((v) => v.id !== id));
            } else {
                alert('Failed to delete: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting visitor:', error);
            alert('Failed to delete visitor. Please try again.');
        }
    };

    const columns = [
        { key: 'visitor_token', label: 'Token' },
        {
            key: 'user',
            label: 'User',
            render: visitor => visitor.user?.username || 'Guest',
        },
        {
            key: 'email',
            label: 'Email',
            render: visitor => visitor.user?.email || '-',
        },
        { key: 'ip_address', label: 'IP Address' },
        {
            key: 'visits_count',
            label: 'Visits',
            render: visitor => visitor.visits_count ?? 0,
        },
        {
            key: 'duration_total_seconds',
            label: 'Time Spent',
            render: visitor => formatDuration(visitor.duration_total_seconds),
        },
        {
            key: 'average_daily_duration_seconds',
            label: 'Avg Daily Time',
            render: visitor => formatDuration(visitor.average_daily_duration_seconds),
        },
        {
            key: 'visits_max_visited_at',
            label: 'Last Visit',
            render: visitor => convertGMTToLocalTime(visitor.visits_max_visited_at),
        },
        {
            key: 'created_at',
            label: 'Created',
            render: visitor => convertGMTToLocalTime(visitor.created_at),
        },
    ];

    const actions = [
        { label: 'Show', href: id => route('admin.visitors.show', { visitor: id }), variant: 'success', type: 'link' },
        { label: 'Delete', onClick: deleteVisitor, variant: 'danger', type: 'button' },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.visitors.index'), {
            page,
            search,
            start_date: startDate,
            end_date: endDate,
            filter: activeFilter,
            view_filter: timeRangeFilter,
            time_spent_filter: timeSpentFilter,
        }, {
            preserveScroll: true,
        });
    };

    // const handleSearch = () => {
    //     router.get(route('admin.visitors.index'), {
    //         search,
    //         start_date: startDate,
    //         end_date: endDate,
    //         filter: activeFilter,
    //         page: 1,
    //     }, {
    //         preserveScroll: true,
    //     });
    // };

    const handleSearch = () => {
        let pageNum = 1;
        if (pageInput && !isNaN(Number(pageInput))) {
            pageNum = Math.max(1, Number(pageInput));
        }
        router.get(route('admin.visitors.index'), {
            search,
            start_date: startDate,
            end_date: endDate,
            filter: activeFilter,
            view_filter: timeRangeFilter,
            time_spent_filter: timeSpentFilter,
            page: pageNum,
        }, {
            preserveScroll: true,
        });
    };

    const handleCardFilterChange = (filter) => {
        router.get(route('admin.visitors.index'), {
            filter,
            view_filter: timeRangeFilter,
            time_spent_filter: timeSpentFilter,
            search,
            start_date: startDate,
            end_date: endDate,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const handleTimeRangeChange = (value) => {
        router.get(route('admin.visitors.index'), {
            filter: activeFilter,
            view_filter: value,
            time_spent_filter: timeSpentFilter,
            search,
            start_date: startDate,
            end_date: endDate,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const handleTodayVisitorsCardClick = () => {
        router.get(route('admin.visitors.index'), {
            filter: 'all',
            view_filter: 'today',
            time_spent_filter: timeSpentFilter,
            search,
            start_date: startDate,
            end_date: endDate,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setTimeSpentFilter('all');
        router.get(route('admin.visitors.index'), {
            filter: activeFilter,
            view_filter: timeRangeFilter,
            time_spent_filter: 'all',
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search token, IP, or user',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 w-full px-3 py-2 rounded md:mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: 'border px-3 py-2 rounded mr-2',
        },
        {
            type: 'date',
            placeholder: 'Start date',
            value: startDate,
            onChange: (e) => setStartDate(e.target.value),
            className: 'border w-full px-3 py-2 rounded md:mr-2',
        },
        {
            type: 'date',
            placeholder: 'End date',
            value: endDate,
            onChange: (e) => setEndDate(e.target.value),
            className: 'border w-full px-3 py-2 rounded md:mr-2',
        },
        {
            type: 'select',
            value: timeSpentFilter,
            onChange: (value) => setTimeSpentFilter(value),
            options: [
                { value: 'all', label: 'Time: All' },
                { value: 'gt_0', label: 'Time: > 0s' },
            ],
            className: 'border w-full px-3 py-2 rounded md:mr-2',
        },
        {
            type: 'number',
            placeholder: 'Page #',
            value: pageInput,
            min: 1,
            onChange: (e) => setPageInput(e.target.value),
            className: "!border !border-slate-500 w-full px-3 py-2 rounded md:mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: 'border px-3 py-2 rounded mr-2',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title="Visitors">
                <div className="mb-4 flex items-center gap-3">
                    <label htmlFor="visitor-time-filter" className="text-sm font-medium text-slate-600">
                        View:
                    </label>
                    <select
                        id="visitor-time-filter"
                        value={timeRangeFilter}
                        onChange={(e) => handleTimeRangeChange(e.target.value)}
                        className="min-w-[140px] rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm !text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff', WebkitTextFillColor: '#1e293b' }}
                    >
                        <option value="all" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>All</option>
                        <option value="today" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Today</option>
                    </select>
                </div>
                {/* Filter Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* All Visitors Card */}
                    <div
                        onClick={() => handleCardFilterChange('all')}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            activeFilter === 'all'
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'all' && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'all'
                                        ? 'bg-blue-500 shadow-md'
                                        : 'bg-blue-100 group-hover:bg-blue-200'
                                }`}>
                                    <HiUserGroup 
                                        className={activeFilter === 'all' ? 'text-white' : 'text-blue-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Total</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'all' ? 'text-blue-700' : 'text-gray-800'
                                    }`}>All Visitors</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-blue-600">{totalVisitors || 0}</p>
                                        <span className="text-xs text-gray-500">visitors</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Users (Guest) Card */}
                    <div
                        onClick={() => handleCardFilterChange('guest')}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            activeFilter === 'guest'
                                ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                        {activeFilter === 'guest' && (
                            <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'guest'
                                        ? 'bg-green-500 shadow-md'
                                        : 'bg-green-100 group-hover:bg-green-200'
                                }`}>
                                    <HiUserAdd 
                                        className={activeFilter === 'guest' ? 'text-white' : 'text-green-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Guest</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'guest' ? 'text-green-700' : 'text-gray-800'
                                    }`}>New Users</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-green-600">{guestVisitors || 0}</p>
                                        <span className="text-xs text-gray-500">guests</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Return Users Card */}
                    <div
                        onClick={() => handleCardFilterChange('returning')}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            activeFilter === 'returning'
                                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-purple-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                        {activeFilter === 'returning' && (
                            <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'returning'
                                        ? 'bg-purple-500 shadow-md'
                                        : 'bg-purple-100 group-hover:bg-purple-200'
                                }`}>
                                    <HiUsers 
                                        className={activeFilter === 'returning' ? 'text-white' : 'text-purple-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Registered</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'returning' ? 'text-purple-700' : 'text-gray-800'
                                    }`}>Return Users</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-purple-600">{returnVisitors || 0}</p>
                                        <span className="text-xs text-gray-500">users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Today Visitors Card */}
                    <div
                        onClick={handleTodayVisitorsCardClick}
                        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                            timeRangeFilter === 'today' && activeFilter === 'all'
                                ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-yellow-400 hover:shadow-md'
                        }`}
                    >
                        {timeRangeFilter === 'today' && activeFilter === 'all' && (
                            <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    timeRangeFilter === 'today' && activeFilter === 'all'
                                        ? 'bg-yellow-500 shadow-md'
                                        : 'bg-yellow-100 group-hover:bg-yellow-200'
                                }`}>
                                    <HiUserGroup className={timeRangeFilter === 'today' && activeFilter === 'all' ? 'text-white' : 'text-yellow-500'} size={28} />
                                </div>
                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Today</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        timeRangeFilter === 'today' && activeFilter === 'all' ? 'text-yellow-700' : 'text-gray-800'
                                    }`}>Today Visitors</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-yellow-600">{todayVisitors || 0}</p>
                                        <span className="text-xs text-gray-500">visitors</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    onClear={handleClear}
                    columns={columns}
                    data={visitorsList}
                    actions={actions}
                    mobileExpandable={true}
                    mobilePrimaryColumns={['visitor_token', 'user', 'email']}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
