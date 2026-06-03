import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Gifts({ auth }) {
    const { transactions, currentPage, lastPage, search: initialSearch = '' } = usePage().props;
    const [search, setSearch] = useState(initialSearch);

    const giftColumns = [
        {
            key: 'sender.name',
            label: 'Sender',
            render: transaction => transaction.sender?.name || ''
        },
        {
            key: 'recipient.name',
            label: 'Recipient',
            render: transaction => transaction.recipient?.name || ''
        },
        {
            key: 'gift.name',
            label: 'Gift',
            render: transaction => transaction.gift?.name || ''
        },
        {
            key: 'created_at',
            label: 'Date',
            render: transaction => new Date(transaction.created_at).toLocaleDateString()
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.transactions.gift-transactions'), { page, search }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.transactions.gift-transactions'), { search, page: 1 }, {
            preserveScroll: true,
        });
    };

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by sender, recipient or gift name',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "border px-3 py-2 rounded mr-2",
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Gifts transactions'>
                <ListView
                    searchFields={searchFields}
                    onSearch={handleSearch}
                    columns={giftColumns}
                    data={transactions}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
