import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/Components/Dashboard/Form.jsx";

export default function DataTable({ columns, data, actions, mobileExpandable = false, mobilePrimaryColumns = [] }) {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const renderCellValue = (item, col) => (col.render ? col.render(item) : item[col.key]);
    const primaryColumnSet = new Set(mobilePrimaryColumns);
    const primaryColumns = mobilePrimaryColumns.length > 0
        ? columns.filter((col) => primaryColumnSet.has(col.key))
        : columns.slice(0, 3);
    const detailColumns = columns.filter((col) => !primaryColumns.some((primary) => primary.key === col.key));

    return (
        <>
            <div className={`${mobileExpandable ? 'hidden md:block' : 'block'} overflow-x-auto xl:overflow-visible`}>
            <table className="w-full text-left border-b border-slate-200/60" style={{ minWidth: '100%' }}>
                <thead>
                <tr className='border-b'>
                    {columns.map(col => (
                        <td key={col.key} className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">{col.label}</td>
                    ))}
                    {actions && <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500 text-center">Action</td>}
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-3 text-center">No records found.</td>
                    </tr>
                ) : (
                    data.map(item => (
                        <tr key={item.id} className="border-b">
                            {columns.map(col => (
                                <td key={col.key} className="px-5 py-4">
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center items-center gap-2">
                                        {actions.map((action, index) => {
                                            const resolvedLabel = typeof action.label === 'function' ? action.label(item) : action.label;
                                            const resolvedVariant = typeof action.variant === 'function' ? action.variant(item) : action.variant;

                                            if(action.type === 'link') {
                                                return (
                                                    <Link key={index} href={action.href(item.id)}>
                                                        <Button variant={resolvedVariant}>{resolvedLabel}</Button>
                                                    </Link>
                                                );
                                            } else {
                                                return (
                                                    <Button
                                                        key={index}
                                                        onClick={() => action.onClick(item.id)}
                                                        variant={resolvedVariant}
                                                    >
                                                        {resolvedLabel}
                                                    </Button>
                                                );
                                            }
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>

            {mobileExpandable && (
                <div className="md:hidden divide-y divide-slate-200/70">
                    {data.length === 0 ? (
                        <div className="px-4 py-5 text-center text-sm text-slate-500">No records found.</div>
                    ) : (
                        data.map((item) => {
                            const isExpanded = Boolean(expandedRows[item.id]);

                            return (
                                <div key={item.id} className="px-4 py-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1 space-y-1">
                                            {primaryColumns.map((col) => (
                                                <div key={col.key} className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">{col.label}</span>
                                                    <span className="text-right font-medium text-slate-700 break-all">{renderCellValue(item, col)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleRow(item.id)}
                                            className={`h-7 w-7 rounded-full border text-lg leading-none ${
                                                isExpanded
                                                    ? 'border-green-300 bg-green-50 text-green-700'
                                                    : 'border-green-500 bg-green-500 text-white'
                                            }`}
                                            aria-label={isExpanded ? 'Collapse row details' : 'Expand row details'}
                                        >
                                            {isExpanded ? '-' : '+'}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-3 space-y-2 rounded-md bg-slate-50 p-3">
                                            {detailColumns.map((col) => (
                                                <div key={col.key} className="flex items-start justify-between gap-2 text-sm">
                                                    <span className="text-slate-500">{col.label}</span>
                                                    <span className="text-right font-medium text-slate-700 break-all">{renderCellValue(item, col)}</span>
                                                </div>
                                            ))}
                                            {actions && (
                                                <div className="pt-2 flex justify-end gap-2">
                                                    {actions.map((action, index) => {
                                                        const resolvedLabel = typeof action.label === 'function' ? action.label(item) : action.label;
                                                        const resolvedVariant = typeof action.variant === 'function' ? action.variant(item) : action.variant;
                                                        if (action.type === 'link') {
                                                            return (
                                                                <Link key={index} href={action.href(item.id)}>
                                                                    <Button variant={resolvedVariant}>{resolvedLabel}</Button>
                                                                </Link>
                                                            );
                                                        }
                                                        return (
                                                            <Button key={index} onClick={() => action.onClick(item.id)} variant={resolvedVariant}>
                                                                {resolvedLabel}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </>
    );
}
