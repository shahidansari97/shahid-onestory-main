import './../../../css/auth.css';
import './../../../css/form.css';
import './../../../css/creator.css';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from "@/Components/UI/Button.jsx";
import { ArrowRight } from 'lucide-react';

export default function CreatorUpgrade() {
    const { data, setData, post, processing, errors } = useForm({
        phone_number: '',
        youtube_channel: '',
        tiktok_profile: '',
        instagram_username: '',
        other_social_links: '',
        creator_category: '',
        total_audience_size: '',
        content_description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('creator-upgrade'));
    };

    return (
        <GuestLayout className="os-layout--auth-bg" footerClass="os-footer--bg-gradient">
            <Head title="Upgrade to Creator" />
            <div className="min-h-screen flex justify-center px-4 py-6">
                <div className="w-full max-w-md bg-white overflow-hidden creator-form-card">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 py-5 text-center rounded-xl">
                        <h2 className="text-black font-semibold text-2xl">
                            Upgrade to Creator
                        </h2>
                        <p className="text-black/80 text-sm mt-1">
                            You’re already registered. Just complete your creator profile.
                        </p>
                    </div>

                    {/* Form - creator-only fields, no account creation */}
                    <form onSubmit={submit} className="py-5 space-y-4 text-sm px-1">

                        {/* Social Media Profiles */}
                        <div className="pt-2">
                            <p className="section-title">Social Media Profiles</p>

                            <div>
                                <label className="label">YouTube Channel</label>
                                <input
                                    className="input"
                                    placeholder="https://youtube.com/@yourchannel"
                                    value={data.youtube_channel}
                                    onChange={(e) => setData('youtube_channel', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">TikTok Profile</label>
                                <input
                                    className="input"
                                    placeholder="https://tiktok.com/@yourusername"
                                    value={data.tiktok_profile}
                                    onChange={(e) => setData('tiktok_profile', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">Instagram Username</label>
                                <input
                                    className="input"
                                    placeholder="https://instagram.com/yourusername"
                                    value={data.instagram_username}
                                    onChange={(e) => setData('instagram_username', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">Other Social Media</label>
                                <input
                                    className="input"
                                    placeholder="Any other platform URL"
                                    value={data.other_social_links}
                                    onChange={(e) => setData('other_social_links', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Creator Category */}
                        {/* <div>
                            <label className="label">Creator Category</label>
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
                        </div> */}

                        {/* Audience Size */}
                        <div>
                            <label className="label">Total Audience Size</label>
                            <input
                                className="input"
                                value={data.total_audience_size}
                                onChange={(e) => setData('total_audience_size', e.target.value)}
                            />
                        </div>

                        {/* Content Description */}
                        <div>
                            <label className="label">About Your Content</label>
                            <textarea
                                rows="3"
                                className="input resize-none"
                                placeholder="Tell us about yourself and your content"
                                value={data.content_description}
                                onChange={(e) => setData('content_description', e.target.value)}
                            />
                        </div>

                        {/* Agreement */}
                        <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
                            <input type="checkbox" id="agree-upgrade" className="" required />
                            <label htmlFor="agree-upgrade">
                                I agree to the <b className="underline"><Link href={route('static.page', 'terms-of-use')}>Terms of Service</Link></b>,{' '}
                                <b className="underline">Privacy Policy</b>, and <b className="underline"><Link href={route('static.page', 'terms-of-use')}>Creator Guidelines</Link></b>.
                            </label>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gray-300 text-gray-800 py-2.5 rounded-lg text-sm font-medium mt-3 flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Upgrading...' : 'Upgrade to Creator'} <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
