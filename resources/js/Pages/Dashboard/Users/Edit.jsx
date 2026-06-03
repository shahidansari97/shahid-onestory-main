import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, SelectBox, Alert, Button, Textarea } from "@/Components/Dashboard/Form.jsx";
import {useState, useEffect, useRef} from 'react';
import { router, usePage } from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({ user }) {
    const { props } = usePage();
    const message = props.flash?.message;
    const errors = props.errors || {};

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        generation: user.generation || '',
        story: user.story || '',
        is_creator: user.is_creator === true || user.is_creator === 1 ? 1 : 0,
        world_message: user.world_message || '',
        country: user.country || '',
        city: user.city || '',
        avatar: user.avatar || '',
        preferences: Array.isArray(user.preferences) ? user.preferences.join(', ') : '',
    });
    const [selectedPhoto, setSelectedPhoto] = useState(user.avatar || null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedPhoto(URL.createObjectURL(file));

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('allowed_types', 'avatar');

        try {
            const response = await axios.post('/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.url) {
                setFormData((prev) => ({ ...prev, avatar: response.data.url }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePhoto = () => {
        setSelectedPhoto(null);
        setFormData((prev) => ({ ...prev, avatar: '' }));
    };

    const handleUploadClick = () => {
        fileInputRef?.current?.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name) {
            setErrorMessage('Name is required.');
            return;
        }

        if (!formData.email) {
            setErrorMessage('Email is required.');
            return;
        }

        setErrorMessage('');

        const payload = {
            ...formData,
            preferences: formData.preferences.split(',').map((item) => item.trim()),
        };

        router.post(route('admin.users.update', { id: user.id }), payload, {
            onSuccess: () => {
                setSuccessMessage('User updated successfully.');
            },
            onError: (err) => {
                console.error('Error during update:', err);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit User'>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Personal Data">
                        <InputBox
                            label="Name"
                            name="name"
                            placeholder="Enter user name"
                            value={formData.name}
                            onChange={handleChange}
                            require={'required'}
                            error={errors.name}
                        />

                        <InputBox
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter user email"
                            value={formData.email}
                            onChange={handleChange}
                            require={'required'}
                            error={errors.email}
                        />

                        <InputBox
                            label="Username"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                        />

                        <InputBox
                            label="Generation"
                            name="generation"
                            placeholder="Enter generation"
                            value={formData.generation}
                            onChange={handleChange}
                            error={errors.generation}
                        />

                        <SelectBox
                            label="User Type"
                            name="is_creator"
                            value={Number(formData.is_creator)}
                            onChange={handleChange}
                            options={[
                                { value: 0, label: 'User' },
                                { value: 1, label: 'Creator' }
                            ]}
                            error={errors.is_creator}
                        />

                        <Textarea
                            label="Story"
                            name="story"
                            placeholder="Write about yourself"
                            value={formData.story}
                            onChange={handleChange}
                            error={errors.story}
                        />

                        

                        <InputBox
                            label="World Message"
                            name="world_message"
                            placeholder="Enter world message"
                            value={formData.world_message}
                            onChange={handleChange}
                            error={errors.world_message}
                        />

                        <InputBox
                            label="Preferences"
                            name="preferences"
                            placeholder="Enter preferences separated by commas"
                            value={formData.preferences}
                            onChange={handleChange}
                            error={errors.preferences}
                        />
                    </Group>

                    <Group title="Address">
                        <InputBox
                            label="Country"
                            name="country"
                            placeholder="Enter country"
                            value={formData.country}
                            onChange={handleChange}
                            error={errors.country}
                        />

                        <InputBox
                            label="City"
                            name="city"
                            placeholder="Enter city"
                            value={formData.city}
                            onChange={handleChange}
                            error={errors.city}
                        />
                    </Group>

                    <Group title="Avatar">
                        <div className="">
                            <div className="">
                                {selectedPhoto ? (
                                    <img
                                        src={selectedPhoto}
                                        alt="Profile Avatar"
                                        className="w-32 h-32 rounded-lg object-cover"
                                    />
                                ) : (
                                    <img src="/img/avatar.png" alt="lucy" className="w-16 h-16 object-cover rounded"/>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <div className="">
                                <Button onClick={handleUploadClick}>
                                    Upload Photo
                                </Button>
                                {selectedPhoto && (
                                    <Button variant="outline" onClick={handleDeletePhoto}>
                                        Delete Photo
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Group>


                    {successMessage && (
                        <Alert variant="success">
                            {successMessage}
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert variant="danger">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button type="submit" variant={'success'}>Save Changes</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
