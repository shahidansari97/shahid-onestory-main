import './../../../css/auth.css';
import './../../../css/form.css';
import './../../../css/creator.css';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import { trackSignup } from '@/Utils/analytics';
import { InputError } from '@/Components/UI/Form.jsx';
// import { FaCheck } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";  
export default function Creator({ countries = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        name: '',
        last_name: '',
        password_confirmation: '',
        country_id: '',
        phone_number: '',
        youtube_channel: '',
        tiktok_profile: '',
        instagram_username: '',
        other_social_links: '',
        creator_category: '',
        total_audience_size: '',
        content_description: '',
    });

    const { page } = usePage().props;
    const [isPasswordVisible, setPasswordVisible] = useState(true);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const [agree, setAgree] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('creator-store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => {
                const userId = page?.props?.auth?.user?.id;
                if (userId) trackSignup(userId);
            },
        });
    };

    return (
        <GuestLayout className="os-layout--auth-bg" footerClass="os-footer--bg-gradient">
            <Head title="Creator" />

            <div className="min-h-screen flex justify-center px-4 py-6">
                <div className="w-full max-w-2xl bg-white creator-form-card">

                    {/* Header */}
                    <div className="py-8 text-center rounded-3xl">
                        <h2 className="text-black font-semibold text-4xl">Join as a Creator</h2>
                    </div>
                    <div className="text-center rounded-lg">
                        <p className="text-black text-lg">OneStoryPlanet is a space for real people to share real life stories. This platform is for lived experiences, and thoughtful reflections on what is happening in the world at large, shared through a personal and human lens. Creators will create stories on our editing platform.</p>
                    </div>

                   <div className="mx-5 flex justify-center">
                    <ul className="grid grid-cols-2 gap-y-4 gap-x-8 my-6">

                        <li className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full shrink-0">
                                <HiCheck className="w-4 h- text-gray-700" />
                        
                            </span>
                            <span className="text-gray-700 text-[15px] font-medium">
                                $7 per 1,000 views
                            </span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full shrink-0">
                                <HiCheck className="w-4 h- text-gray-700" />
                            </span>
                            <span className="text-gray-700 text-[15px] font-medium">
                                No follower minimum required
                            </span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full shrink-0">
                                <HiCheck className="w-4 h- text-gray-700" />
                            </span>
                            <span className="text-gray-700 text-[15px] font-medium">
                                Withdraw at just $50
                            </span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full shrink-0">
                                <HiCheck className="w-4 h- text-gray-700" />
                            </span>
                            <span className="text-gray-700 text-[15px] font-medium">
                                Get approved within 24 hours
                            </span>
                        </li>

                    </ul>
                   </div>
                    
                    <form onSubmit={submit} className="py-5 space-y-4 text-sm px-1">

                        {/* Username */}
                        <div>
                            <label className="label"><span className="text-red-500">*</span>Username</label>
                            <input
                                className="input"
                                placeholder="Username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            <InputError message={errors.username} />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label"><span className="text-red-500">*</span>Your Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="Email address"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label"><span className="text-red-500">*</span>Password</label>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? 'password' : 'text'}
                                    className="input"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={isConfirmPasswordVisible ? 'password' : 'text'}
                                    className="input"
                                    placeholder="Confirmation Password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {isConfirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 ">
                            <div>
                                <label className="label"><span className="text-red-500">*</span>First Name</label>
                                <input
                                    className="input"
                                    placeholder="First Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label"><span className="text-red-500">*</span>Last Name</label>
                                <input
                                    className="input"
                                    placeholder="Last Name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Phone & Country */}
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 ">
                            <div className='creator_Phoneno'>
                                <label className="label">Phone Number</label>
                                <PhoneInput
                                    country={'us'}
                                    value={data.phone_number}
                                    onChange={(phone) => setData('phone_number', phone)}
                                    inputClass="input"
                                    containerClass="phone-input-container"
                                    buttonClass="phone-input-button"
                                    searchClass="phone-input-search"
                                    enableSearch={true}
                                    placeholder="+(555) 000-0000"
                                />
                            </div>

                            <div>
                                <label className="label"><span className="text-red-500">*</span>Country</label>
                                <select
                                    className="input"
                                    value={data.country_id}
                                    onChange={(e) => setData('country_id', e.target.value)}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Social Media Profiles */}
                        <div className="pt-2">
                            <h4 className="section-title"><span className="text-red-500">*</span>Social Media Profiles</h4>
                             <p className="mb-2 text-gray-700">Provide at least one social media link so we can review your content.</p>
                             <div className='mt-3'>
                                <label className="label">YouTube Channel URL</label>
                                <input
                                    className="input"
                                    placeholder="https://youtube.com/@yourchannel"
                                    value={data.youtube_channel}
                                    onChange={(e) => setData('youtube_channel', e.target.value)}
                                />
                            </div>

                            <div className='mt-3'>
                                <label className="label">TikTok Profile URL</label>
                                <input
                                    className="input"
                                    placeholder="https://tiktok.com/@yourusername"
                                    value={data.tiktok_profile}
                                    onChange={(e) => setData('tiktok_profile', e.target.value)}
                                />
                            </div>

                              <div className='mt-3'>
                                <label className="label">Instagram Profile URL</label>
                                <input
                                    className="input"
                                    placeholder="https://instagram.com/yourusername"
                                    value={data.instagram_username}
                                    onChange={(e) => setData('instagram_username', e.target.value)}
                                />
                            </div>

                            <div className='mt-3 pb-4'>
                                <label className="label">Other Social Media (Optional)</label>
                                <input
                                    className="input"
                                    placeholder="Any other platform URL"
                                    value={data.other_social_links}
                                    onChange={(e) => setData('other_social_links', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Creator Category */}
                     

                        {/* Audience Size */}
                        <div className='mt-4'>
                            <h4 className="section-title">Creator Details</h4>
                             <div>
                                <label className="label">Content Category</label>
                                <select
                                    className="input"
                                    value={data.creator_category}
                                    onChange={(e) => setData('creator_category', e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    <option value="All">All</option>
                                    <option value="Love">Love</option>
                                    <option value="Substance Abuse">Substance Abuse</option>
                                    <option value="Sexual Identity">Sexual Identity</option>
                                    <option value="Conflict">Conflict</option>
                                    <option value="Art">Art</option>
                                    <option value="Loss">Loss</option>
                                    <option value="Starting Over">Starting Over</option>
                                    <option value="Compassion">Compassion</option>
                                    <option value="Conquering Fears">Conquering Fears</option>
                                    <option value="Passion">Passion</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>


                        <div className='mt-3'>
                            <label className="label"><span className="text-red-500">*</span>Total Audience Size</label>
                            <input
                                className="input"
                                value={data.total_audience_size}
                                onChange={(e) => setData('total_audience_size', e.target.value)}
                            />
                        </div>

                        {/* Content Description */}
                        {/* <div className='mt-3'>
                            <label className="label">About Your Content</label>
                            <textarea
                                rows="3"
                                className="input resize-none"
                                placeholder="Tell us about yourself and your content"
                                value={data.content_description}
                                onChange={(e) => setData('content_description', e.target.value)}
                            />
                        </div> */}

                        {/* Agreement */}
                        <div className="flex items-center gap-2 justify-start text-xs">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                            <span className="text-[14px] text-gray-500 font-semibold md:flex gap-[5px]">
                                I agree to the{' '}
                                <Link href="/page/terms-of-use" className="text-gray-800 underline font-bold">
                                    Terms of Service
                                </Link>
                                ,{' '}
                                <Link href="/page/privacy-eu" className="text-gray-800 underline font-bold">
                                    Privacy Policy
                                </Link>
                                , and{' '}
                                <Link href="/page/creator-guidelines" className="text-gray-800 underline font-bold">
                                    Creator Guidelines
                                </Link>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!agree || processing}
                            className="bg-gradient-to-r from-[#BEDBFF] via-[#E9D4FF] to-[#FCCEE8] w-full bg-gray-200 py-2.5 rounded-lg flex justify-center gap-2 font-bold"
                        >
                            {processing ? 'Signing Up...' : 'Sign Up'} <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
