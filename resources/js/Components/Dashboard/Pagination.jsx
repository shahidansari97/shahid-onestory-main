import React from 'react';
import { router } from '@inertiajs/react';

export default function Pagination({ currentPage, lastPage, onPageChange }) {
    const current = Number(currentPage) || 1;
    const total = Number(lastPage) || 1;

    const handlePageChange = (page) => {
        const targetPage = Number(page);
        if (!Number.isFinite(targetPage) || targetPage < 1 || targetPage > total) {
            return;
        }

        if (onPageChange) {
            onPageChange(targetPage);
        } else {
            router.get(route(window.location.pathname, { page: targetPage }), {}, {
                preserveScroll: true,
            });
        }
    };

    const getVisiblePages = () => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, idx) => idx + 1);
        }

        const pages = [];
        const addPage = (page) => {
            const normalizedPage = Number(page);
            if (Number.isFinite(normalizedPage) && !pages.includes(normalizedPage)) {
                pages.push(normalizedPage);
            }
        };

        // Keep first pages visible
        addPage(1);
        addPage(2);
        addPage(3);

        // Keep pages around current page visible
        addPage(current - 1);
        addPage(current);
        addPage(current + 1);

        // Keep last page visible
        addPage(total);

        const sorted = pages
            .filter((page) => page >= 1 && page <= total)
            .sort((a, b) => a - b);

        const result = [];
        for (let i = 0; i < sorted.length; i += 1) {
            const page = sorted[i];
            const prev = sorted[i - 1];
            if (i > 0 && page - prev > 1) {
                result.push({ type: 'ellipsis', key: `ellipsis-${i}` });
            }
            result.push(page);
        }

        return result;
    };

    const visiblePages = getVisiblePages();

    return (
    <div className="flex items-center justify-start p-5">
        <nav>
            <ul className="flex items-center gap-1 text-sm">
                <li>
                    <button
                        onClick={() => current > 1 && handlePageChange(current - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={current <= 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                    </button>
                </li>
                {visiblePages.map((item) => (
                    <li key={typeof item === 'object' ? item.key : String(item)}>
                        {typeof item === 'object' && item.type === 'ellipsis' ? (
                            <span className="w-7 h-7 inline-flex items-center justify-center text-slate-400">...</span>
                        ) : (
                            <button
                                onClick={() => handlePageChange(item)}
                                className={`min-w-7 h-7 px-2 inline-flex items-center justify-center rounded-md text-xs ${
                                    current === item
                                        ? 'bg-indigo-600 text-white font-medium'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                                style={current === item ? { backgroundColor: '#4f46e5', color: '#ffffff' } : undefined}
                            >
                                {item}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => current < total && handlePageChange(current + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={current >= total}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
    );
}
