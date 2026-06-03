import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import Wrapper from '@/Components/Dashboard/Wrapper.jsx';
import Pagination from '@/Components/Dashboard/Pagination.jsx';
import { FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';

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

export default function Show() {
    const {
        visitor,
        visits,
        currentPage,
        lastPage,
    } = usePage().props;
    const [expandedRows, setExpandedRows] = useState({});
    const [isMobileView, setIsMobileView] = useState(false);

    const toggleRow = (visitId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [visitId]: !prev[visitId],
        }));
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const handleChange = () => setIsMobileView(mediaQuery.matches);
        handleChange();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    return (
        <AuthenticatedLayout>
            <Wrapper title="Visitor Details">
                <div className="flex flex-col box box--stacked">
                    <div className="px-5 py-4 border-b border-slate-200/60 text-sm text-slate-600">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-stretch">
                            <div className="md:col-span-8">
                                <div>Token: <span className="text-slate-900">{visitor.visitor_token}</span></div>
                                <div>User: <span className="text-slate-900">{visitor.user?.username || visitor.user?.email || 'Guest'}</span></div>
                                <div>Name / Username: <span className="text-slate-900">{visitor.user?.name || visitor.user?.username || 'Guest'}</span></div>
                                <div>IP: <span className="text-slate-900">{visitor.ip_address || '-'}</span></div>
                                {/* <div className="text-xs mt-2 text-slate-500">*All times converted from GMT to your local timezone</div> */}
                            </div>
                            <div className="md:col-span-4 flex md:justify-end md:items-center">
                                <button
                                  type="button"
                                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-200 bg-blue-100 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-200"
                                  onClick={() => router.get(route('admin.visitors.index'))}
                                >
                                  <FiArrowLeft size={14} />
                                  Back
                                </button>
                            </div>
                        </div>
                    </div>
                    {!isMobileView && (
                    <div className="overflow-x-auto xl:overflow-visible">
                        <table className="w-full text-left border-b border-slate-200/60">
                            <thead>
                                <tr className="border-b">
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Start Time</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">End Time</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">IP Address</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">URL</td>
                                    <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Duration</td>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-3 text-center">No visits found.</td>
                                    </tr>
                                ) : (
                                    visits.map((visit) => (
                                        <tr key={visit.id} className="border-b">
                                            <td className="px-5 py-4">
                                                {convertGMTToLocalTime(visit.visited_at)}
                                            </td>
                                            <td className="px-5 py-4">{convertGMTToLocalTime(visit.ended_at)}</td>
                                            <td className="px-5 py-4">{visit.ip_address || '-'}</td>
                                            <td className="px-5 py-4 text-blue-600 break-all text-sm">
                                                {visit.url ? (
                                                    <a href={visit.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {visit.url}
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="px-5 py-4">{formatDuration(visit.duration_seconds)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {isMobileView && (
                    <div className="divide-y divide-slate-200/70">
                        {visits.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-slate-500">No visits found.</div>
                        ) : (
                            visits.map((visit) => {
                                const isExpanded = Boolean(expandedRows[visit.id]);
                                return (
                                    <div key={visit.id} className="px-4 py-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <div className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">Start Time</span>
                                                    <span className="text-right font-medium text-slate-700">{convertGMTToLocalTime(visit.visited_at)}</span>
                                                </div>
                                                <div className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">End Time</span>
                                                    <span className="text-right font-medium text-slate-700">{convertGMTToLocalTime(visit.ended_at)}</span>
                                                </div>
                                                <div className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">IP Address</span>
                                                    <span className="text-right font-medium text-slate-700">{visit.ip_address || '-'}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => toggleRow(visit.id)}
                                                className={`h-7 w-7 rounded-full border text-lg leading-none ${
                                                    isExpanded
                                                        ? 'border-green-300 bg-green-50 text-green-700'
                                                        : 'border-green-500 bg-green-500 text-white'
                                                }`}
                                                aria-label={isExpanded ? 'Collapse visit details' : 'Expand visit details'}
                                            >
                                                {isExpanded ? '-' : '+'}
                                            </button>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-3 space-y-2 rounded-md bg-slate-50 p-3">
                                                <div className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">Duration</span>
                                                    <span className="text-right font-medium text-slate-700">{formatDuration(visit.duration_seconds)}</span>
                                                </div>
                                                <div className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">URL</span>
                                                    <span className="text-right font-medium text-blue-600 break-all">
                                                        {visit.url ? (
                                                            <a href={visit.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                                {visit.url}
                                                            </a>
                                                        ) : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={(page) => {
                            router.get(route('admin.visitors.show', { visitor: visitor.id, page }), {}, {
                                preserveScroll: true,
                            });
                        }}
                    />
                </div>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
