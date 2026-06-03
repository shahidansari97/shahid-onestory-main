import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Admin-only: view / set / reset total_share (Delete sets count to 0 only).
 * Uses inline colors so labels stay visible with @tailwindcss/forms and admin table styles.
 */
export default function AdminTotalShareCell({ rowId, initialValue = 0, routeName, onUpdated }) {
    const [value, setValue] = useState(String(Number(initialValue) || 0));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(String(Number(initialValue) || 0));
    }, [rowId, initialValue]);

    const persist = async (next) => {
        const n = Math.max(0, Math.min(99_999_999, Math.floor(Number(next) || 0)));
        setSaving(true);
        try {
            await axios.post(route(routeName), { id: rowId, total_share: n });
            setValue(String(n));
            onUpdated?.(rowId, n);
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || 'Failed to update share count.');
        } finally {
            setSaving(false);
        }
    };

    const btnLayout =
        'inline-flex h-7 shrink-0 items-center justify-center rounded px-2.5 text-xs font-semibold leading-normal shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <div className="flex flex-nowrap items-center gap-1.5">
            <input
                type="number"
                min={0}
                max={99_999_999}
                value={value}
                disabled={saving}
                onChange={(e) => setValue(e.target.value)}
                className="h-7 w-[4.25rem] min-w-0 rounded border border-slate-300 bg-white px-1.5 py-0 text-xs text-slate-900 tabular-nums"
            />
            <button
                type="button"
                disabled={saving}
                onClick={() => persist(value)}
                className={btnLayout}
                style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: '1px solid #047857',
                }}
            >
                Update
            </button>
            <button
                type="button"
                disabled={saving}
                onClick={() => persist(0)}
                className={btnLayout}
                style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    border: '1px solid #b45309',
                }}
            >
                Delete
            </button>
        </div>
    );
}
