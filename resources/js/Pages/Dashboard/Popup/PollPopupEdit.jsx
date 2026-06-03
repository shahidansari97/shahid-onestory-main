import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Form, Group, InputBox, Alert, Button, Textarea, InputLabel} from "@/Components/Dashboard/Form.jsx";
import {useState} from 'react';
import {router, usePage} from "@inertiajs/react";
import axios from 'axios';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function PollPopupEdit({auth, data}) {
    const [formData, setFormData] = useState({
        title: data?.title ?? '',
        content: data?.content ?? '',
        src: data?.src || '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const {flash} = usePage().props;
    const message = flash?.message;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataData = new FormData();
            formDataData.append('file', file);
            formDataData.append('allowed_types', 'image');
            try {
                const response = await axios.post(route('user.upload.file'), formDataData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setFormData(prevData => ({...prevData, src: response.data.url}));
                } else {
                    setErrorMessage('Failed to upload image.');
                }
            } catch (error) {
                setErrorMessage('Error uploading image.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title) {
            setErrorMessage('Title is empty.');
            return;
        }

        if (!formData.content) {
            setErrorMessage('Content is empty.');
            return;
        }

        if (!formData.src) {
            setErrorMessage('Image is required.');
            return;
        }

        setErrorMessage('');

        router.post(route('admin.poll-popup.update'), formData, {
            onError: (errors) => {
                if (errors) {
                    setErrorMessage(Object.values(errors).join(' '));
                }
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit Poll Page' message={message}>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>

                    <Group title="Popup Title">
                        <InputBox
                            label="Title"
                            name="title"
                            placeholder="Enter popup title"
                            value={formData?.title}
                            onChange={handleChange}
                            required
                        />
                    </Group>

                    <Group title="Popup Content">
                        <Textarea
                            label="Content"
                            name="content"
                            placeholder="Enter popup content"
                            value={formData?.content}
                            onChange={handleChange}
                            required
                        />
                    </Group>

                    <Group title="Image Source">
                        <InputLabel>Image</InputLabel>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {formData.src && (
                            <div className="mt-2">
                                <img src={formData.src} alt="Uploaded" className="w-64" />
                            </div>
                        )}
                    </Group>

                    {errorMessage && (
                        <Alert variant="danger">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button type="submit">Update Poll Popup</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
