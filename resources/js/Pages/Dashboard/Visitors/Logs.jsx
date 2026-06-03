import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Wrapper from '@/Components/Dashboard/Wrapper.jsx';
import Pagination from '@/Components/Dashboard/Pagination.jsx';
import { Button } from '@/Components/Dashboard/Form.jsx';

const convertGMTToLocalTime = (gmtDateTime) => {
    if (!gmtDateTime) return '-';
    // If the timestamp doesn't have timezone info, add 'Z' to indicate UTC.
    const utcString = gmtDateTime.includes('T') && !gmtDateTime.includes('+') && !gmtDateTime.includes('Z')
        ? gmtDateTime + 'Z'
        : gmtDateTime;
    const date = new Date(utcString);
    return date.toLocaleString('en-US');
};

const formatDuration = (seconds) => {
    const total = Number(seconds || 0);
    if (!Number.isFinite(total) || total <= 0) return '0s';
    if (total < 60) return `${Math.floor(total)}s`;

    const mins = Math.floor(total / 60);
    const secs = Math.floor(total % 60);
    if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;

    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
};

export default function Logs() {
    const {
        visitor,
        logs,
        currentPage,
        lastPage,
    } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Wrapper title="Visitor Logs">
                <div className="flex flex-col box box--stacked">
                    <div className="p-5 border-b border-slate-200/60 text-sm text-slate-600">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div>Token: <span className="text-slate-900">{visitor.visitor_token}</span></div>
                                <div>User: <span className="text-slate-900">{visitor.user?.username || visitor.user?.email || 'Guest'}</span></div>
                                <div>IP: <span className="text-slate-900">{visitor.ip_address || '-'}</span></div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.get(route('admin.visitors.show', { visitor: visitor.id }))}
                                >
                                    Back to Details
                                </Button>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">*All times converted from GMT to your local timezone</div>
                    </div>

                    <div className="overflow-x-auto xl:overflow-visible">
                        <table className="w-full text-left border-b border-slate-200/60">
                            <thead>
                                <tr>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Token</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">User</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Email</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">IP Address</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Visits</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Time Spent</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Last Visit</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-3 text-center">No visitors found.</td>
                                    </tr>
                                ) : (
                                    logs.map((v) => (
                                        <tr key={v.id} className="border-b">
                                            <td className="px-5 py-4">{v.visitor_token || '-'}</td>
                                            <td className="px-5 py-4">
                                                {v.user?.username || v.user?.email || 'Guest'}
                                            </td>
                                            <td className="px-5 py-4">{v.user?.email || '-'}</td>
                                            <td className="px-5 py-4">{v.ip_address || '-'}</td>
                                            <td className="px-5 py-4">{v.visits_count ?? 0}</td>
                                            <td className="px-5 py-4">{formatDuration(v.duration_total_seconds)}</td>
                                            <td className="px-5 py-4">
                                                {convertGMTToLocalTime(v.visits_max_visited_at)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Button
                                                    variant="success"
                                                    onClick={() => router.get(route('admin.visitors.show', { visitor: v.id }))}
                                                >
                                                    View
                                                </Button>
                                            </td>
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
                            router.get(route('admin.visitors.logs', { visitor: visitor.id, page }), {}, {
                                preserveScroll: true,
                            });
                        }}
                    />
                </div>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
