import React, {useEffect, useState, useRef} from 'react';
import {InputLabel, InputError, TextInput, Select} from "@/Components/UI/Form.jsx";
import Button from "@/Components/UI/Button.jsx";

import {useForm, usePage} from '@inertiajs/react';
import axios from 'axios';
const categoriesList = [
    "",
    "Relationships",
    "Sexual Identity",
    "War",
    "Compassion",
    "Grief",
    "Substance Abuse",
    "Conquering Fears",
    "Domestic Abuse",
    "Motherhood",
    "Art",
    "Music",
    "New Beginnings"
];
export default function CreateStory({videoData}) {
    const user = usePage().props.auth.user;
    const {data, setData, post, processing, errors} = useForm({
        user_id: user.id,
        name: '',
        src: '',
        thumbnail: null,
        categories: [],
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [videoDimensions, setVideoDimensions] = useState({width: 640, height: 360});
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const storedCount = localStorage.getItem(`imageGenerationCount_${user.id}`);
    const [imageGenerationCount, setImageGenerationCount] = useState(storedCount ? parseInt(storedCount) : 10);

    useEffect(() => {
        if (videoData && videoData.videoUrl) {
            const fileName = videoData.videoUrl.split('/').pop();
            setData('src', fileName);
            generateThumbnail(videoData.videoUrl);
        }
    }, [videoData]);

    useEffect(() => {
        if (data.name && data.src && data.categories.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [data]);

    useEffect(() => {
        localStorage.setItem(`imageGenerationCount_${user.id}`, imageGenerationCount);
    }, [imageGenerationCount, user.id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedFile(file);
        }
    };

    const handleUploadClick = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('allowed_types', 'video');

            setIsUploading(true);
            setUploadProgress(0);
            setUploadSuccess(false);
            setUploadError(null);

            try {
                const response = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                });

                const fileName = response.data.fileName;
                setData('src', fileName);
                generateThumbnail(selectedFile);
                setUploadSuccess(true);
            } catch (error) {
                console.error('Error uploading video:', error);
                setUploadError('Error uploading video. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const generateThumbnail = (file) => {
        let videoUrl;

        if (file instanceof Blob || file instanceof File) {
            videoUrl = URL.createObjectURL(file);
        } else if (typeof file === 'string') {
            videoUrl = file;
        } else {
            console.error('The file provided is not a valid Blob/File or URL string.');
            return;
        }

        const video = document.createElement('video');
        video.src = videoUrl;
        video.preload = 'metadata';

        video.addEventListener('loadedmetadata', () => {
            const { videoWidth, videoHeight } = video;
            setVideoDimensions({ width: videoWidth, height: videoHeight });
            video.currentTime = 3;
        });

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            const canvasWidth = videoDimensions.width * 2;
            const canvasHeight = videoDimensions.height * 2;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
            const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
            ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.55);
            setThumbnail(thumbnailDataUrl);
            setData((prevData) => ({
                ...prevData,
                thumbnail: new File([dataURLtoBlob(thumbnailDataUrl)], 'thumbnail.jpg', { type: 'image/jpeg' }),
            }));

            if (file instanceof Blob || file instanceof File) {
                URL.revokeObjectURL(videoUrl);
            }
        });

        video.addEventListener('error', (error) => {
            console.error('Error loading video for thumbnail generation:', error);
        });

        video.load();
    };

    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    };

    const handleKeywordChange = (selectedKeywords) => {
        setData('categories', selectedKeywords);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await post(route('user.stories.store'), {
            forceFormData: true,
            onSuccess: () => {
                console.log('Success')
                localStorage.removeItem('video-scene');
            },
            onError: () => {
            }
        });


        setImageGenerationCount(10);
    };

    return (
        <form className="os-form os-form--create-stories" onSubmit={handleSubmit}>
            <h2 className="os-title os-title--h4">Create a Story</h2>
            <InputLabel>
                Name
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Story Name"
                    onChange={(e) => setData('name', e.target.value)}
                />
            </InputLabel>
            <InputError message={errors.name}/>
            {!videoData?.videoUrl && (
                <>
                    <InputLabel>
                        Video Upload
                        <TextInput
                            type="file"
                            accept="video/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </InputLabel>
                    <div className={'os-form__row'}>
                        <div onClick={handleUploadClick}
                             className="os-btn os-btn--primary os-btn--fw-bold os-btn--upload">
                            Upload
                        </div>
                        {isUploading && (
                            <div className="os-message os-message--success">
                                <p>Progress: {uploadProgress}%</p>
                            </div>
                        )}
                        {uploadSuccess && (
                            <div className="os-message os-message--success">
                                Video uploaded successfully!
                            </div>
                        )}
                        {uploadError && (
                            <div className="os-message os-message--error">
                                {uploadError}
                            </div>
                        )}
                    </div>
                </>
            )}
            <InputError message={errors.src}/>
            {data.src && (
                <>
                    <InputLabel>
                        Categories
                        <Select
                            id="categories"
                            name="categories"
                            value={data.categories[0] || ''}
                            onChange={(e) => setData('categories', [e.target.value])}
                            options={categoriesList.map(category => ({
                                value: category,
                                label: category
                            }))}
                        />
                        <InputError message={errors.categories} />
                    </InputLabel>

                    <InputError message={errors.categories}/>
                    <div className="os-delimeter"></div>
                    <Button
                        type="submit"
                        className="os-btn--fw-bold os-btn--gap-16"
                        processing={processing}
                        disabled={processing || !isFormValid}
                        fontWeight={'bold'}
                    >
                        Create Story
                    </Button>
                </>
            )}
            {data.src === '' && (
                <>
                <div className="os-pc-content">
                    <div className="os-message os-message--error">
                        Please export a video from the editor or upload a video file to create a story
                    </div>
                </div>
                <div className="os-mob-content">
                    <div className="os-message os-message--error">
                    Please use our app to use our editing platfrom on your mobile
                    </div>
                </div>
                </>
            )}
            {processing && (
                <div className="os-message os-message--success">
                    Uploading, please wait...
                </div>
            )}
        </form>
    );
}
