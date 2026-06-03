import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

import ListView from '@/Components/Dashboard/ListView.jsx';
import { useState, useEffect } from 'react';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import { HiUserGroup, HiUser, HiUserCircle, HiUserAdd } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
import '../../../../css/user.css'

export default function Index({ auth }) {
    const { 
        currentUsers, 
        totalUsers, 
        currentPage, 
        lastPage,
        totalUsersCount,
        totalNormalUsers,
        totalCreatorUsers,
        todaySignups,
        filter: initialFilter = 'all'
    } = usePage().props;
    const [users, setUsers] = useState(currentUsers);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [pageInput, setPageInput] = useState("");

    const formatJoinedDate = (value) => {
        if (!value) return '-';

        // Keep date consistent with DB stored date by avoiding browser timezone shifts.
        const raw = String(value);
        const datePart = raw.includes('T') ? raw.split('T')[0] : raw.split(' ')[0];
        const [year, month, day] = datePart.split('-');

        if (year && month && day) {
            return `${Number(month)}/${Number(day)}/${year}`;
        }

        return raw;
    };

    useEffect(() => {
        setUsers(currentUsers);
    }, [currentUsers]);

    const deleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await axios.delete(route('admin.users.delete', { id: userId }));

                if (response.status === 200) {
                    setUsers(users.filter(user => user.id !== userId));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            const response = await axios.post(route('admin.users.update-status', { id: userId }), {
                active_status: newStatus
            });

            if (response.status === 200) {
                // Update local state without page reload
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, active_status: newStatus } : user
                ));
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    const updateCreatorStatus = async (userId, newStatus) => {
        try {
            const response = await axios.post(route('admin.users.update-creator-status', { id: userId }), {
                creator_status: newStatus
            });

            if (response.status === 200) {
                // Update local state without page reload
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, creator_status: newStatus } : user
                ));
            }
        } catch (error) {
            console.error('Error updating creator status:', error);
            alert('Failed to update creator status');
        }
    };

    const handleSearch = () => {
        let pageNum = 1;
        if (pageInput && !isNaN(Number(pageInput))) {
            pageNum = Math.max(1, Number(pageInput));
        }
        router.get(route('admin.users.index'), {
            search,
            filter: activeFilter,
            page: pageNum,
        }, {
            preserveScroll: true,
        });
    };

    //   const handleSearch = () => {
    //     let pageNum = 1;
    //     if (pageInput && !isNaN(Number(pageInput))) {
    //         pageNum = Math.max(1, Number(pageInput));
    //     }
    //     router.get(route('admin.visitors.index'), {
    //         search,
    //         start_date: startDate,
    //         end_date: endDate,
    //         filter: activeFilter,
    //         page: pageNum,
    //     }, {
    //         preserveScroll: true,
    //     });
    // };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        router.get(route('admin.users.index'), {
            filter,
            search,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const userColumns = [
        {
            key: 'avatar',
            label: 'Avatar',
            render: user => <img src={user.avatar} alt={user.username} className="w-16 max-h-16 object-cover rounded" />
        },
        { key: 'username', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'is_creator',
            label: 'User Type',
            render: user => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_creator === 1 || user.is_creator === true 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {user.is_creator === 1 || user.is_creator === true ? 'Creator' : 'User'}
                </span>
            )
        },
        {
            key: 'creator_status',
            label: 'Creator Status',
            render: user => {
                // Only show dropdown for creators
                if (user.is_creator === 0 || user.is_creator === false) {
                    return <span className="text-gray-400 text-sm">N/A</span>;
                }
                return (
                    <select 
                        value={user.creator_status ? '1' : '0'}
                        onChange={(e) => updateCreatorStatus(user.id, parseInt(e.target.value))}
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1">Approved</option>
                        <option value="0">Disapproved</option>
                    </select>
                );
            }
        },
        {
            key: 'created_at',
            label: 'Joined Date',
            render: user => formatJoinedDate(user.created_at)
        },
        {
            key: 'active_status',
            label: 'Status',
            render: user => (
                <select 
                    value={user.active_status ? '1' : '0'}
                    onChange={(e) => updateUserStatus(user.id, parseInt(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            )
        },
    ];

    const userActions = [
        { label: 'Show', href: id => route('admin.users.show', { id }), variant: 'success', type: 'link' },
        { label: 'Edit User', href: id => route('admin.users.edit', { id }), variant: 'warning', type: 'link' },
        { label: 'Delete', onClick: deleteUser, variant: 'danger', type: 'button' },
    ];

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by username or name or email',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: "border-2 border-slate-400 px-3 py-2 rounded mr-2",
        },
        {
            type: 'number',
            placeholder: 'Page #',
            value: pageInput,
            min: 1,
            onChange: (e) => setPageInput(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: 'border px-3 py-2 rounded mr-2',
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.users.index'), { page, search, filter: activeFilter }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Users'>
                {/* Filter Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    {/* Total Users Card */}
                    <div
                        onClick={() => handleFilterChange('all')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'all'
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
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
                                    }`}>Total Users</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-blue-600">{totalUsersCount || 0}</p>
                                        <span className="text-xs text-gray-500">users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Normal Users Card */}
                    <div
                        onClick={() => handleFilterChange('normal')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'normal'
                                ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'normal' && (
                            <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'normal'
                                        ? 'bg-green-500 shadow-md'
                                        : 'bg-green-100 group-hover:bg-green-200'
                                }`}>
                                    <HiUser 
                                        className={activeFilter === 'normal' ? 'text-white' : 'text-green-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">User Type</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'normal' ? 'text-green-700' : 'text-gray-800'
                                    }`}>Total Normal Users</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-green-600">{totalNormalUsers || 0}</p>
                                        <span className="text-xs text-gray-500">users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Creator Users Card */}
                    <div
                        onClick={() => handleFilterChange('creator')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'creator'
                                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-purple-400 hover:shadow-md'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'creator' && (
                            <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'creator'
                                        ? 'bg-purple-500 shadow-md'
                                        : 'bg-purple-100 group-hover:bg-purple-200'
                                }`}>
                                    <HiUserCircle 
                                        className={activeFilter === 'creator' ? 'text-white' : 'text-purple-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">User Type</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'creator' ? 'text-purple-700' : 'text-gray-800'
                                    }`}>Total Creator Users</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-purple-600">{totalCreatorUsers || 0}</p>
                                        <span className="text-xs text-gray-500">creators</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today Signups Card */}
                    <div
                        onClick={() => handleFilterChange('today')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'today'
                                ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-amber-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-amber-400 hover:shadow-md'
                        }`}
                    >
                        {activeFilter === 'today' && (
                            <div className="absolute top-2 right-2 bg-amber-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'today'
                                        ? 'bg-amber-500 shadow-md'
                                        : 'bg-amber-100 group-hover:bg-amber-200'
                                }`}>
                                    <HiUserAdd className={activeFilter === 'today' ? 'text-white' : 'text-amber-600'} size={28} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Today</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'today' ? 'text-amber-700' : 'text-gray-800'
                                    }`}>Sign Ups</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-amber-600">{todaySignups || 0}</p>
                                        <span className="text-xs text-gray-500">users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={userColumns}
                    data={users}
                    actions={userActions}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
