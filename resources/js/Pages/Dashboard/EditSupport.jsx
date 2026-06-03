import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import axios from 'axios';

export default function EditSupport({ auth, data }) {
    const [formData, setFormData] = useState({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        prescription: data.prescription || '',
        images: data.images || [],
    });
    const { props } = usePage();
    const message = props.flash?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files).map(file => ({
            file,
            src: URL.createObjectURL(file),
        }));

        setFormData(prevState => ({
            ...prevState,
            images: [...prevState.images, ...newImages]
        }));
    };

    const handleDeleteImage = async (index) => {
        const imageId = formData.images[index].id;
        console.log(imageId);
        try {
            const response = await axios.delete(route('support.delete-image'), {
                data: { id: imageId },
            });

            if (response.status === 200) {
                console.log(response.data.message);

                setFormData(prevState => ({
                    ...prevState,
                    images: prevState.images.filter((_, i) => i !== index),
                }));
            } else {
                console.error('Error deleting image:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('title', formData.title);
        form.append('subtitle', formData.subtitle);
        form.append('description', formData.description);
        form.append('prescription', formData.prescription);

        if (formData.images.length > 0) {
            for (let i = 0; i < formData.images.length; i++) {
                form.append(`images[${i}]`, formData.images[i].file);
            }
        }

        router.post(route('admin.support.update'), form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Support Page Edit</h2>}
        >
            <div className="flex items-center h-10">
                <div className="text-lg font-medium group-[.mode--light]:text-white">
                    Edit Support Content
                </div>
            </div>

            {message && (
                <Alert>
                    {message}
                </Alert>
            )}

            <div className="relative flex flex-col col-span-12 gap-y-7 lg:col-span-9 xl:col-span-8">
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Title">
                        <InputBox
                            label="Title"
                            name="title"
                            placeholder="It's Time To Make A Change"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <InputBox
                            label="Subtitle"
                            name="subtitle"
                            placeholder="Vote for This Month's Cause!"
                            value={formData.subtitle}
                            onChange={handleChange}
                        />

                        <InputBox
                            label="Description"
                            name="description"
                            placeholder="Your voice matters! Join us in making a difference..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Group>

                    <Group title="Prescription">
                        <InputBox
                            label="Prescription"
                            name="prescription"
                            placeholder="What happened in the world this month"
                            value={formData.prescription}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-12 gap-x-6 gap-y-10 mt-3.5">
                            {formData.images.map((image, index) => (
                                <div key={index} className="image-fit h-56  flex flex-col col-span-12 gap-x-3 gap-y-10 md:col-span-3 xl:col-span-3">
                                    <img src={image.src} alt={`Uploaded image ${index + 1}`} className="rounded-md h-56" />
                                    <div
                                        onClick={() => handleDeleteImage(index)}
                                        className="cursor-pointer flex items-center p-2 transition duration-300 ease-in-out z-10 bg-white mt-3 right-0 mr-3 absolute rounded-lg hover:bg-slate-100 dark:bg-darkmode-600 dark:hover:bg-darkmode-400"
                                       id="headlessui-menu-item-:r5d:" role="menuitem" tabIndex="-1"
                                       data-headlessui-state="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-trash stroke-[1] w-4 h-4 mr-2">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                        Delete</div>

                                </div>
                            ))}
                        </div>

                        <input type="file" multiple onChange={handleImageChange} />
                    </Group>

                    <Button type="submit">Save</Button>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
