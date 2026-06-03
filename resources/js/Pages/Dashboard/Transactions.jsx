import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Pagination from "@/Components/Dashboard/Pagination.jsx";
export default function Transactions({ auth }) {
    const { transactions, currentPage, lastPage, totalTransactions } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transactions</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Type</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">User</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Details</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-3 text-center">No transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b">
                                    <td className="px-5 py-4 capitalize">{transaction.type}</td>
                                    <td className="px-5 py-4">
                                        {transaction.type === 'gift'
                                            ? transaction.sender.name
                                            : transaction.user?.name}
                                    </td>
                                    <td className="px-5 py-4">
                                        {transaction.type === 'gift' && (
                                            <>
                                                Recipient: {transaction.recipient.name}, Gift: {transaction.gift.name}
                                            </>
                                        )}
                                        {transaction.type === 'donation' && (
                                            <>Funds: {transaction.funds}</>
                                        )}
                                        {transaction.type === 'top_up' && (
                                            <>
                                                Funds: {transaction.funds}, Coins: {transaction.coins}
                                            </>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        {new Date(transaction.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={(page) => {
                            router.get(route('admin.transactions.index', { page }), {}, {
                                preserveScroll: true,
                            });
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
