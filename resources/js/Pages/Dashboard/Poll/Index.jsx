import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import axios from 'axios';

export default function Index({ auth }) {
    const { polls, flash } = usePage().props;

    const changeStatus = async (pollId, isActive) => {
        try {
            const response = await axios.post(route('poll.change-status', { poll: pollId }), {
                is_active: !isActive
            });
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error changing poll status:', error);
        }
    };

    const deletePoll = async (pollId) => {
        if (window.confirm('Are you sure you want to delete this poll?')) {
            try {
                const response = await axios.post(route('admin.delete.poll'), {
                    poll_id: pollId
                });
                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting poll:', error);
            }
        }
    };

    const pollColumns = [
        { key: 'statement', label: 'Statement' },
        {
            key: 'is_active',
            label: 'Active',
            render: poll => poll.is_active ? 'Yes' : 'No'
        },
        {
            key: 'created_at',
            label: 'Created At',
            render: poll => new Date(poll.created_at).toLocaleDateString()
        },
        {
            key: 'lifetime_ends_in',
            label: 'Ends At',
            render: poll => new Date(poll.lifetime_ends_in).toLocaleDateString()
        },
        {
            key: 'variants',
            label: 'Variants',
            render: poll => (
                <ul>
                    {poll.variants.map(variant => (
                        <li key={variant.id}>{variant.statement}</li>
                    ))}
                </ul>
            )
        },
    ];
    const pollActions = [
        {
            label: 'Show',
            href: id => route('admin.poll.show', { pollId: id }),
            variant: 'success',
            type: 'link'
        },
        {
            label: 'Edit',
            href: id => route('admin.poll.edit', { pollId: id }),
            variant: 'primary',
            type: 'link'
        },
        {
            label: poll => poll.is_active ? 'Deactivate' : 'Activate',
            onClick: id => {
                const poll = polls.find(p => p.id === id);
                changeStatus(id, poll.is_active);
            },
            variant: poll => poll.is_active ? 'warning' : 'primary',
            type: 'button'
        },
        {
            label: 'Delete',
            onClick: id => deletePoll(id),
            variant: 'danger',
            type: 'button'
        },
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='All Polls' message={flash.message}>
                <ListView
                    columns={pollColumns}
                    data={polls}
                    actions={pollActions}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
