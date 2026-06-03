import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Group} from "@/Components/Dashboard/Form.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import SectionBox from '@/Components/Dashboard/SectionBox.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';

export default function Show({poll}) {
    if (!poll || Object.keys(poll).length === 0) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Poll Details</h2>}
            >
                <div className="py-6 px-4">
                    <p className="text-red-600">Poll data is unavailable.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const allVotesData = [];
    if (poll.variants) {
        poll.variants.forEach(variantItem => {
            if (variantItem.answers) {
                variantItem.answers.forEach(answer => {
                    allVotesData.push({
                        ...answer,
                        votedFor: variantItem.statement
                    });
                });
            }
        });
    }

    const allVotesColumns = [
        {
            key: 'user.name',
            label: 'User',
            render: row => row.user ? row.user.name : 'Unknown user'
        },
        {
            key: 'user.email',
            label: 'Email',
            render: row => row.user ? row.user.email : 'N/A'
        },
        {
            key: 'votedFor',
            label: 'Voted For'
        },
        {
            key: 'created_at',
            label: 'Voted At',
            render: row => new Date(row.created_at).toLocaleString()
        }
    ];
    const answerVariantsColumns = [
        {
            key: 'statement',
            label: 'Variant',
            render: variant => variant.statement || 'No variant statement'
        },
        {
            key: 'votes',
            label: 'Votes',
            render: variant => variant.answers ? variant.answers.length : 0
        },
        {
            key: 'users',
            label: 'Users who voted',
            render: variant => {
                if (variant.answers && variant.answers.length > 0) {
                    return variant.answers
                        .map(answer => answer.user ? `${answer.user.name} (${answer.user.email})` : 'Unknown user')
                        .join(', ');
                }
                return 'No votes';
            }
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Poll Details'>
                <SectionBox title="Information">
                    <h3 className="text-2xl font-bold">
                        {poll.statement || 'No statement available'}
                    </h3>
                    <p>
                        <strong>Created
                            At:</strong> {poll.created_at ? new Date(poll.created_at).toLocaleString() : 'N/A'}
                    </p>
                    <p>
                        <strong>Ends
                            At:</strong> {poll.lifetime_ends_in ? new Date(poll.lifetime_ends_in).toLocaleString() : 'N/A'}
                    </p>
                    <p>
                        <strong>Status:</strong> {poll.is_active ? 'Active' : 'Inactive'}
                    </p>
                </SectionBox>
                <SectionBox title="Answer Variants">
                    {poll.variants && poll.variants.length > 0 ? (
                        <ListView
                            onSearch={() => {
                            }}
                            columns={answerVariantsColumns}
                            data={poll.variants}
                        />
                    ) : (
                        <p>No variants available for this poll.</p>
                    )}
                </SectionBox>

                <SectionBox title="All Votes">
                    {allVotesData.length > 0 ? (
                        <ListView
                            onSearch={() => {
                            }}
                            columns={allVotesColumns}
                            data={allVotesData}
                        />
                    ) : (
                        <p>No votes available for this poll.</p>
                    )}
                </SectionBox>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
