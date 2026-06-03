import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { InputLabel, TextInput, InputError } from '@/Components/UI/Form';

export default function ReplaceVideo({ auth, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        email: '',
        video: null,
        delete_old: false,
    });

    const [preview, setPreview] = useState(null);
    const [videoSelected, setVideoSelected] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('File selected:', file); // Debug log
        if (file) {
            setData('video', file);
            setVideoSelected(true);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreview(url);
            console.log('Video selected, button should appear'); // Debug log
        } else {
            setVideoSelected(false);
            setPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.stories.replace-video'), {
            forceFormData: true,
            onSuccess: () => {
                reset('video');
                setPreview(null);
                setVideoSelected(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Replace User Video</h2>}
        >
            <Head title="Replace User Video" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {flash?.success && (
                                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                    <h3 className="font-bold mb-2">✓ Success!</h3>
                                    <p className="mb-1">{flash.success.message}</p>
                                    <p className="text-sm mb-1"><strong>User:</strong> {flash.success.user}</p>
                                    <p className="text-sm mb-1"><strong>Story ID:</strong> {flash.success.story_id}</p>
                                    <p className="text-sm mb-1"><strong>Old Video:</strong> {flash.success.old_video}</p>
                                    <p className="text-sm mb-1"><strong>New Video:</strong> {flash.success.new_video}</p>
                                    <p className="text-sm">
                                        <strong>New Video URL:</strong>{' '}
                                        <a href={flash.success.new_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {flash.success.new_video_url}
                                        </a>
                                    </p>
                                </div>
                            )}

                            {flash?.error && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {flash.error}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="user_id" value="User ID (Optional)" />
                                    <TextInput
                                        id="user_id"
                                        type="number"
                                        name="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Enter user ID"
                                    />
                                    <InputError message={errors.user_id} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="email" value="User Email (Optional)" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Enter user email"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Provide either User ID or Email</p>
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="video" value="New Video File" />
                                    <input
                                        id="video"
                                        type="file"
                                        name="video"
                                        accept="video/mp4,video/mov,video/avi,video/flv,video/mkv"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    <InputError message={errors.video} className="mt-2" />
                                    {preview && (
                                        <div className="mt-2">
                                            <video src={preview} controls className="max-w-full h-auto rounded" style={{ maxHeight: '300px' }}>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="delete_old"
                                            checked={data.delete_old}
                                            onChange={(e) => setData('delete_old', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Delete old video file</span>
                                    </label>
                                </div>

                                {/* Save Button - Always visible */}
                                <div className="mt-8 pt-6 border-t-2 border-gray-300">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            {videoSelected || preview ? (
                                                <span className="text-green-600 font-semibold">✓ Video file selected</span>
                                            ) : (
                                                <span className="text-gray-500">No video file selected</span>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing || !videoSelected || !preview}
                                            style={{
                                                backgroundColor: processing || !videoSelected || !preview ? '#9CA3AF' : '#10B981',
                                                minWidth: '200px',
                                                minHeight: '50px'
                                            }}
                                            className={`
                                                inline-flex items-center justify-center px-12 py-4 
                                                border-2 border-transparent 
                                                rounded-lg font-bold text-lg text-white uppercase tracking-wide 
                                                focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 
                                                transition ease-in-out duration-150 shadow-2xl
                                                ${processing || !videoSelected || !preview 
                                                    ? 'cursor-not-allowed opacity-70' 
                                                    : 'cursor-pointer opacity-100 hover:shadow-2xl hover:scale-105 active:scale-95'
                                                }
                                            `}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    {videoSelected || preview ? 'SAVE VIDEO' : 'SELECT VIDEO FIRST'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
