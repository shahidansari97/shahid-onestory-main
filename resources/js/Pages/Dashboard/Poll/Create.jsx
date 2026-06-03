import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Create({ auth, allVariants }) {
    const [formData, setFormData] = useState({
        statement: '',
        lifetime_ends_in: '',
        variants: [],
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { props } = usePage();
    const message = props.flash?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleVariantsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prevState => ({
            ...prevState,
            variants: selectedOptions
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0];

        if (!formData.statement) {
            setErrorMessage('Statement is empty.');
            return;
        }

        if (formData.variants.length === 0) {
            setErrorMessage('At least one variant must be selected.');
            return;
        }

        if (!formData.lifetime_ends_in) {
            setErrorMessage('Lifetime ends in must be set.');
            return;
        }

        if (formData.lifetime_ends_in < today) {
            setErrorMessage('Lifetime ends in cannot be earlier than today.');
            return;
        }

        setErrorMessage('');

        const form = new FormData();
        form.append('statement', formData.statement);
        form.append('lifetime_ends_in', formData.lifetime_ends_in);

        formData.variants.forEach((variantId, index) => {
            form.append(`variants[${index}]`, variantId);
        });

        router.post(route('admin.poll.store'), form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Create a New Poll' message={message}>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Poll Statement">
                        <InputBox
                            label="Statement"
                            name="statement"
                            placeholder="What do you want to vote on?"
                            value={formData.statement}
                            onChange={handleChange}
                            required
                        />
                    </Group>

                    <Group title="Lifetime Ends In">
                        <InputBox
                            label="Lifetime Ends In"
                            name="lifetime_ends_in"
                            type="date"
                            value={formData.lifetime_ends_in}
                            onChange={handleChange}
                            required
                        />
                    </Group>

                    <Group title="Variants">
                        <label className="block mb-2">Select Variants</label>
                        <select
                            multiple
                            name="variants"
                            value={formData.variants}
                            onChange={handleVariantsChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {allVariants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.statement}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</p>
                    </Group>

                    {errorMessage && (
                        <Alert variant="danger">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button type="submit" variant={'success'}>Create Poll</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
