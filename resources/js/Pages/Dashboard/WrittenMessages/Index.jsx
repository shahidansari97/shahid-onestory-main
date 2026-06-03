import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import ListView from '@/Components/Dashboard/ListView.jsx';
import SelectPublishType from '@/Components/Dashboard/SelectPublishType.jsx';
import SelectStatus from '@/Components/Dashboard/SelectStatus.jsx';
import { useEffect, useState } from 'react';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import { createPortal } from 'react-dom';
import AdminTotalShareCell from '@/Components/Dashboard/AdminTotalShareCell.jsx';

export default function Index() {
    const {
        messages: initialMessages,
        currentPage,
        lastPage,
        statusOptions,
    } = usePage().props;

    const [messages, setMessages] = useState(initialMessages || []);
    const [search, setSearch] = useState('');
    const [pageInput, setPageInput] = useState("");
    const [messagePreviewModal, setMessagePreviewModal] = useState({
        open: false,
        text: '',
    });

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    const closeMessagePreviewModal = () => {
        setMessagePreviewModal({ open: false, text: '' });
    };

    useEffect(() => {
        if (!messagePreviewModal.open) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event) => {
            if (event.key === 'Escape') closeMessagePreviewModal();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [messagePreviewModal.open]);

    const getStatusColor = (statusId) => {
        if (Number(statusId) === 1) return 'bg-green-100 text-green-800 border-green-300';
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    };

    const updatePublishType = async (id, publishType) => {
        await axios.post(route('admin.written-messages.update'), { id, publish_type: publishType });
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, publish_type: publishType } : m)));
    };

    const updateStatus = async (id, status) => {
        await axios.post(route('admin.written-messages.update'), { id, status });
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    };

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            const response = await axios.post(route('admin.written-messages.delete'), { id });
            if (response.data.success) {
                setMessages((prev) => prev.filter((m) => m.id !== id));
            } else {
                alert('Failed to delete: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message. Please try again.');
        }
    };

    const handleFilter = () => {
        const page = pageInput ? Math.max(1, Number(pageInput)) : 1;
        router.get(route('admin.written-messages.all'), { page, search }, { preserveScroll: true });
    };

    const handleClear = () => {
        setSearch('');
        setPageInput('');
        router.get(route('admin.written-messages.all'), {}, { preserveScroll: true });
    };

    const handlePageChange = (page) => {
        router.get(route('admin.written-messages.all'), { page, search }, { preserveScroll: true });
    };

    const getMessagePreview = (message, wordLimit = 5) => {
        const safeMessage = String(message || '').trim();
        if (!safeMessage) return { preview: 'N/A', hasMore: false };
        const words = safeMessage.split(/\s+/);
        if (words.length <= wordLimit) return { preview: safeMessage, hasMore: false };
        return { preview: `${words.slice(0, wordLimit).join(' ')}...`, hasMore: true };
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (m) => m.id,
        },
        {
            key: 'user',
            label: 'User',
            render: (m) => m.user ? `${m.user.name} (${m.user.username || '—'})` : '—',
        },
        {
            key: 'message',
            label: 'Message',
            render: (m) => {
                const { preview, hasMore } = getMessagePreview(m.message);
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-slate-700">{preview}</span>
                        {hasMore && (
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setMessagePreviewModal({ open: true, text: String(m.message || '') })}
                            >
                                View
                            </button>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'publish_type',
            label: 'Publish Type',
            render: (m) => (
                <SelectPublishType
                    value={m.publish_type || 'public'}
                    onChange={(newType) => updatePublishType(m.id, newType)}
                />
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (m) => (
                <SelectStatus
                    options={statusOptions || []}
                    value={m.status || 2}
                    onChange={(newStatus) => updateStatus(m.id, newStatus)}
                    getStatusColor={getStatusColor}
                />
            ),
        },
        {
            key: 'total_share',
            label: 'Total Share',
            render: (m) => (
                <AdminTotalShareCell
                    rowId={m.id}
                    initialValue={m.total_share ?? 0}
                    routeName="admin.written-messages.total-share"
                    onUpdated={(id, total_share) => {
                        setMessages((prev) =>
                            prev.map((row) => (row.id === id ? { ...row, total_share } : row))
                        );
                    }}
                />
            ),
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: (m) => m.created_at ? new Date(m.created_at).toLocaleDateString() : '—',
        },
    ];

    const actions = [
        { label: 'Delete', onClick: deleteMessage, variant: 'danger', type: 'button' },
    ];

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by message, name, username, or email',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
        },
        {
            type: 'number',
            placeholder: 'Page #',
            value: pageInput,
            min: 1,
            onChange: (e) => setPageInput(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
        },
    ];

    return (
        <>
            <Head>
                <style>{`
                    table { table-layout: auto !important; }
                `}</style>
            </Head>
            <AuthenticatedLayout>
                <Wrapper title='Written Stories'>
                    <ListView
                        searchFields={searchFields}
                        onSearch={handleFilter}
                        onClear={handleClear}
                        columns={columns}
                        data={messages}
                        actions={actions}
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={handlePageChange}
                    />
                </Wrapper>

                {messagePreviewModal.open && typeof document !== 'undefined' && createPortal((
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
                        onClick={closeMessagePreviewModal}
                    >
                        <div
                            className="flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
                            style={{
                                width: 'clamp(300px, 88vw, 760px)',
                                height: 'clamp(320px, 62vh, 520px)',
                                maxWidth: '92vw',
                                maxHeight: '78vh',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="border-b border-gray-200 px-4 py-3">
                                <h3 className="text-base font-semibold text-gray-900">Message</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 py-3">
                                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                                    {messagePreviewModal.text}
                                </p>
                            </div>
                            <div className="flex justify-end border-t border-gray-200 px-4 py-3">
                                <button
                                    type="button"
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                    onClick={closeMessagePreviewModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ), document.body)}
            </AuthenticatedLayout>
        </>
    );
}

