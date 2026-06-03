import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import axios from 'axios';

export default function Index({ auth }) {
    const { variants, flash } = usePage().props;

    const deleteVariant = async (variantId) => {
        if (window.confirm('Are you sure you want to delete this variant?')) {
            try {
                const response = await axios.post(route('admin.delete.variant'), {
                    variant_id: variantId
                });

                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting variant:', error);
            }
        }
    };

    const columns = [
        { key: 'statement', label: 'Statement' },
        {
            key: 'created_at',
            label: 'Created At',
            render: variant => new Date(variant.created_at).toLocaleDateString()
        },
        { key: 'funds', label: 'Balance' },
        { key: 'target', label: 'Target' },
    ];

    const actions = [
        {
            label: 'Show',
            href: id => route('admin.variant.show', { variantId: id }),
            variant: 'success',
            type: 'link'
        },
        {
            label: 'Edit',
            href: id => route('admin.variant.edit', { variantId: id }),
            variant: 'primary',
            type: 'link'
        },
        {
            label: 'Delete',
            onClick: id => deleteVariant(id),
            variant: 'danger',
            type: 'button'
        },
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='All variants' message={flash.message}>
                <ListView
                    columns={columns}
                    data={variants}
                    actions={actions}
                />
            </Wrapper>
        </AuthenticatedLayout>
    );
}
