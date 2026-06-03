import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Form, Group, InputBox, Alert, Button } from "@/Components/Dashboard/Form.jsx";
import { useState } from 'react';
import { router, usePage } from "@inertiajs/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function EditTermsOfUse({ auth, data }) {
    const [formData, setFormData] = useState({
        title: data.title || '',
        content: data.content || '',
    });

    const { props } = usePage();
    const message = props.flash?.message;

    const handleEditorChange = (event, editor) => {
        const content = editor.getData();
        setFormData(prevState => ({
            ...prevState,
            content,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.terms-of-use.update'), formData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="flex items-center h-10">
                <div className="text-lg font-medium group-[.mode--light]:text-white">
                    Terms of Use Edit
                </div>
            </div>
            {message && (
                <Alert>
                    {message}
                </Alert>
            )}
            <div className="relative flex flex-col col-span-12 gap-y-7 lg:col-span-9 xl:col-span-8">
                <Form className="flex flex-col p-5 gap-[24px] box box--stacked" onSubmit={handleSubmit}>
                    <Group title="Content">
                        <InputBox
                            label="Title"
                            name="title"
                            placeholder="Enter the title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <div className="mt-4">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.content}
                                onChange={handleEditorChange}
                            />
                        </div>
                    </Group>
                    <Button type={'submit'}>Save</Button>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
