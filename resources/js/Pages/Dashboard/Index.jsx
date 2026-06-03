import React, {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import {Alert, Button} from "@/Components/Dashboard/Form.jsx";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";

export default function Dashboard({auth, siteSettings, flash}) {

    const [mode, setMode] = useState(
        siteSettings.voting_page_enabled === 'true' ? 'voting' :
            siteSettings.donation_page_enabled === 'true' ? 'donation' : ''
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleModeChange = (event) => {
        setMode(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            const response = await axios.post('/admin/dashboard/update', {mode});
            setMessage('Settings updated successfully');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Wrapper title='Dashboard'>
                <div className="flex flex-col p-5 box box--stacked">
                    <div
                        className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                        Voting or Donation
                    </div>
                    <div className="flex flex-col">
                        <form onSubmit={handleSubmit} className='flex gap-5 items-center'>

                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="voting"
                                    checked={mode === 'voting'}
                                    onChange={handleModeChange}
                                    className="transition-all duration-100 ease-in-out shadow-sm border-slate-300/80 cursor-pointer focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-700 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary/60 [&[type='radio']]:checked:border-primary/50 [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary/60 [&[type='checkbox']]:checked:border-primary/50 [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-700/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-700/50"
                                />
                                <span className="ml-2">Enable Voting</span>
                            </label>

                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="donation"
                                    checked={mode === 'donation'}
                                    onChange={handleModeChange}
                                    className="transition-all duration-100 ease-in-out shadow-sm border-slate-300/80 cursor-pointer focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-700 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary/60 [&[type='radio']]:checked:border-primary/50 [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary/60 [&[type='checkbox']]:checked:border-primary/50 [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-700/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-700/50"
                                />
                                <span className="ml-2">Enable Donation</span>
                            </label>
                            <Button
                                type="submit"
                                variant='primary'
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Save'}
                            </Button>
                        </form>
                        {message && (
                            <Alert variant="success">
                                {message}
                            </Alert>
                        )}
                    </div>
                </div>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
