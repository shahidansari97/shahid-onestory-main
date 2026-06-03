import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Pagination from "@/Components/Dashboard/Pagination.jsx";

export default function TopUps({ auth }) {
    const { topUps, currentPage, lastPage, totalTopUps } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Top Ups</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">User</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Funds</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Coins</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {topUps.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-3 text-center">No top ups found.</td>
                            </tr>
                        ) : (
                            topUps.map((topUp) => (
                                <tr key={topUp.id} className="border-b">
                                    <td className="px-5 py-4">{topUp.user.username}</td>
                                    <td className="px-5 py-4">{topUp.funds}</td>
                                    <td className="px-5 py-4">{topUp.coins}</td>
                                    <td className="px-5 py-4">{new Date(topUp.created_at).toLocaleDateString()}</td>
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
                        router.get(route('admin.transactions.top-ups.index', { page }), {}, {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
