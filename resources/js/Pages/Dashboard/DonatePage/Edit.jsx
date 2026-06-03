import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button, Textarea, InputLabel } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import axios from 'axios';
import { Select } from "@/Components/UI/Form.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({ auth, data, variants }) {
    const [formData, setFormData] = useState({
        ...data,
    });
    const { props } = usePage();
    const message = props.flash?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataData = new FormData();
            formDataData.append('file', file, 'donation-video.mp4');
            formDataData.append('allowed_types', 'video');
            try {
                const response = await axios.post('/upload', formDataData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setFormData({ ...formData, video: response.data.url });
                } else {
                    console.error('Failed to upload video.');
                }
            } catch (error) {
                console.error('Error uploading video:', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.donate-page.update'), formData);
    };

    const selectOptions = variants.map(variant => ({
        value: variant.id,
        label: variant.statement
    }));
    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit Donate Page' message={message}>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="General Information">
                        <InputBox
                            label="Title"
                            name="title"
                            placeholder="Main Title"
                            value={formData.title || ''}
                            onChange={handleChange}
                        />
                        <div className="block sm:flex items-center group form-inline">
                            <Textarea
                                label='Paragraph Text'
                                name="paragraph"
                                placeholder="Paragraph Text"
                                value={formData.paragraph || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="block sm:flex items-center group form-inline">
                            <label
                                className="inline-block mb-2 group-[.form-inline]:mb-2 group-[.form-inline]:sm:mb-0 group-[.form-inline]:sm:mr-5 group-[.form-inline]:sm:text-right sm:w-24"
                            >
                                Video
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        {formData.video && (
                            <div>
                                <video controls width="400" src={formData.video} />
                            </div>
                        )}
                    </Group>

                    <Group title="Choose Donation Goal">
                        <Select
                            name="variant_id"
                            value={formData.variant_id || ''}
                            onChange={handleChange}
                            options={selectOptions}
                            placeholder="Choose Donation Subjec"
                        />
                    </Group>

                    <Group title="End Date">
                        <InputBox
                            label="End Date"
                            name="end_date"
                            placeholder="YYYY-MM-DD"
                            value={formData.end_date || ''}
                            onChange={handleChange}
                            type="date"
                        />
                    </Group>

                    <Button type="submit">Save</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
