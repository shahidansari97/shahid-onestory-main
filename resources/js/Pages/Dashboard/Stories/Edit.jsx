import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button, Select as SelectComponent } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({ story, storyStatuses, categories }) {
    const { props } = usePage();
    const message = props.flash?.message;
    const errors = props.errors || {};
    console.log("story",story)
    const [formData, setFormData] = useState({
        name: story?.name || '',
        categories: story?.categories || '',
        story_status_id: story?.story_status_id || '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };
    useState(() => {
        // Make sure to set it only once
        if (story?.categories?.length && selectedCategories.length === 0) {
            setSelectedCategories(story.categories);
        }
    }, [story.categories]);
    const handleChange = (eOrValue, customName = null) => {
        // Case 1: It's a native event
        if (eOrValue?.target) {
            const { name, value, options, multiple } = eOrValue.target;

            if (multiple) {
                const selectedValues = Array.from(options)
                    .filter(option => option.selected)
                    .map(option => option.value);

                setFormData(prev => ({
                    ...prev,
                    [name]: selectedValues
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }

        // Case 2: It's a custom value, with name manually passed
        else if (customName) {
            setFormData(prev => ({
                ...prev,
                [customName]: eOrValue
            }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name) {
            setErrorMessage('Name is required.');
            return;
        }

        if (!formData.story_status_id) {
            setErrorMessage('Status is required.');
            return;
        }

        if (!selectedCategories.length) {
            setErrorMessage('Category is required.');
            return;
        }

        setErrorMessage('');
        if (!selectedCategories.includes("All")) {
            selectedCategories.push("All");
        }
        const data = {
            name: formData.name,
            categories: selectedCategories,
            story_status_id: formData.story_status_id,
        };

        router.post(route('admin.stories.update', { id: story?.id }), data, {
            onSuccess: () => {
                setSuccessMessage('Story updated successfully.');
            },
            onError: () => {

            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit Story'>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Story Details">
                        <InputBox
                            label="Name"
                            name="name"
                            placeholder="Enter story title"
                            value={formData.name}
                            onChange={handleChange}
                            require={'required'}
                            error={errors.name}
                        />
                    </Group>
                    <Group title="Status">
                        <SelectComponent
                            label="Status"
                            name="story_status_id"
                            value={formData.story_status_id}
                            onChange={handleChange}
                            options={storyStatuses.map(status => ({ value: status.id, label: status.name }))}
                            error={errors.story_status_id}

                        />
                    </Group>
                    <Group title="Categories">
                        <div className="relative w-full ">
                            <InputBox
                                placeholder="Type to search categories"
                                className="rounded-md w-full text-gray-700"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                isClass={true}
                            />
                            {categoryInput && (
                                <div className="absolute z-10 bg-white shadow-lg border rounded-md w-full mt-1 max-h-48 overflow-auto">
                                    {categories
                                        .filter((cat) =>
                                            cat.toLowerCase().includes(categoryInput.toLowerCase()) &&
                                            !selectedCategories.includes(cat)
                                        )
                                        .map((cat) => (
                                            <div
                                                key={cat}
                                                className="px-4 py-2 hover:bg-gray-200 text-black cursor-pointer transition-all"
                                                onClick={() => {
                                                    setSelectedCategories((prev) => [...prev, cat]);
                                                    setCategoryInput('');
                                                }}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    {categories.filter((cat) =>
                                        cat.toLowerCase().includes(categoryInput.toLowerCase())
                                    ).length === 0 && (
                                        <div className="px-4 py-2 text-gray-400">No categories found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected Categories */}
                        <div className="flex flex-wrap gap-3 mt-4">
                             {selectedCategories.map((cat) => {
                                if(cat != 'All'){
                                    return(
                                        <span
                                            key={cat}
                                            className=" border-success text-success text-sm font-medium px-4 py-2 rounded-full flex items-center shadow-sm border "
                                        >
                                            {cat}
                                            <button
                                                type="button"
                                                className="ml-2 text-yellow-700 hover:text-red-600 font-bold text-lg leading-none"
                                                onClick={() =>
                                                    setSelectedCategories((prev) => prev.filter((c) => c !== cat))
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )
                                }
                            })}
                        </div>
                    </Group>

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
