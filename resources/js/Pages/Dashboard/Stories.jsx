import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {router, usePage} from '@inertiajs/react';
import axios from 'axios';
import Pagination from "@/Components/Dashboard/Pagination.jsx";
import { Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import Select from '@/Components/Dashboard/Select.jsx';

export default function Stories({ auth }) {
    const { stories: initialStories, currentPage, lastPage, totalStories, storyStatuses } = usePage().props;
    const [stories, setStories] = useState(initialStories);

    const deleteStory = async (storyId) => {
        if (confirm('Are you sure you want to delete this story?')) {
            try {
                const response = await axios.post(route('admin.stories.delete', { id: storyId }));

                if (response.status === 200) {
                    setStories(stories.filter(story => story.id !== storyId));
                }
            } catch (error) {
                console.error('Error deleting story:', error);
            }
        }
    };

    const updateStoryStatus = async (storyId, statusId) => {
        try {
            const response = await axios.post(route('admin.stories.story.status-update'), {
                story_id: storyId,
                story_status_id: statusId,
            });

            if (response.status === 200) {
                setStories(stories.map(story =>
                    story.id === storyId ? { ...story, story_status_id: parseInt(statusId) } : story
                ));
            }
        } catch (error) {
            console.error('Error updating story status:', error);
        }
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return 'border-warning text-warning';
            case 2:
                return 'border-success text-success';
            case 3:
                return 'border-danger  text-danger';
            default:
                return 'bg-gray-100 border-gray-300 text-';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">All Stories</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Thumbnail</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Title</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Author</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500">Created Date</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500 text-center">Status</td>
                            <td className="px-5 py-4 font-medium border-t bg-slate-50 text-slate-500 text-center">Action</td>
                        </tr>
                        </thead>
                        <tbody>
                        {stories.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-5 py-3 text-center">No stories found.</td>
                            </tr>
                        ) : (
                            stories.map((story) => (
                                <tr key={story.id} className={'border-b'}>
                                    <td className="px-5 py-4">
                                        <img src={story.thumbnail} alt={story.name} className="w-16 h-16 object-cover rounded"/>
                                    </td>
                                    <td className="px-5 py-4">{story.name}</td>
                                    <td className="px-5 py-4">{story.author.name}</td>
                                    <td className="px-5 py-4">{new Date(story.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 text-center">
                                        <Select
                                            options={storyStatuses}
                                            value={story.story_status_id}
                                            onChange={(newStatusId) => updateStoryStatus(story.id, newStatusId)}
                                            getStatusColor={getStatusColor}
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Button
                                            onClick={() => deleteStory(story.id)}
                                            variant={'danger'}
                                        >
                                            Delete
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
                        router.get(route('admin.stories.all', { page }), {}, {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
