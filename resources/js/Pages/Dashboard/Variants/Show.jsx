import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Group} from "@/Components/Dashboard/Form.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import ListView from '@/Components/Dashboard/ListView.jsx';
import SectionBox from "@/Components/Dashboard/SectionBox.jsx";

export default function Show({variant}) {
    if (!variant || Object.keys(variant).length === 0) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Variant Details</h2>}
            >
                <div className="py-6 px-4">
                    <p className="text-red-600">Variant data is unavailable.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const allVotesData = [];
    if (variant.answers) {
        variant.answers.forEach(answer => {
            allVotesData.push({
                ...answer,
                votedFor: variant.statement
            });
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

    const donationsColumns = [
        {
            key: 'user.name',
            label: 'User',
            render: donation => donation.user ? donation.user.name : 'Unknown user'
        },
        {
            key: 'user.email',
            label: 'Email',
            render: donation => donation.user ? donation.user.email : 'N/A'
        },
        {
            key: 'funds',
            label: 'Amount',
            render: donation => `$${donation.funds}`
        },
        {
            key: 'created_at',
            label: 'Date',
            render: donation => new Date(donation.created_at).toLocaleDateString()
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Variant Details'>
                <SectionBox title="Information">
                    <h3 className="text-2xl font-bold">{variant.statement || 'No statement available'}</h3>
                    <p>
                        <strong>Created
                            At:</strong> {variant.created_at ? new Date(variant.created_at).toLocaleString() : 'N/A'}
                    </p>
                    <p>
                        <strong>Balance:</strong> ${variant.funds || '0'}
                    </p>
                    <p>
                        <strong>Target:</strong> ${variant.target || 'N/A'}
                    </p>
                </SectionBox>
                <SectionBox title="All Votes">
                    <ListView
                        onSearch={() => {
                        }}
                        columns={allVotesColumns}
                        data={allVotesData}
                    />
                </SectionBox>
                <SectionBox title="Donations">
                    <ListView
                        onSearch={() => {
                        }}
                        columns={donationsColumns}
                        data={variant.donations}
                    />
                </SectionBox>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
