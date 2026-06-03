import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router, Link, Head } from '@inertiajs/react';
import axios from 'axios';
import ListView from '@/Components/Dashboard/ListView.jsx';
import SelectPublishType from '@/Components/Dashboard/SelectPublishType.jsx';
import SelectStatus from '@/Components/Dashboard/SelectStatus.jsx';
import { useState, useEffect } from 'react';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import AudioPlayer from '@/Components/Audio/AudioPlayer';
import { FiEye } from 'react-icons/fi';
import { createPortal } from 'react-dom';

export default function Index({ auth }) {
    const { recordings: initialRecordings, currentPage, lastPage, totalRecordings, statusOptions } = usePage().props;
    const [recordings, setRecordings] = useState(initialRecordings);
    const [search, setSearch] = useState('');
    const [pageInput, setPageInput] = useState("");
    const [messagePreviewModal, setMessagePreviewModal] = useState({
        open: false,
        text: '',
    });

    const closeMessagePreviewModal = () => {
        setMessagePreviewModal({ open: false, text: '' });
    };

    useEffect(() => {
        setRecordings(initialRecordings);
        // Debug: Log recordings data
        if (initialRecordings && initialRecordings.length > 0) {
            console.log('Audio Recordings Data:', initialRecordings);
            initialRecordings.forEach((recording, index) => {
                console.log(`Recording ${index + 1}:`, {
                    id: recording.id,
                    filename: recording.filename,
                    url: recording.url,
                    path: recording.path,
                    duration: recording.duration
                });
            });
        }
    }, [initialRecordings]);

    useEffect(() => {
        if (!messagePreviewModal.open) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMessagePreviewModal();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [messagePreviewModal.open]);

    const updateRecordingPublishType = async (recordingId, publishType) => {
        try {
            const response = await axios.post(route('admin.audio-recordings.update'), {
                id: recordingId,
                publish_type: publishType,
            });

            if (response.status === 200) {
                setRecordings(recordings.map(recording =>
                    recording.id === recordingId ? { ...recording, publish_type: publishType } : recording
                ));
            }
        } catch (error) {
            console.error('Error updating audio recording:', error);
        }
    };

    const updateRecordingStatus = async (recordingId, statusId) => {
        try {
            const response = await axios.post(route('admin.audio-recordings.update'), {
                id: recordingId,
                status: statusId,
            });

            if (response.status === 200) {
                setRecordings(recordings.map(recording =>
                    recording.id === recordingId ? { ...recording, status: parseInt(statusId) } : recording
                ));
            }
        } catch (error) {
            console.error('Error updating audio recording status:', error);
        }
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return 'border-success text-success';
            case 2:
                return 'border-warning text-warning';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-500';
        }
    };

    const deleteRecording = async (recordingId) => {
        if (confirm('Are you sure you want to delete this audio recording?')) {
            try {
                const response = await axios.post(route('admin.audio-recordings.delete'), {
                    id: recordingId
                });

                if (response.status === 200) {
                    setRecordings(recordings.filter(recording => recording.id !== recordingId));
                }
            } catch (error) {
                console.error('Error deleting audio recording:', error);
            }
        }
    };

    // const handleFilter = () => {
    //     router.get(route('admin.audio-recordings.all'), {
    //         search,
    //         page: 1
    //     }, {
    //         preserveScroll: true,
    //     });
    // };
    const handleFilter = () => {
        let pageNum = 1;
        if (pageInput && !isNaN(Number(pageInput))) {
            pageNum = Math.max(1, Number(pageInput));
        }
        router.get(route('admin.audio-recordings.all'), {
            search,
            page: pageNum,
        }, {
            preserveScroll: true,
        });
    };

    const recordingColumns = [
        {
            key: 'filename',
            label: 'File',
            render: recording => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-blue-500 flex-shrink-0"
                        >
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>

                        {recording.url ? (
                            <a
                                href={recording.url}
                                download={recording.filename}
                                className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                                title="Click to download audio"
                            >
                                {recording.short_filename}
                            </a>
                        ) : (
                            <span className="text-sm text-gray-400 truncate max-w-[200px]">
                                {recording.short_filename}
                            </span>
                        )}
                    </div>

                    {recording.url ? (
                        <AudioPlayer
                            src={recording.url}
                            duration={recording.duration ? parseFloat(recording.duration) : null}
                            compact={true}
                        />
                    ) : (
                        <div className="text-xs text-gray-400">
                            No audio URL available
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'user.avatar',
            label: 'Avatar',
            render: recording => {
                if (!recording.user) return 'N/A';
                const userAvatar = recording.user.avatar || '/img/avatar.png';
                return (
                    <Link href={route('admin.users.show', { id: recording.user.id })}>
                        <img 
                            src={userAvatar} 
                            alt={recording.user.name || recording.user.username || 'User'}
                            className="w-16 max-h-16 object-cover rounded"
                            onError={(e) => e.target.src = '/img/avatar.png'}
                        />
                    </Link>
                );
            }
        },
        {
            key: 'user.name',
            label: 'Name',
            render: recording => {
                if (!recording.user) return 'N/A';
                const userName = recording.user.name || recording.user.username || 'N/A';
                return (
                    <Link 
                        href={route('admin.users.show', { id: recording.user.id })}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {userName}
                    </Link>
                );
            }
        },
        {
            key: 'user.email',
            label: 'Email',
            render: recording => {
                if (!recording.user) return 'N/A';
                const email = recording.user.email || 'N/A';
                return (
                    <span className="inline-block min-w-[220px] text-sm text-gray-700 whitespace-nowrap" title={email}>
                        {email}
                    </span>
                );
            }
        },
        {
            key: 'message',
            label: 'Message',
            render: recording => {
                const fullMessage = recording.message || '';
                const { preview, hasMore } = getMessagePreview(fullMessage, 3);

                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                            {preview}
                        </span>
                        {fullMessage && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMessagePreviewModal({ open: true, text: fullMessage });
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title={hasMore ? 'View full message' : 'View message'}
                                aria-label="View full message"
                            >
                                <FiEye size={16} />
                            </button>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'duration',
            label: 'Duration',
            render: recording => recording.duration ? `${Math.round(recording.duration)}s` : 'N/A'
        },
        {
            key: 'recording_type',
            label: 'Recording Type',
            render: recording => {
                const type = String(recording.recording_type || '').toLowerCase();
                if (type === 'quick') return 'How are you doing message';
                if (type === 'story') return 'Message to the world';
                return 'N/A';
            }
        },
        {
            key: 'user.roles',
            label: 'Roles',
            render: recording => {
                if (!recording.user || !recording.user.roles || recording.user.roles.length === 0) return 'user';
                const roles = recording.user.roles || recording.user.roles || 'user';
                return (
                    <span className="text-sm text-gray-700">
                        {roles}
                    </span>
                );
            }
        },
        {
            key: 'publish_type',
            label: 'Visibility',
            render: recording => (
                <SelectPublishType
                    value={recording.publish_type || 'public'}
                    onChange={(newPublishType) => updateRecordingPublishType(recording.id, newPublishType)}
                />
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: recording => (
                <SelectStatus
                    options={statusOptions || []}
                    value={recording.status || 1}
                    onChange={(newStatusId) => updateRecordingStatus(recording.id, newStatusId)}
                    getStatusColor={getStatusColor}
                />
            )
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: recording => new Date(recording.created_at).toLocaleDateString()
        },
    ];

    const recordingActions = [
        { label: 'Delete', onClick: deleteRecording, variant: 'danger', type: 'button' },
    ];

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by filename, name, username, or email',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: "border px-3 py-2 rounded mr-2",
        },
        {
            type: 'number',
            placeholder: 'Page #',
            value: pageInput,
            min: 1,
            onChange: (e) => setPageInput(e.target.value),
            className: "!border !border-slate-500 px-3 py-2 rounded mr-2 focus:!border-blue-500 focus:!ring-2",
            // className: 'border px-3 py-2 rounded mr-2',
        },
    ];

    const handlePageChange = (page) => {
        router.get(route('admin.audio-recordings.all'), { page, search }, {
            preserveScroll: true,
        });
    };

    const getMessagePreview = (message, wordLimit = 3) => {
        const safeMessage = String(message || '').trim();
        if (!safeMessage) {
            return { preview: 'N/A', hasMore: false };
        }

        const words = safeMessage.split(/\s+/);
        if (words.length <= wordLimit) {
            return { preview: safeMessage, hasMore: false };
        }

        return {
            preview: `${words.slice(0, wordLimit).join(' ')}...`,
            hasMore: true,
        };
    };

    return (
        <>
            <Head>
                <style>{`
                    .d-flex.float-left {
                        float: none !important;
                        display: inline-flex !important;
                    }

                    table {
                        table-layout: auto !important;
                    }
                `}</style>
            </Head>

            <AuthenticatedLayout>
                <Wrapper title='Audio Recordings'>
                    <ListView
                        searchFields={searchFields}
                        onSearch={handleFilter}
                        columns={recordingColumns}
                        data={recordings}
                        actions={recordingActions}
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
