import {TextInput, InputLabel, InputError, Textarea, Select} from '@/Components/UI/Form.jsx';
import {Link, router, useForm, usePage} from '@inertiajs/react';
import Button from "@/Components/UI/Button.jsx";
import React, {useRef, useState, useEffect} from "react";
import KeywordSelector from "@/Components/UI/KeywordSelector.jsx";
import {Img} from "@/Components/UI/Content.jsx";
import {City, Country} from "country-state-city";
import axios from 'axios';

const generations = [
    {value: 'alpha', label: 'Alpha'},
    {value: 'z', label: 'Z'},
    {value: 'millennials', label: 'Millennials'},
    {value: 'x', label: 'X'},
    {value: 'boomers', label: 'Boomers'},
    {value: 'silent_gen', label: 'Silent Generation'}
];
const profilePrivacies = [
    {value: '1', label: 'Public'},
    {value: '0', label: 'Private'}
];

const withCacheBuster = (url) => {
    if (!url || typeof url !== 'string' || url.startsWith('blob:')) {
        return url;
    }
    const base = url.split('?')[0];
    return `${base}?v=${Date.now()}`;
};

const stripMediaQuery = (path) => {
    if (!path || typeof path !== 'string') {
        return '';
    }
    return path.split('?')[0];
};

export default function UpdateProfileInformation({mustVerifyEmail, status, className = ''}) {
    const user = usePage()?.props?.auth?.user || {};

    // //console.log("Usersss",user);


    const [category, setCategory] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedCoverPhoto, setSelectedCoverPhoto] = useState(null);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const fileInputRef = useRef(null);
    const fileInputRefCover = useRef(null);

    const {data, setData, patch,post, errors, processing, recentlySuccessful} = useForm({
        name: user?.name || '',
        email: user?.email || '',
        username: user?.username || '',
        generation: user?.generation || '',
        visibility: String(user?.visibility),
        story: user?.story || '',
        world_message: user?.world_message || '',
        preferences: user?.preferences || [],
        country: user?.country || '',
        city: user?.city || '',
        avatar: user?.avatar || null,
        cover_photo: user?.cover_photo || null,
    });
    useEffect(() => {
        if (user?.avatar) {
            setSelectedPhoto(user.avatar);
            setData('avatar', user.avatar);
        }
        if (user?.cover_photo) {
            setSelectedCoverPhoto(user.cover_photo);
            setData('cover_photo', user.cover_photo);
        }
    }, [user?.avatar, user?.cover_photo]);

    const persistCoverPhoto = (url) => {
        router.post(
            route('user.profile.update'),
            {cover_photo: url},
            {
                preserveScroll: true,
                preserveState: true,
                onError: (submitErrors) => {
                    console.error(submitErrors);
                    alert('Cover photo uploaded but could not be saved to your profile. Please click Save information.');
                },
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('user.profile.update'), {
            preserveScroll: true,
            transform: (formData) => ({
                ...formData,
                avatar: stripMediaQuery(formData.avatar),
                cover_photo: stripMediaQuery(formData.cover_photo),
                preferences: Array.isArray(formData.preferences)
                    ? formData.preferences
                    : [],
            }),
            onError: (submitErrors) => {
                console.error(submitErrors);
            },
        });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedPhoto(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('allowed_types', 'avatar');
        formData.append('current_path', stripMediaQuery(data?.avatar || user?.avatar || ''));

        try {
            const response = await axios.post(route('user.upload.file'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.url) {
                const url = response.data.url;
                setData('avatar', url);
                setSelectedPhoto(withCacheBuster(url));
            } else if (response?.data?.error) {
                console.error(response.data.error);
                alert(response.data.error);
            } else {
                console.error("Failed to get avatar URL from response:", response);
            }
        } catch (error) {
            const data = error?.response?.data;
            const message =
                data?.error
                || data?.message
                || (data?.errors?.file ? data.errors.file[0] : null)
                || 'Error uploading file. Please try again.';
            console.error(message, error);
            alert(message);
        }
    };
    const handleCoverPhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedCoverPhoto(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('allowed_types', 'cover_image');
        formData.append('current_path', stripMediaQuery(data?.cover_photo || user?.cover_photo || ''));

        try {
            const response = await axios.post(route('user.upload.file'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.url) {
                const url = response.data.url;
                setData('cover_photo', url);
                setSelectedCoverPhoto(withCacheBuster(url));
                persistCoverPhoto(url);
            } else if (response?.data?.error) {
                console.error(response.data.error);
                alert(response.data.error);
            } else {
                console.error("Failed to get cover photo URL from response:", response);
            }
        } catch (error) {
            const data = error?.response?.data;
            const message =
                data?.error
                || data?.message
                || (data?.errors?.file ? data.errors.file[0] : null)
                || 'Error uploading cover photo. Please try again.';
            console.error(message, error);
            alert(message);
        }
    };

    const handleDeletePhoto = () => {
        setSelectedPhoto(null);
        setData('avatar', '');
    };
    const handleDeleteCoverPhoto = () => {
        setSelectedCoverPhoto(null);
        setData('cover_photo', '');
        persistCoverPhoto('');
    };

    const handleUploadClick = () => {
        fileInputRef?.current?.click();
    };
    const handleUploadCoverClick = () => {
        fileInputRefCover?.current?.click();
    };

    const handleKeywordAdded = (keyword) => {
        setCategory(keyword);
    };

    return (
        <section className={className}>
            <div className="os-profile__form">


                {recentlySuccessful && (
                    <div className="os-message os-message--success">
                        <Img src='/img/icons/done.svg'/>   Profile updated successfully!
                    </div>
                )}
                <div className="editprofile_sec gap-16">
                    <div className="flex-items os-upload-media">
                        <h2 className="os-title os-title--h4">Profile photo</h2>
                        <div className="os-upload-media__placeholder">
                            {selectedPhoto ? (
                                <img
                                    src={typeof selectedPhoto === 'string' ? selectedPhoto : URL.createObjectURL(selectedPhoto)}
                                    alt="Profile Avatar"
                                    className="os-upload-media__uploaded-photo"
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"
                                    fill="none">
                                    <path
                                        d="M34 15.3333H34.0267M2 10C2 7.87827 2.84286 5.84344 4.34315 4.34315C5.84344 2.84286 7.87827 2 10 2H42C44.1217 2 46.1566 2.84286 47.6569 4.34315C49.1571 5.84344 50 7.87827 50 10V42C50 44.1217 49.1571 46.1566 47.6569 47.6569C46.1566 49.1571 44.1217 50 42 50H10C7.87827 50 5.84344 49.1571 4.34315 47.6569C2.84286 46.1566 2 44.1217 2 42V10Z"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path
                                        d="M2 36.6667L15.3333 23.3334C17.808 20.952 20.8587 20.952 23.3333 23.3334L36.6667 36.6667"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path
                                        d="M31.3335 31.3333L34.0002 28.6666C36.4748 26.2853 39.5255 26.2853 42.0002 28.6666L50.0002 36.6666"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="os-upload-media__input"
                            ref={fileInputRef}
                        />
                        <div className="os-upload-media__buttons">
                            <Button type="button" className='os-btn--fw-bold' onClick={handleUploadClick}>
                                Upload Photo
                            </Button>

                            {selectedPhoto && (
                            <Button
                                fontWeight={'bold'}
                                gap={'16'}
                                variant={'outline'}
                                icon={true}
                                onClick={handleDeletePhoto}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20"
                                    fill="none">
                                    <path
                                        d="M12.5742 3.98828V2.32422H12.75V2.3125V2.30078C12.6533 2.30078 12.5742 2.22165 12.5742 2.125H12.5625H12.5508V2.30078H5.44922V2.125H5.4375H5.42578C5.42578 2.22165 5.34665 2.30078 5.25 2.30078V2.3125V2.32422H5.42578V3.98828H3.76172V2.125C3.76172 1.30413 4.42913 0.636719 5.25 0.636719H12.75C13.5709 0.636719 14.2383 1.30413 14.2383 2.125V3.98828H12.5742ZM5.4375 4.01172H5.44922H12.5508H12.5625H14.25H14.2617H17.25C17.6584 4.01172 17.9883 4.34163 17.9883 4.75V5.5C17.9883 5.59665 17.9092 5.67578 17.8125 5.67578H16.3969H16.3857L16.3852 5.68695L15.8063 17.9448L15.818 17.9453L15.8063 17.9448C15.7691 18.7401 15.1156 19.3633 14.3203 19.3633H3.67969C2.88673 19.3633 2.23094 18.7377 2.19374 17.9448L2.18203 17.9453L2.19374 17.9448L1.61483 5.68695L1.6143 5.67578H1.60312H0.1875C0.0908471 5.67578 0.0117188 5.59665 0.0117188 5.5V4.75C0.0117188 4.34163 0.341628 4.01172 0.75 4.01172H3.73828H3.75H5.4375ZM14.1398 17.6992H14.151L14.1515 17.6881L14.7187 5.68805L14.7193 5.67578H14.707H3.29297H3.28068L3.28126 5.68805L3.84845 17.6881L3.84898 17.6992H3.86016H14.1398Z"
                                        fill="#151617" stroke="#151617" strokeWidth="0.0234375"/>
                                </svg>
                                Delete Photo
                            </Button>
                                )}
                        </div>
                    </div>
                    <div className="flex-items os-upload-media">
                        <h2 className="os-title os-title--h4">Cover photo</h2>
                        <div className="os-upload-media__placeholder os-upload-media__placeholder--cover">
                            {selectedCoverPhoto ? (
                                <img
                                    src={typeof selectedCoverPhoto === 'string' ? selectedCoverPhoto : URL.createObjectURL(selectedCoverPhoto)}
                                    alt="Profile Cover Photo"
                                    className="os-upload-media__uploaded-photo os-upload-media__uploaded-photo--cover"
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"
                                    fill="none">
                                    <path
                                        d="M34 15.3333H34.0267M2 10C2 7.87827 2.84286 5.84344 4.34315 4.34315C5.84344 2.84286 7.87827 2 10 2H42C44.1217 2 46.1566 2.84286 47.6569 4.34315C49.1571 5.84344 50 7.87827 50 10V42C50 44.1217 49.1571 46.1566 47.6569 47.6569C46.1566 49.1571 44.1217 50 42 50H10C7.87827 50 5.84344 49.1571 4.34315 47.6569C2.84286 46.1566 2 44.1217 2 42V10Z"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path
                                        d="M2 36.6667L15.3333 23.3334C17.808 20.952 20.8587 20.952 23.3333 23.3334L36.6667 36.6667"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path
                                        d="M31.3335 31.3333L34.0002 28.6666C36.4748 26.2853 39.5255 26.2853 42.0002 28.6666L50.0002 36.6666"
                                        stroke="#8E8E8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverPhotoChange}
                            className="os-upload-media__input"
                            ref={fileInputRefCover}
                        />
                        <div className="os-upload-media__buttons">
                            <Button type="button" className='os-btn--fw-bold' onClick={handleUploadCoverClick}>
                                Upload Cover Photo
                            </Button>

                            {selectedCoverPhoto && (
                                <Button
                                    fontWeight={'bold'}
                                    gap={'16'}
                                    variant={'outline'}
                                    icon={true}
                                    onClick={handleDeleteCoverPhoto}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20"
                                        fill="none">
                                        <path
                                            d="M12.5742 3.98828V2.32422H12.75V2.3125V2.30078C12.6533 2.30078 12.5742 2.22165 12.5742 2.125H12.5625H12.5508V2.30078H5.44922V2.125H5.4375H5.42578C5.42578 2.22165 5.34665 2.30078 5.25 2.30078V2.3125V2.32422H5.42578V3.98828H3.76172V2.125C3.76172 1.30413 4.42913 0.636719 5.25 0.636719H12.75C13.5709 0.636719 14.2383 1.30413 14.2383 2.125V3.98828H12.5742ZM5.4375 4.01172H5.44922H12.5508H12.5625H14.25H14.2617H17.25C17.6584 4.01172 17.9883 4.34163 17.9883 4.75V5.5C17.9883 5.59665 17.9092 5.67578 17.8125 5.67578H16.3969H16.3857L16.3852 5.68695L15.8063 17.9448L15.818 17.9453L15.8063 17.9448C15.7691 18.7401 15.1156 19.3633 14.3203 19.3633H3.67969C2.88673 19.3633 2.23094 18.7377 2.19374 17.9448L2.18203 17.9453L2.19374 17.9448L1.61483 5.68695L1.6143 5.67578H1.60312H0.1875C0.0908471 5.67578 0.0117188 5.59665 0.0117188 5.5V4.75C0.0117188 4.34163 0.341628 4.01172 0.75 4.01172H3.73828H3.75H5.4375ZM14.1398 17.6992H14.151L14.1515 17.6881L14.7187 5.68805L14.7193 5.67578H14.707H3.29297H3.28068L3.28126 5.68805L3.84845 17.6881L3.84898 17.6992H3.86016H14.1398Z"
                                            fill="#151617" stroke="#151617" strokeWidth="0.0234375"/>
                                    </svg>
                                    Delete Cover Photo
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="os-text os-text--c-grey os-text--sm" style={{ textAlign: 'center' }}>
                    We recommend uploading photos up to 5 MB in size.
                </div>
                <div className="os-profile__form os-profile__form--personal">
                    <h2 className="os-title os-title--h4">Personal information</h2>
                    <form onSubmit={submit} className="os-form os-form--gap-23 editpro_form">
                        <InputLabel>
                            Your Name
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                autoComplete="username"
                                isFocused={true}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.name}/>
                        </InputLabel>
                        <InputLabel>
                            Username
                            <TextInput
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.username}/>
                        </InputLabel>
                        <InputLabel>
                            Generation
                            <Select
                                id="generation"
                                value={data.generation}
                                options={generations}
                                onChange={(e) => setData('generation', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.generation}/>
                        </InputLabel>
                        <InputLabel>
                            Your story
                            <Textarea
                                id="story"
                                type="text"
                                placeholder="Write about yourself"
                                value={data.story}
                                onChange={(e) => setData('story', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.story}/>
                        </InputLabel>
                        <InputLabel>
                            My universal message to the world
                            <Textarea
                                id="world_message"
                                type="text"
                                placeholder="For example: “no more war, no more bloodshed”"
                                value={data.world_message}
                                onChange={(e) => setData('world_message', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.world_message}/>
                        </InputLabel>
                        <InputLabel>
                            Profile Visibility
                            <Select
                                id="visibility"
                                value={data.visibility}
                                options={profilePrivacies}
                                onChange={(e) => setData('visibility', String(e.target.value))}
                            />
                            <InputError className="mt-2" message={errors.visibility}/>
                        </InputLabel>

                        <div className="os-delimeter"></div>
                        <Button disabled={processing} fontWeight={'bold'} fullWidthMob={true}>Save information</Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
