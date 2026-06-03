import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Textarea, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Edit({ auth, data }) {
    const [formData, setFormData] = useState(data);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.connect.update'), formData);
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Edit Connect Page' message={message}>
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Main Content">
                        <InputBox
                            label="Main Title"
                            name="mainContent[title]"
                            placeholder="Connect with us"
                            value={formData?.mainContent?.title || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Description"
                            name="mainContent[description]"
                            placeholder="We value your input! Contact us with any questions or ideas..."
                            value={formData?.mainContent?.description || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Contact Email"
                            name="mainContent[email]"
                            placeholder="friends@onestoryplanet.com"
                            value={formData?.mainContent?.email || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="DMCA Email"
                            name="mainContent[dmcaEmail]"
                            placeholder="dmca@onestoryplanet.com"
                            value={formData?.mainContent?.dmcaEmail || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Contact Text"
                            name="mainContent[contactText]"
                            placeholder="If you have any questions or suggestions, please contact us by email or fill out the form:"
                            value={formData?.mainContent?.contactText || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="DMCA Text"
                            name="mainContent[dmcaText]"
                            placeholder="For copywrite issues please email:"
                            value={formData?.mainContent?.dmcaText || ''}
                            onChange={handleChange}
                        />
                    </Group>

                    <Group title="Email Settings">
                        <InputBox
                            label="Recipient Email"
                            name="emailSettings[recipientEmail]"
                            placeholder="admin@onestoryplanet.com"
                            value={formData?.emailSettings?.recipientEmail || ''}
                            onChange={handleChange}
                        />
                    </Group>

                    <Group title="Request Categories">
                        <Textarea
                            label="Categories"
                            name="categories"
                            placeholder="Enter categories, one per line"
                            value={formData?.categories?.join('\n') || ''}
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        name: 'categories',
                                        value: e.target.value.split('\n'),
                                    },
                                })
                            }
                        />
                        <i>Enter categories, one per line</i>
                    </Group>

                    <Group title="Social Media">
                        <InputBox
                            label="Twitter"
                            name="socialMedia[twitter]"
                            placeholder="https://twitter.com/yourhandle"
                            value={formData?.socialMedia?.twitter || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="YouTube"
                            name="socialMedia[youtube]"
                            placeholder="https://youtube.com/yourchannel"
                            value={formData?.socialMedia?.youtube || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Instagram"
                            name="socialMedia[instagram]"
                            placeholder="https://instagram.com/yourhandle"
                            value={formData?.socialMedia?.instagram || ''}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Facebook"
                            name="socialMedia[facebook]"
                            placeholder="https://facebook.com/yourpage"
                            value={formData?.socialMedia?.facebook || ''}
                            onChange={handleChange}
                        />
                    </Group>

                    <Button type="submit">Save</Button>
                </Form>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
