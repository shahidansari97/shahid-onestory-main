import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import SelectStatus from "@/Components/Dashboard/SelectStatus.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import ListView from '@/Components/Dashboard/ListView.jsx';
import SectionBox from "@/Components/Dashboard/SectionBox.jsx";

export default function Show({ user }) {
    const { storyStatuses } = usePage().props;
    const [stories, setStories] = useState(user.stories || []);
    const [userData] = useState(user);

    if (!user || Object.keys(user).length === 0) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Details</h2>}
            >
                <div className="py-6 px-4">
                    <p className="text-red-600">User data is unavailable.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

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
                return 'border-danger text-danger';
            default:
                return 'bg-gray-100 border-gray-300 text-';
        }
    };

    const storyColumns = [
        {
            key: 'thumbnail',
            label: 'Thumbnail',
            render: story => (
                <img src={story.thumbnail} alt={story?.name} className="w-16 h-16 object-cover rounded" />
            )
        },
        { key: 'name', label: 'Title' },
        {
            key: 'created_at',
            label: 'Created Date',
            render: story => new Date(story.created_at).toLocaleDateString()
        },
        {
            key: 'story_status_id',
            label: 'Status',
            render: story => (
                <SelectStatus
                    options={storyStatuses}
                    value={story.story_status_id}
                    onChange={(newStatusId) => updateStoryStatus(story.id, newStatusId)}
                    getStatusColor={getStatusColor}
                />
            )
        },
        {
            key: 'actions',
            label: 'Action',
            render: story => (
                <Button onClick={() => deleteStory(story.id)} variant="danger">
                    Delete
                </Button>
            )
        }
    ];

    const sentGiftsColumns = [
        { key: 'gift.name', label: 'Gift', render: tx => tx.gift.name },
        {
            key: 'recipientInfo',
            label: 'Recipient',
            render: tx => `${tx.recipient?.username} (${tx.recipient?.email})`
        },
        {
            key: 'created_at',
            label: 'Date',
            render: tx => new Date(tx.created_at).toLocaleString()
        }
    ];

    const receivedGiftsColumns = [
        { key: 'gift.name', label: 'Gift', render: tx => tx.gift.name },
        {
            key: 'senderInfo',
            label: 'Sender',
            render: tx => `${tx.sender?.username} (${tx.sender?.email})`
        },
        {
            key: 'created_at',
            label: 'Date',
            render: tx => new Date(tx.created_at).toLocaleString()
        }
    ];

    const topUpsColumns = [
        {
            key: 'funds',
            label: 'Amount',
            render: topUp => `$${topUp.funds}`
        },
        { key: 'coins', label: 'Coins' },
        {
            key: 'created_at',
            label: 'Date',
            render: topUp => new Date(topUp.created_at).toLocaleString()
        }
    ];

    const donationsColumns = [
        {
            key: 'funds',
            label: 'Amount',
            render: donation => `$${donation.funds}`
        },
        {
            key: 'variant.statement',
            label: 'Variant',
            render: donation => donation.variant?.statement
        },
        {
            key: 'created_at',
            label: 'Date',
            render: donation => new Date(donation.created_at).toLocaleString()
        }
    ];
    const userVotesColumns = [
        {
            key: 'question',
            label: 'Question',
            render: answer => answer.variant.question.statement
        },
        {
            key: 'selectedVariant',
            label: 'Selected Variant',
            render: answer => answer.variant.statement
        },
        {
            key: 'voted_at',
            label: 'Voted At',
            render: answer => new Date(answer.created_at).toLocaleString()
        }
    ];
    const withdrawalsColumns = [
        {
            key: 'amount',
            label: 'Amount',
            render: withdrawal => `$${withdrawal.amount}`
        },
        {
            key: 'stripe_transaction_id',
            label: 'Transaction id',
            render: withdrawal => `${withdrawal.stripe_transaction_id}`
        },
        {
            key: 'created_at',
            label: 'Date',
            render: withdrawal => new Date(withdrawal.created_at).toLocaleString()
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='User Details'>
                <div className="p-1.5 box flex flex-col box--stacked">
                    <div
                        className="h-48 relative w-full rounded-[0.6rem] bg-gradient-to-b from-theme-1/95 to-theme-2/95">
                        <div
                            className="w-full h-full relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem] after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]"></div>
                        <div className="absolute inset-x-0 top-0 w-32 h-32 mx-auto mt-24">
                            <div
                                className="w-full h-full overflow-hidden border-[6px] box border-white rounded-full image-fit">
                                <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-[0.6rem] bg-slate-50 pt-12 pb-6 dark:bg-darkmode-500">
                        <div className="flex items-center justify-center text-xl font-medium">{userData.username}</div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-2 gap-x-5 mt-2.5">
                            <div className="flex items-center text-slate-500">
                                Balance: {userData.balance !== undefined ? `$ ${userData.balance}` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <SectionBox title="Stories">
                    <ListView
                        columns={storyColumns}
                        data={stories}
                    />
                </SectionBox>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-6 mt-5">
                    <SectionBox title="Sent Gifts">
                        <ListView
                            columns={sentGiftsColumns}
                            data={userData.gift_transactions_sent || []}
                        />
                    </SectionBox>
                    <SectionBox title="Received Gifts">
                        <ListView
                            columns={receivedGiftsColumns}
                            data={userData.gift_transactions_received || []}
                        />
                    </SectionBox>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-6 mt-5">
                    <SectionBox title="Balance Top-Ups">
                        <ListView
                            columns={topUpsColumns}
                            data={userData.top_ups || []}
                        />
                    </SectionBox>
                    <SectionBox title="Withdrawals">
                        <ListView
                            columns={withdrawalsColumns}
                            data={userData.withdrawals || []}
                        />
                    </SectionBox>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-6 mt-5">
                    <SectionBox title=" User Votes">
                        <ListView
                            columns={userVotesColumns}
                            data={userData.answers || []}
                        />
                    </SectionBox>
                    <SectionBox title="Donations">
                        <ListView
                            columns={donationsColumns}
                            data={userData.donations || []}
                        />
                    </SectionBox>
                </div>


                <SectionBox title="Profile" className="col-md-6 rounded-lg shadow-sm p-6 mt-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="flex flex-col gap-8">
                            <div>
                                <div className="text-xs uppercase text-slate-500">Personal Data</div>
                                <div className="mt-3.5">
                                    <div className="flex items-center">Name: {userData.name || ''}</div>
                                    <div className="flex items-center mt-3">Email: {userData.email || ''}</div>
                                    <div className="flex items-center mt-3">Generation: {userData.generation || ''}</div>
                                    <div className="flex items-center mt-3">World
                                        Message: {userData.world_message || ''}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs uppercase text-slate-500">Address</div>
                                <div className="mt-3.5">
                                    <div className="flex items-center">Country: {userData.country || ''}</div>
                                    <div className="flex items-center mt-3">City: {userData.city || ''}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs uppercase text-slate-500">Other</div>
                                <div className="mt-3.5">
                                    <div className="flex items-center">
                                        Preferences: {userData.preferences ? userData.preferences.join(', ') : ''}
                                    </div>
                                    <div className="flex items-center mt-3">
                                        Created
                                        At: {userData.created_at ? new Date(userData.created_at).toLocaleString() : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div>
                                <div className="text-xs uppercase text-slate-500">Creator Data</div>

                                <div className="mt-3.5 space-y-3">
                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">Phone:</span>
                                        {userData.phone_number ? userData.phone_number : 'Phone Not available'}
                                    </div>

                                    <div className="text-xs uppercase text-slate-500 mt-6">Social Links</div>

                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">YouTube:</span>
                                        {userData.youtube_channel ? userData.youtube_channel : 'YouTube Not available'}
                                    </div>

                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">TikTok:</span>
                                        {userData.tiktok_profile ? userData.tiktok_profile : 'TikTok Not available'}
                                    </div>

                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">Instagram:</span>
                                        {userData.instagram_username ? userData.instagram_username : 'Instagram Not available'}
                                    </div>

                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">Other Social Links:</span>
                                        {userData.other_social_links ? userData.other_social_links : 'Social Not available'}
                                    </div>

                                    <div className="flex items-center mt-3">
                                        <span className="font-medium mr-2">Total Audience Size:</span>
                                        {userData.total_audience_size ? userData.total_audience_size : '0'}
                                    </div>

                                    <div className="flex  items-start mt-3">
                                        <span className="font-medium mr-2">Description:</span>
                                        {userData.content_description ? userData.content_description : 'Description Not available'}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </SectionBox>



            </Wrapper>
        </AuthenticatedLayout>
    );
}
