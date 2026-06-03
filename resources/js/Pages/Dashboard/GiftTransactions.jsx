import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Pagination from "@/Components/Dashboard/Pagination.jsx";

export default function GiftTransactions({ auth }) {
    const { transactions, currentPage, lastPage, totalTransactions } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gift Transactions</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Sender</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Recipient</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Gift</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-3 text-center">No gift transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b">
                                    <td className="px-5 py-4">{transaction.sender.name}</td>
                                    <td className="px-5 py-4">{transaction.recipient.name}</td>
                                    <td className="px-5 py-4">{transaction.gift.name}</td>
                                    <td className="px-5 py-4">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={(page) => {
                        router.get(route('admin.transactions.gift-transactions', { page }), {}, {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
