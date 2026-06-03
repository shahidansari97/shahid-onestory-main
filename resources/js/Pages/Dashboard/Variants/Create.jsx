import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Create({ auth, questions }) {
    const [formData, setFormData] = useState({
        statement: '',
        target : '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { flash } = usePage().props;
    const message = flash?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.statement) {
            setErrorMessage('Statement is empty.');
            return;
        }

        if (!formData.target  || isNaN(formData.target ) || Number(formData.target ) < 0) {
            setErrorMessage('Donation target must be a positive number.');
            return;
        }

        setErrorMessage('');

        router.post(route('admin.variant.store'), formData, {
            onError: (errors) => {
                if (errors) {
                    setErrorMessage(Object.values(errors).join(' '));
                }
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Create a New Variant'>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>

                    <Group title="Variant Statement">
                        <InputBox
                            label="Statement"
                            name="statement"
                            placeholder="What do you want to vote on?"
                            value={formData.statement}
                            onChange={handleChange}
                            required
                        />
                    </Group>

                    <Group title="Variant Target">
                        <InputBox
                            label="Donation Target"
                            name="target"
                            type="number"
                            placeholder="10000"
                            value={formData.target }
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </Group>

                    {message && (
                        <Alert>
                            {message}
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert variant="danger">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button type="submit">Create Variant</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
