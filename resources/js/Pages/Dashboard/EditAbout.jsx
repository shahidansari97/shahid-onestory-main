import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import axios from 'axios';

export default function EditAbout({ auth, data }) {
    const [formData, setFormData] = useState(data);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const { props } = usePage();
    const message = props.flash?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.replace(/\]/g, '').split('[');
        const updatedFormData = { ...formData };

        const updateNestedObject = (obj, keys, value) => {
            if (keys.length === 1) {
                obj[keys[0]] = value;
            } else {
                if (!obj[keys[0]]) obj[keys[0]] = {};
                updateNestedObject(obj[keys[0]], keys.slice(1), value);
            }
        };

        updateNestedObject(updatedFormData, keys, value);
        setFormData(updatedFormData);
    };

    const handleFileChange = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setUploadingIndex(index);
            const formDataData = new FormData();
            formDataData.append('file', file, `paragraph-${index + 1}-${new Date().toISOString()}.mp4`);
            formDataData.append('allowed_types', 'video');

            try {
                const response = await axios.post('/upload', formDataData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    const videoUrl = response.data.url;
                    const updatedFormData = { ...formData };
                    if (!updatedFormData.paragraphs[index]) {
                        updatedFormData.paragraphs[index] = {};
                    }

                    updatedFormData.paragraphs[index].video = videoUrl;
                    setFormData(updatedFormData);
                }
            } catch (error) {
                console.error('Error uploading video:', error.response ? error.response.data : error.message);
            } finally {
                setUploadingIndex(null);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.about.update'), formData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit About Page</h2>}
        >
            <div className="flex items-center h-10">
                <div className="text-lg font-medium group-[.mode--light]:text-white">
                    About Page Edit
                </div>
            </div>
            {message && (
                <Alert>
                    {message}
                </Alert>
            )}
            <div className="relative flex flex-col col-span-12 gap-y-7 lg:col-span-9 xl:col-span-8">
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="General Information">
                        <InputBox
                            label="Title"
                            name="title"
                            placeholder="Main Title"
                            value={formData.title || ''}
                            onChange={handleChange}
                        />
                    </Group>

                    {[0, 1, 2].map((index) => (
                        <Group key={index} title={`Paragraph ${index + 1}`}>
                            <InputBox
                                label="Title"
                                name={`paragraphs[${index}][title]`}
                                placeholder={`Paragraph ${index + 1} Title`}
                                value={formData.paragraphs?.[index]?.title || ''}
                                onChange={handleChange}
                            />
                            <InputBox
                                label="Text"
                                name={`paragraphs[${index}][text]`}
                                placeholder={`Paragraph ${index + 1} Text`}
                                value={formData.paragraphs?.[index]?.text || ''}
                                onChange={handleChange}
                            />
                            <div className="block sm:flex items-center group form-inline">
                                <label
                                    className="inline-block mb-2 group-[.form-inline]:mb-2 group-[.form-inline]:sm:mb-0 group-[.form-inline]:sm:mr-5 group-[.form-inline]:sm:text-right sm:w-24">
                                    Video
                                </label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileChange(e, index)}
                                />
                                {uploadingIndex === index && <div className="ml-2 text-blue-500">Uploading...</div>}
                            </div>
                            {formData.paragraphs?.[index]?.video && (
                                <div>
                                    <video
                                        controls
                                        width="400"
                                        src={formData.paragraphs[index].video}
                                    />
                                </div>
                            )}
                        </Group>
                    ))}

                    <Group title="Final Paragraph">
                        <InputBox
                            label="Final Paragraph"
                            name="paragraphs[final_paragraph]"
                            placeholder="Final paragraph text"
                            value={formData.paragraphs?.final_paragraph || ''}
                            onChange={handleChange}
                        />
                    </Group>
                    <Button type="submit">Save</Button>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
