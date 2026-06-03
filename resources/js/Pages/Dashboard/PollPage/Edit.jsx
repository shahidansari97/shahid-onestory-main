import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Form, Group, InputBox, Alert, Button} from "@/Components/Dashboard/Form.jsx";
import {useState} from 'react';
import {router, usePage} from "@inertiajs/react";
import axios from 'axios';
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({auth, data}) {
    const [formData, setFormData] = useState({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        prescription: data.prescription || '',
        images: data.images || [],
    });
    const {props} = usePage();
    const message = props.flash?.message;

    const handleChange = (e) => {
        const {name, value} = e.target;
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
                data: {id: imageId},
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
        <AuthenticatedLayout>
            <Wrapper title='Edit Poll Page' message={message}>
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
                                <div key={index}
                                     className="image-fit h-56  flex flex-col col-span-12 gap-x-3 gap-y-10 md:col-span-3 xl:col-span-3">
                                    <img src={image.src} alt={`Uploaded image ${index + 1}`}
                                         className="rounded-md h-56"/>
                                </div>
                            ))}
                        </div>

                        <input type="file" multiple onChange={handleImageChange}/>
                    </Group>

                    <Button type="submit">Save</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
);
}
