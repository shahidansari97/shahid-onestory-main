import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import SelectStatus from '@/Components/Dashboard/SelectStatus.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';
import { useState, useEffect } from 'react';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import { HiDocumentText, HiCheckCircle, HiClock, HiXCircle, HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
import '../../../../css/storycard.css'
import AdminTotalShareCell from '@/Components/Dashboard/AdminTotalShareCell.jsx';

export default function Index({ auth }) {
    const { 
        stories: initialStories, 
        currentPage, 
        lastPage, 
        totalStories, 
        storyStatuses, 
        categories,
        totalStoriesCount,
        totalPublishedStories,
        totalPendingStories,
        totalRejectedStories,
        totalPublicStories,
        totalPrivateStories,
        filter: initialFilter = 'all'
    } = usePage().props;
    const [stories, setStories] = useState(initialStories);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [pageInput, setPageInput] = useState("");

    useEffect(() => {
        setStories(initialStories);
    }, [initialStories]);

    const deleteStory = async (storyId) => {
        if (confirm('Are you sure you want to delete this story?')) {
            try {
                const response = await axios.post(route('admin.stories.delete', { id: storyId }));

                if (response.status === 200) {
                    setStories(stories.filter(story => story.id !== storyId));
                }
            } catch (error) {
                console.error('Error deleting story:', error);
            }
        }
    };

    const updateStoryStatus = async (storyId, statusId) => {
        try {
            const response = await axios.post(route('admin.stories.story.status-update'), {
                story_id: storyId,
                story_status_id: statusId,
            });

            if (response.status === 200) {
                setStories(stories.map(story =>
                    story.id === storyId ? { ...story, story_status_id: parseInt(statusId) } : story
                ));
            }
        } catch (error) {
            console.error('Error updating story status:', error);
        }
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return 'border-warning text-warning';
            case 2:
                return 'border-success text-success';
            case 3:
                return 'border-danger text-danger';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-500';
        }
    };

    // const handleFilter = () => {
    //     router.get(route('admin.stories.all'), {
    //         search,
    //         category,
    //         filter: activeFilter,
    //         page: 1
    //     }, {
    //         preserveScroll: true,
    //     });
    // };

    const handleFilter = () => {
        let pageNum = 1;
        if (pageInput && !isNaN(Number(pageInput))) {
            pageNum = Math.max(1, Number(pageInput));
        }
        router.get(route('admin.stories.all'), {
            search,
            category,
            filter: activeFilter,
            page: pageNum,
        }, {
            preserveScroll: true,
        });
    };
    

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        router.get(route('admin.stories.all'), {
            filter,
            search,
            category,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const storyColumns = [
        { key: 'thumbnail', label: 'Thumbnail', render: story => <img src={story.thumbnail} alt={story.name} className="w-16 h-16 object-cover rounded"/> },
        { key: 'name', label: 'Title' },
        {
            key: 'author.name',
            label: 'Author',
            render: story => story.author?.name || 'N/A'
        },
        { key: 'created_at', label: 'Created Date', render: story => new Date(story.created_at).toLocaleDateString() },
        {
            key: 'story_status_id',
            label: 'Status',
            render: story => (
                <SelectStatus
                    options={storyStatuses}
                    value={story.story_status_id}
                    onChange={(newStatusId) => updateStoryStatus(story.id, newStatusId)}
                    getStatusColor={getStatusColor}
                />
            )
        },
        {
            key: 'total_share',
            label: 'Total Share',
            render: (story) => (
                <AdminTotalShareCell
                    rowId={story.id}
                    initialValue={story.total_share ?? 0}
                    routeName="admin.stories.total-share"
                    onUpdated={(id, total_share) => {
                        setStories((prev) =>
                            prev.map((s) => (s.id === id ? { ...s, total_share } : s))
                        );
                    }}
                />
            ),
        },
    ];

    const storyActions = [
        { label: 'Show', href: id => route('admin.stories.show', { id }), variant: 'success', type: 'link' },
        { label: 'Edit', href: id => route('admin.stories.edit', { id }), variant: 'primary', type: 'link' },
        { label: 'Delete', onClick: deleteStory, variant: 'danger', type: 'button' },
    ];

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by title or author name',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: "border px-3 py-2 rounded mr-2",
        },
        {
            type: 'select',
            placeholder: 'All Categories',
            value: category,
            onChange: (value) => setCategory(value),
            options: categories.map(cat => ({ value: cat, label: cat })),
            className: "border px-3 py-2 rounded mr-2",
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
        router.get(route('admin.stories.all'), { page, search, category, filter: activeFilter }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='All stories'>
                {/* Filter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Total Stories Card */}
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
                                    <HiDocumentText 
                                        className={activeFilter === 'all' ? 'text-white' : 'text-blue-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Total</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'all' ? 'text-blue-700' : 'text-gray-800'
                                    }`}>Total Stories</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-blue-600">{totalStoriesCount || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Public Stories Card */}
                    <div
                        onClick={() => handleFilterChange('public')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'public'
                                ? 'border-sky-500 bg-gradient-to-r from-sky-50 to-sky-100 shadow-xl'
                                : 'border-sky-200 bg-white hover:border-sky-400 hover:shadow-md'
                        }`}
                    >
                        {activeFilter === 'public' && (
                            <div className="absolute top-2 right-2 bg-sky-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'public'
                                        ? 'bg-sky-500 shadow-md'
                                        : 'bg-sky-100 group-hover:bg-sky-200'
                                }`}>
                                    <HiLockOpen className={activeFilter === 'public' ? 'text-white' : 'text-sky-500'} size={28} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Visibility</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'public' ? 'text-sky-700' : 'text-gray-800'
                                    }`}>Public Stories</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-sky-600">{totalPublicStories || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Private Stories Card */}
                    <div
                        onClick={() => handleFilterChange('private')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'private'
                                ? 'border-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 shadow-xl'
                                : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md'
                        }`}
                    >
                        {activeFilter === 'private' && (
                            <div className="absolute top-2 right-2 bg-slate-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}
                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'private'
                                        ? 'bg-slate-500 shadow-md'
                                        : 'bg-slate-100 group-hover:bg-slate-200'
                                }`}>
                                    <HiLockClosed className={activeFilter === 'private' ? 'text-white' : 'text-slate-500'} size={28} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Visibility</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'private' ? 'text-slate-700' : 'text-gray-800'
                                    }`}>Private Stories</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-slate-600">{totalPrivateStories || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Published Stories Card */}
                    <div
                        onClick={() => handleFilterChange('published')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'published'
                                ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'published' && (
                            <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'published'
                                        ? 'bg-green-500 shadow-md'
                                        : 'bg-green-100 group-hover:bg-green-200'
                                }`}>
                                    <HiCheckCircle 
                                        className={activeFilter === 'published' ? 'text-white' : 'text-green-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'published' ? 'text-green-700' : 'text-gray-800'
                                    }`}>Published</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-green-600">{totalPublishedStories || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Stories Card */}
                    <div
                        onClick={() => handleFilterChange('pending')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'pending'
                                ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-yellow-400 hover:shadow-md'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'pending' && (
                            <div className="absolute top-2 right-2 bg-yellow-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'pending'
                                        ? 'bg-yellow-500 shadow-md'
                                        : 'bg-yellow-100 group-hover:bg-yellow-200'
                                }`}>
                                    <HiClock 
                                        className={activeFilter === 'pending' ? 'text-white' : 'text-yellow-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'pending' ? 'text-yellow-700' : 'text-gray-800'
                                    }`}>Pending</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-yellow-600">{totalPendingStories || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejected Stories Card */}
                    <div
                        onClick={() => handleFilterChange('rejected')}
                        className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            activeFilter === 'rejected'
                                ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-red-400 hover:shadow-md'
                        }`}
                    >
                        {/* Active Indicator */}
                        {activeFilter === 'rejected' && (
                            <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1 shadow-md">
                                <FaCheckCircle className="text-white" size={14} />
                            </div>
                        )}

                        <div className="relative p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon Section */}
                                <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === 'rejected'
                                        ? 'bg-red-500 shadow-md'
                                        : 'bg-red-100 group-hover:bg-red-200'
                                }`}>
                                    <HiXCircle 
                                        className={activeFilter === 'rejected' ? 'text-white' : 'text-red-500'} 
                                        size={28} 
                                    />
                                </div>

                                {/* Text Section */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
                                    <h3 className={`text-base font-bold mb-1 ${
                                        activeFilter === 'rejected' ? 'text-red-700' : 'text-gray-800'
                                    }`}>Rejected</h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-2xl font-extrabold text-red-600">{totalRejectedStories || 0}</p>
                                        <span className="text-xs text-gray-500">stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ListView
                    searchFields={searchFields}
                    onSearch={handleFilter}
                    columns={storyColumns}
                    data={stories}
                    actions={storyActions}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
