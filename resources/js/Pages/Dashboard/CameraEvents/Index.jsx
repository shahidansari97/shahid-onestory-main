import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from '@/Components/Dashboard/Wrapper.jsx';

const truncateText = (value, maxLength = 40) => {
    if (!value) {
        return '-';
    }

    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength - 3)}...`;
};

const eventTypeClasses = {
    camera_opened: 'bg-blue-100 text-blue-800',
    recording_saved: 'bg-green-100 text-green-800',
    camera_permission_denied: 'bg-red-100 text-red-800',
    recording_deleted: 'bg-red-100 text-red-800',
};

const eventTypeLabels = {
    camera_opened: 'Camera Page Opened',
    recording_saved: 'Recording Video',
    camera_permission_denied: 'Camera Permission Denied',
    recording_deleted: 'Recording Video Deleted',
};

export default function Index() {
    const {
        events,
        currentPage,
        lastPage,
        search: initialSearch = '',
        startDate: initialStartDate = '',
        endDate: initialEndDate = '',
    } = usePage().props;

    const [search, setSearch] = useState(initialSearch);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const columns = [
        {
            key: 'userId',
            label: 'User ID',
            render: (event) => event.userId || '-',
        },
        {
            key: 'name',
            label: 'Name',
            render: (event) => event.name || event.user?.username || '-',
        },
        {
            key: 'email',
            label: 'Email',
            render: (event) => event.email || event.user?.email || '-',
        },
        {
            key: 'eventType',
            label: 'Event Type',
            render: (event) => {
                const eventType = event.eventType || '-';
                const badgeLabel = eventTypeLabels[eventType] || eventType;

                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${eventTypeClasses[event.eventType] || 'bg-slate-100 text-slate-800'}`}>
                        {badgeLabel}
                    </span>
                );
            },
        },
        {
            key: 'themeId',
            label: 'Theme ID',
            render: (event) => event.themeId ?? '-',
        },
        {
            key: 'themeTitle',
            label: 'Theme Title',
            render: (event) => (
                <span title={event.themeTitle || ''}>
                    {truncateText(event.themeTitle)}
                </span>
            ),
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (event) => event.duration !== null && event.duration !== undefined
                ? `${Number(event.duration).toFixed(2)}s`
                : '-',
        },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (event) => event.createdAt ? new Date(event.createdAt).toLocaleString() : '-',
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.camera-events.index'), {
            page,
            search,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.camera-events.index'), {
            search,
            start_date: startDate,
            end_date: endDate,
            page: 1,
        }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by user ID, name, email, event type, or theme',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: 'border px-3 py-2 rounded mr-2',
        },
        {
            type: 'date',
            placeholder: 'Start date',
            value: startDate,
            onChange: (e) => setStartDate(e.target.value),
            className: 'border px-3 py-2 rounded mr-2',
        },
        {
            type: 'date',
            placeholder: 'End date',
            value: endDate,
            onChange: (e) => setEndDate(e.target.value),
            className: 'border px-3 py-2 rounded mr-2',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title="Camera Events">
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={columns}
                    data={events}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
