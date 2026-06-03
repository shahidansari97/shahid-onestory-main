import React, {useState} from 'react';
import {usePage, router} from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import axios from 'axios';
import {Alert, Button, TextInput} from "@/Components/Dashboard/Form.jsx";
import Pagination from "@/Components/Dashboard/Pagination.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import SectionBox from '@/Components/Dashboard/SectionBox.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';

export default function BlacklistedWords({auth, words: initialWords, pagination}) {
    const {flash} = usePage().props;
    const [localWords, setLocalWords] = useState(initialWords);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);
    const [message, setMessage] = useState(null);
    const [word, setWord] = useState('');

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this word?')) {
            try {
                const response = await axios.delete(route('admin.blacklisted-words.destroy', id));
                if (response.status === 200) {
                    setLocalWords(localWords.filter((w) => w.id !== id));
                    setMessage('Word successfully deleted.');
                }
            } catch (error) {
                console.error('Error deleting word:', error);
                setMessage('Failed to delete the word.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('admin.blacklisted-words.store'), {word});
            if (response.status === 200) {
                setLocalWords([response.data.word, ...localWords]);
                setWord('');
                setMessage('Word successfully added.');
            }
        } catch (error) {
            console.error('Error adding word:', error);
            setMessage('Failed to add the word.');
        }
    };

    const handlePageChange = (page) => {
        router.get(route('admin.blacklisted-words.index', {page}), {}, {
            preserveScroll: true,
            onSuccess: (pageResponse) => {
                setLocalWords(pageResponse.props.words);
                setCurrentPage(pageResponse.props.pagination.currentPage);
            },
        });
    };

    const wordsColumns = [
        {
            key: 'word',
            label: 'Word'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: row => (
                <Button onClick={() => handleDelete(row.id)} variant="danger">
                    Delete
                </Button>
            )
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Blacklisted Words' message={message}>
                <SectionBox title="Add new word">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <TextInput
                                id="word"
                                type="text"
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                                placeholder="Enter a new word"
                            />
                            <Button type="submit" variant="primary">Add Word</Button>
                        </div>
                    </form>
                </SectionBox>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-6 mt-5'>
                <SectionBox title="List">
                    <ListView
                        onSearch={() => {
                        }}
                        columns={wordsColumns}
                        data={localWords}
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        onPageChange={handlePageChange}
                    />
                </SectionBox>
                </div>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
