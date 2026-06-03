import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router, Link, Head } from '@inertiajs/react';
import axios from 'axios';
import ListView from '@/Components/Dashboard/ListView.jsx';
import SelectPublishType from '@/Components/Dashboard/SelectPublishType.jsx';
import SelectStatus from '@/Components/Dashboard/SelectStatus.jsx';
import { useState, useEffect } from 'react';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import AudioPlayer from '@/Components/Audio/AudioPlayer';
import AdminTotalShareCell from '@/Components/Dashboard/AdminTotalShareCell.jsx';

export default function Index() {
    const { recordings: initialRecordings, currentPage, lastPage, totalRecordings, statusOptions } = usePage().props;
    const [recordings, setRecordings] = useState(initialRecordings || []);
    const [search, setSearch] = useState('');
    const [pageInput, setPageInput] = useState("");

    useEffect(() => {
        setRecordings(initialRecordings || []);
    }, [initialRecordings]);

    const updateRecordingPublishType = async (recordingId, publishType) => {
        try {
            const response = await axios.post(route('admin.spoken-stories.update'), {
                id: recordingId,
                publish_type: publishType,
            });

            if (response.status === 200) {
                setRecordings(recordings.map(recording =>
                    recording.id === recordingId ? { ...recording, publish_type: publishType } : recording
                ));
            }
        } catch (error) {
            console.error('Error updating spoken story:', error);
        }
    };

    const updateRecordingStatus = async (recordingId, statusId) => {
        try {
            const response = await axios.post(route('admin.spoken-stories.update'), {
                id: recordingId,
                status: statusId,
            });

            if (response.status === 200) {
                setRecordings(recordings.map(recording =>
                    recording.id === recordingId ? { ...recording, status: parseInt(statusId) } : recording
                ));
            }
        } catch (error) {
            console.error('Error updating spoken story status:', error);
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
        if (confirm('Are you sure you want to delete this spoken story?')) {
            try {
                const response = await axios.post(route('admin.spoken-stories.delete'), {
                    id: recordingId
                });

                if (response.status === 200) {
                    setRecordings(recordings.filter(recording => recording.id !== recordingId));
                }
            } catch (error) {
                console.error('Error deleting spoken story:', error);
            }
        }
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

    const formatDuration = (seconds) => {
        const s = Number(seconds);
        if (!Number.isFinite(s) || s <= 0) return 'N/A';
        const total = Math.max(0, Math.floor(s));
        const mins = Math.floor(total / 60);
        const secs = total % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
                                download={recording.filename || undefined}
                                className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                                title="Click to download audio"
                            >
                                {recording.short_filename || recording.filename || 'Audio'}
                            </a>
                        ) : (
                            <span className="text-sm text-gray-400 truncate max-w-[200px]">
                                {recording.short_filename || recording.filename || 'No file'}
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
                            onError={(e) => { e.target.src = '/img/avatar.png'; }}
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
                const { preview } = getMessagePreview(fullMessage, 3);
                return (
                    <div className="max-w-[320px] text-sm text-gray-700" title={fullMessage}>
                        {preview}
                    </div>
                );
            }
        },
        {
            key: 'duration',
            label: 'Duration',
            render: recording => formatDuration(recording.duration),
        },
        {
            key: 'publish_type',
            label: 'Publish Type',
            render: recording => (
                <SelectPublishType
                    value={recording.publish_type || 'private'}
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
            key: 'total_share',
            label: 'Total Share',
            render: (recording) => (
                <AdminTotalShareCell
                    rowId={recording.id}
                    initialValue={recording.total_share ?? 0}
                    routeName="admin.spoken-stories.total-share"
                    onUpdated={(id, total_share) => {
                        setRecordings((prev) =>
                            prev.map((r) => (r.id === id ? { ...r, total_share } : r))
                        );
                    }}
                />
            ),
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: recording => recording?.created_at ? new Date(recording.created_at).toLocaleDateString() : 'N/A'
        },
    ];

    const recordingActions = [
        { label: 'Delete', onClick: deleteRecording, variant: 'danger', type: 'button' },
    ];

    const searchFields = [
        {
            type: 'text',
            placeholder: 'Search by message, user name, username, or email',
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

    const handleFilter = () => {
        let pageNum = 1;
        if (pageInput && !isNaN(Number(pageInput))) {
            pageNum = Math.max(1, Number(pageInput));
        }
        router.get(route('admin.spoken-stories.all'), { page: pageNum, search }, { preserveScroll: true });
    };

    const handlePageChange = (page) => {
        router.get(route('admin.spoken-stories.all'), { page, search }, { preserveScroll: true });
    };

    return (
        <>
            <Head>
                <title>Spoken Stories</title>
            </Head>
            <AuthenticatedLayout>
                <Wrapper title={`Spoken Stories (${totalRecordings || 0})`}>
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
            </AuthenticatedLayout>
        </>
    );
}

