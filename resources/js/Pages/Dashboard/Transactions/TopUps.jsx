import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function TopUps({ auth }) {
    const { topUps, currentPage, lastPage, search: initialSearch = '' } = usePage().props;
    const [search, setSearch] = useState(initialSearch);

    const topUpColumns = [
        {
            key: 'user.username',
            label: 'User',
            render: topUp => topUp.user?.username || ''
        },
        {
            key: 'funds',
            label: 'Funds',
            render: topUp => `$${topUp.funds}`
        },
        {
            key: 'coins',
            label: 'Coins',
            render: topUp => topUp.coins
        },
        {
            key: 'created_at',
            label: 'Date',
            render: topUp => new Date(topUp.created_at).toLocaleDateString()
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.transactions.top-ups.index'), { page, search }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.transactions.top-ups.index'), { search, page: 1 }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by user',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "border px-3 py-2 rounded mr-2",
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Top up transactions'>
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={topUpColumns}
                    data={topUps}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
