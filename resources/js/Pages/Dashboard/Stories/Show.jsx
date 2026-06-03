import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Button, Alert, Group } from "@/Components/Dashboard/Form.jsx";
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import SelectStatus from '@/Components/Dashboard/SelectStatus.jsx';

export default function Show({ story, storyStatuses, categories }) {
    const { props } = usePage();
    const message = props.flash?.message;
    const error = props.flash?.error;

    const deleteStory = async () => {
        if (confirm('Are you sure you want to delete this story?')) {
            try {
                const response = await axios.post(route('admin.stories.delete'), { id: story.id });
                if (response.status === 200) {
                    router.get(route('admin.stories.all'));
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const updateStoryStatus = async (statusId) => {
        try {
            const response = await axios.post(route('admin.stories.story.status-update'), {
                story_id: story.id,
                story_status_id: statusId,
            });
            if (response.status === 200) {
                router.reload(); // Оновлюємо сторінку після зміни статусу
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return 'border-warning text-warning';
            case 2:
                return 'border-success text-success';
            case 3:
                return 'border-danger text-danger';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-500';
        }
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='View Story'>
                <div className="grid grid-cols-12 gap-y-7 gap-x-6 mt-3.5">
                    <div className="col-span-12 xl:col-span-8">
                        <div className="flex flex-col gap-y-7">
                            <video
                                preload="auto"
                                controls={true}
                                poster={story?.thumbnail}
                            >
                                <source src={story?.src} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>

                        </div>
                    </div>
                    <div className="relative col-span-12 row-start-1 xl:col-start-9 xl:col-span-4">
                        <div className="sticky flex flex-col top-[6.2rem] gap-y-7">
                            <div className="p-5 box box--stacked">
                                <Group title="Story Details">
                                    <p><strong>Name:</strong> {story?.name ?? 'N/A'}</p>
                                    <p><strong>Categories:</strong> {story?.categories?.join(', ') ?? 'N/A'}</p>
                                    <p><strong>Status:</strong></p>
                                    <SelectStatus
                                        options={storyStatuses}
                                        value={story?.story_status_id}
                                        onChange={updateStoryStatus}
                                        getStatusColor={getStatusColor}
                                    />
                                </Group>
                                <Group title="Author Details">
                                    <p><strong>Name:</strong> {story?.user?.name ?? 'N/A'}</p>
                                </Group>
                                <Button onClick={deleteStory} variant="danger">
                                    Delete Story
                                </Button>
                            </div>
                            {message && (
                                <Alert variant="success">
                                    {message}
                                </Alert>
                            )}
                            {error && (
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col col-span-12 gap-y-7 lg:col-span-9 xl:col-span-8">
                </div>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
