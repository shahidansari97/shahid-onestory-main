import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from '@/Components/Dashboard/Wrapper.jsx';

const truncateText = (value, maxLength = 60) => {
    if (!value) {
        return '';
    }

    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength - 3)}...`;
};

export default function Index({ auth }) {
    const {
        logs,
        currentPage,
        lastPage,
        search: initialSearch = '',
        startDate: initialStartDate = '',
        endDate: initialEndDate = ''
    } = usePage().props;
    const [search, setSearch] = useState(initialSearch);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const columns = [
        {
            key: 'user.username',
            label: 'User',
            render: log => log.user?.username || log.user?.email || 'Guest'
        },
        {
            key: 'user.email',
            label: 'Email',
            render: log => log.user?.email || '-'
        },
        { key: 'ip_address', label: 'IP Address' },
        {
            key: 'user_agent',
            label: 'User Agent',
            render: log => (
                <span title={log.user_agent || ''}>
                    {truncateText(log.user_agent)}
                </span>
            )
        },
        {
            key: 'login_at',
            label: 'Login At',
            render: log => (log.login_at ? new Date(log.login_at).toLocaleString() : '-')
        },
        {
            key: 'logout_at',
            label: 'Logout At',
            render: log => (log.logout_at ? new Date(log.logout_at).toLocaleString() : '-')
        },
        {
            key: 'status',
            label: 'Status',
            render: log => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    log.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                }`}>
                    {log.status}
                </span>
            )
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.user-login-logs.index'), {
            page,
            search,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.user-login-logs.index'), {
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
            placeholder: 'Search by user, email, IP, status, or agent',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'border px-3 py-2 rounded mr-2',
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
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title="User logs">
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={columns}
                    data={logs}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
