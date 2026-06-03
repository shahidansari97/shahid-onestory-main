import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Withdrawals({ auth }) {
    const { withdrawals, currentPage, lastPage, search: initialSearch = '' } = usePage().props;
    const [search, setSearch] = useState(initialSearch);

    const withdrawalColumns = [
        {
            key: 'user.username',
            label: 'User',
            render: withdrawal => withdrawal.user?.username || ''
        },
        {
            key: 'amount',
            label: 'Amount',
            render: withdrawal => `$${withdrawal.amount}`
        },
        {
            key: 'external_account_type',
            label: 'Account Type',
            render: withdrawal => withdrawal.external_account_type || ''
        },
        {
            key: 'status',
            label: 'Status',
            render: withdrawal => withdrawal.status || ''
        },
        {
            key: 'stripe_transaction_id',
            label: 'Stripe Transaction ID',
            render: withdrawal => withdrawal.stripe_transaction_id || 'N/A'
        },
        {
            key: 'stripe_account_id',
            label: 'Stripe Account ID',
            render: withdrawal => withdrawal.stripe_account_id || 'N/A'
        },
        {
            key: 'arrival_date',
            label: 'Arrival Date',
            render: withdrawal =>
                withdrawal.arrival_date
                    ? new Date(withdrawal.arrival_date).toLocaleDateString()
                    : 'N/A'
        },
        {
            key: 'created_at',
            label: 'Date',
            render: withdrawal => new Date(withdrawal.created_at).toLocaleDateString()
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.transactions.withdrawals.index'), { page, search }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.transactions.withdrawals.index'), { search, page: 1 }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by user, transaction ID or account ID',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "border px-3 py-2 rounded mr-2",
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Withdrawal transactions'>
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={withdrawalColumns}
                    data={withdrawals}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
