import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Pagination from "@/Components/Dashboard/Pagination.jsx";

export default function Donations({ auth }) {
    const { donations, currentPage, lastPage, totalDonations } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Donations</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">User</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Funds</td>
                            <th className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Subject</th>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {donations.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-5 py-3 text-center">No donations found.</td>
                            </tr>
                        ) : (
                            donations.map((donation) => (
                                <tr key={donation.id} className="border-b">
                                    <td className="px-5 py-4">{donation.user.username}</td>
                                    <td className="px-5 py-4">{donation.funds}</td>
                                    <td className="px-5 py-4">{donation.variant?.statement || 'N/A'}</td>
                                    <td className="px-5 py-4">{new Date(donation.created_at).toLocaleDateString()}</td>
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
                        router.get(route('admin.transactions.donations.index', { page }), {}, {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
