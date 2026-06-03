import './../../../css/support.css';
import './../../../css/contact.css';
import './../../../css/form.css';
import React from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import { InputError, InputLabel, Select, Textarea, TextInput } from "@/Components/UI/Form.jsx";
import {Head, useForm, usePage} from "@inertiajs/react";

export default function Index({}) {
    const user = usePage().props.auth.user;
    const content = usePage().props.content;

    const { data, setData, post, reset, errors, processing, recentlySuccessful } = useForm({
        first_name: user?.first_name || '',
        phone: '',
        email: user?.email || '',
        category: content?.categories?.[0] || '',
        message: '',
    });
    const [isRequestSuccessful, setRequestSuccessful] = React.useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('connect-with-us.store'), {
            onSuccess: () => {
                setRequestSuccessful(true);
                reset();
                setTimeout(() => setRequestSuccessful(false), 5000);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Connect"/>
            <div className="os-contact">
                <div className={"os-container os-container--xl"}>
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">{content?.mainContent?.title || "Connect with us"}</div>
                        <div className="os-text">{content?.mainContent?.description || "We value your input! Contact us with any questions or ideas about our platform. Let's make this social experience even better together."}</div>
                    </div>
                </div>
                <div className="os-container os-container--sm">
                    <div className="os-text-block">
                        <div className="os-text">{content?.mainContent?.contactText || "If you have any questions or suggestions, please contact us by email or fill out the form:"}</div>
                        {content?.mainContent?.email && (
                        <div className="os-title os-title--h4 os-text--c-yellow os-title--bold">
                            <a 
                            href={`mailto:${content.mainContent.email}`} 
                            className="os-text--c-yellow" 
                            style={{ textDecoration: "none" }}
                            >
                            {content.mainContent.email}
                            </a>
                        </div>
                        )}
                        <div className="os-text">{content?.mainContent?.dmcaText || "For copywrite issues please email:"}</div>
                        {content?.mainContent?.dmcaEmail && (
                        <div className="os-title os-title--h4 os-text--c-yellow os-title--bold">
                            <a 
                            href={`mailto:${content.mainContent.dmcaEmail}`} 
                            className="os-text--c-yellow" 
                            style={{ textDecoration: "none" }}
                            >
                            {content.mainContent.dmcaEmail}
                            </a>
                        </div>
                        )}
                    </div>
                    <form className="os-form" onSubmit={submit}>
                        <h2 className="os-title os-title--h4">Request form</h2>
                        {isRequestSuccessful && (
                            <div className="os-message os-message--success mt-4">
                                Your request has been sent successfully!
                            </div>
                        )}
                        <InputLabel>
                            First name
                            <TextInput
                                id="first_name"
                                type="text"
                                name="first_name"
                                placeholder="Your Name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.first_name}/>
                        <InputLabel>
                            Phone
                            <TextInput
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="+123 456 78 89"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.phone}/>
                        <InputLabel>
                            Your Email
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.email}/>
                        <InputLabel>
                            Request category
                            <Select
                                id="category"
                                options={content?.categories?.map((cat) => ({ value: cat, label: cat })) || []}
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                required
                            />
                        </InputLabel>
                        <InputLabel>
                            Your message
                            <Textarea
                                id="message"
                                placeholder="Message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.message}/>
                        <div className="os-delimeter"></div>
                        <Button
                            type="submit"
                            className="os-btn--fw-bold os-btn--gap-16"
                            icon={true}
                            processing={processing}
                        >
                            Send request
                        </Button>

                        <div className="os-socials-box">
                            <div className="os-text os-text--bold">
                                {content?.socialMedia?.description || "Follow us on another social media"}
                            </div>
                            <div className="os-socials-box__content">
                                {content?.socialMedia?.twitter && (
                                    <div className="os-socials__item">
                                        <a href={content.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                            <Img src={'/img/social/twitter.svg'} />
                                        </a>
                                    </div>
                                )}
                                {content?.socialMedia?.tiktok && (
                                    <div className="os-socials__item">
                                        <a href={content.socialMedia.tiktok } target="_blank" rel="noopener noreferrer">
                                            <Img src={'/img/social/tik-tok.png'} />
                                        </a>
                                    </div>
                                )}
                                {content?.socialMedia?.youtube && (
                                    <div className="os-socials__item">
                                        <a href={content.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                                            <Img src={'/img/social/youtube.svg'} />
                                        </a>
                                    </div>
                                )}
                                {content?.socialMedia?.instagram && (
                                    <div className="os-socials__item">
                                        <a href={content.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                            <Img src={'/img/social/instagram.svg'} />
                                        </a>
                                    </div>
                                )}
                                {content?.socialMedia?.facebook && (
                                    <div className="os-socials__item">
                                        <a href={content.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                            <Img src={'/img/social/facebook.svg'} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
