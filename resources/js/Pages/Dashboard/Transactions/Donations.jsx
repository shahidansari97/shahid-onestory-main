import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Donations({ auth }) {
    const { donations, currentPage, lastPage, search: initialSearch = '' } = usePage().props;
    const [search, setSearch] = useState(initialSearch);

    const donationColumns = [
        {
            key: 'user.username',
            label: 'User',
            render: donation => donation.user?.username || ''
        },
        {
            key: 'funds',
            label: 'Funds',
            render: donation => `$${donation.funds}`
        },
        {
            key: 'variant.statement',
            label: 'Donation Goal',
            render: donation => donation.variant?.statement || ''
        },
        {
            key: 'created_at',
            label: 'Date',
            render: donation => new Date(donation.created_at).toLocaleDateString()
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.transactions.donations.index'), { page, search }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.transactions.donations.index'), { search, page: 1 }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by user or donation goal',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "border px-3 py-2 rounded mr-2",
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Donation transactions'>
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={donationColumns}
                    data={donations}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
