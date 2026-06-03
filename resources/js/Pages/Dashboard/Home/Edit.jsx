import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Form, Group, InputBox, Alert, Button} from "@/Components/Dashboard/Form.jsx";
import {useState} from 'react';
import {router, usePage} from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({auth, data}) {
    const [formData, setFormData] = useState(data || { hero: {}, storyBlock: {} });
    const {props} = usePage();
    const message = props.flash?.message;
    const handleChange = (e) => {
        const {name, value} = e.target;
        const keys = name.replace(/\]/g, '').split('[');
        const updatedFormData = {...formData};

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

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('homepage.update'), formData);
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit Home Page' message={message}>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Hero">
                        <InputBox
                            label="Title"
                            name="hero[title]"
                            placeholder="One story, uniting all people"
                            value={formData?.hero?.title || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Subtitle #1"
                            name="hero[subtitle1]"
                            placeholder="Empower your story with our tools to share it and make a meaningful impact on the world."
                            value={formData?.hero?.subtitle1 || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Subtitle #2"
                            name="hero[subtitle2]"
                            placeholder="Over 1000 stories have been shared!"
                            value={formData?.hero?.subtitle2 || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Text Under Video"
                            name="hero[textUnderVideo]"
                            placeholder="Our vision is to connect people from all corners of the world..."
                            value={formData?.hero?.textUnderVideo || ''}
                            onChange={handleChange}
                        />
                    </Group>
                    <Group title="Story Block">
                        <InputBox
                            label="Title"
                            name="storyBlock[title]"
                            placeholder="One Story, Infinite Connections"
                            value={formData?.storyBlock?.title || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Description"
                            name="storyBlock[description]"
                            placeholder="Watch as countless voices unite into a single, seamless narrative..."
                            value={formData?.storyBlock?.description || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Advice"
                            name="storyBlock[advice]"
                            placeholder="Use our advanced editing platform and AI generative tools"
                            value={formData?.storyBlock?.advice || ''}
                            onChange={handleChange}
                        />
                        <Group title="Purpose">
                            <InputBox
                                label="Title"
                                name="storyBlock[info][setting][title]"
                                placeholder="Upload your elements"
                                value={formData?.storyBlock?.info?.setting?.title || ''}
                                onChange={handleChange}
                            />
                            <InputBox
                                label="Description"
                                name="storyBlock[info][setting][description]"
                                placeholder="Lorem ipsum dolor sit amet..."
                                value={formData?.storyBlock?.info?.setting?.description || ''}
                                onChange={handleChange}
                            />
                        </Group>
                        <Group title="Vision">
                            <InputBox
                                label="Title"
                                name="storyBlock[info][play][title]"
                                placeholder="Upload your elements"
                                value={formData?.storyBlock?.info?.play?.title || ''}
                                onChange={handleChange}
                            />
                            <InputBox
                                label="Description"
                                name="storyBlock[info][play][description]"
                                placeholder="Lorem ipsum dolor sit amet..."
                                value={formData?.storyBlock?.info?.play?.description || ''}
                                onChange={handleChange}
                            />
                        </Group>
                        <Group title="Story">
                            <InputBox
                                label="Title"
                                name="storyBlock[info][like][title]"
                                placeholder="Upload your elements"
                                value={formData?.storyBlock?.info?.like?.title || ''}
                                onChange={handleChange}
                            />
                            <InputBox
                                label="Description"
                                name="storyBlock[info][like][description]"
                                placeholder="Lorem ipsum dolor sit amet..."
                                value={formData?.storyBlock?.info?.like?.description || ''}
                                onChange={handleChange}
                            />
                        </Group>
                    </Group>
                    <Button type={'submit'}>Save</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
