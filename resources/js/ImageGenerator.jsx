import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/image-generator.css';
import '../css/form.css';
import Button from "@/Components/UI/Button.jsx";
import { InputError, InputLabel, Textarea } from "@/Components/UI/Form.jsx";
import { usePage } from '@inertiajs/react';

export default function ImageGenerator() {
    const user = usePage().props.auth.user;
    const storedCount = localStorage.getItem(`imageGenerationCount_${user.id}`);
    const [imageGenerationCount, setImageGenerationCount] = useState(storedCount ? parseInt(storedCount) : 6);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);
    const [format, setFormat] = useState('png');

    useEffect(() => {
        localStorage.setItem(`imageGenerationCount_${user.id}`, imageGenerationCount);
    }, [imageGenerationCount, user.id]);

    const checkImageStatus = async (predictionId) => {
        try {
            const statusResponse = await axios.get(`/generation/check-status/${predictionId}`);
            const statusData = statusResponse.data;

            if (statusData.status === 'succeeded') {
                const imageUrl = statusData.output;
                const uploadResponse = await saveImageOnServer(imageUrl);
                setImageUrl(uploadResponse.url);
                setLoading(false);
            } else {
                setTimeout(() => checkImageStatus(predictionId), 5000);
            }
        } catch (err) {
            setError('Error fetching image status');
            setLoading(false);
        }
    };

    const saveImageOnServer = async (imageUrl) => {
        try {
            const response = await axios.post('/upload', { imageUrl });
            return response.data;
        } catch (err) {
            console.error('Error uploading image to server:', err);
            setError('Error saving image');
        }
    };

    const generateImage = async () => {
        if (imageGenerationCount <= 0) {
            setError('You have reached the limit of 6 image generations for this story.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/generation/image', { prompt, width, height, format });
            const { id } = response.data;
            checkImageStatus(id);
            setImageGenerationCount(prev => prev - 1);
        } catch (err) {
            console.error('Error generating image:', err);
            setError('Error generating image');
            setLoading(false);
        }
    };

    return (
        <>
            <div className="os-image-generator">
                <div className="os-image-generator__title-block">
                    <h5 className="os-title os-title--h4 os-title--center">Generate Image</h5>
                    <div className="os-text os-title--center">Generate an image using Generative AI by describing what you want to see.</div>
                </div>
                <div className={'os-image-generator__wrapper'}>
                    <div className="os-image-generator__form">
                        <h5 className="os-title os-title--h5">Image describe</h5>
                        <InputLabel>
                            Prompt
                            <Textarea
                                type="text"
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image..."
                            />
                        </InputLabel>
                        <Button className="os-btn" onClick={generateImage} disabled={loading} fontWeight={'bold'}>
                            {loading ? 'Generating...' : 'Generate Image'}
                        </Button>
                        {error && <p className="os-image-generator__error">{error}</p>}
                    </div>
                    <div>
                        <h5 className="os-title os-title--h5">Image preview</h5>
                        <div className="os-image-generator__output">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Generated"
                                    className="os-image-generator__image"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/uri-list', imageUrl);
                                    }}
                                />
                            )}
                        </div>
                        <div className='os-image-generator__output-message'>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19" fill="none">
                                    <path d="M21.2 15.6335L13.0016 1.39569C12.7967 1.04687 12.5042 0.757642 12.1532 0.556681C11.8021 0.35572 11.4046 0.25 11 0.25C10.5955 0.25 10.198 0.35572 9.8469 0.556681C9.49581 0.757642 9.20334 1.04687 8.99847 1.39569L0.800029 15.6335C0.602907 15.9709 0.499023 16.3546 0.499023 16.7454C0.499023 17.1361 0.602907 17.5199 0.800029 17.8572C1.00228 18.2082 1.29425 18.499 1.64599 18.6998C1.99773 18.9006 2.39658 19.0043 2.80159 19.0001H19.1985C19.6032 19.0039 20.0016 18.9001 20.353 18.6993C20.7044 18.4985 20.9961 18.2079 21.1982 17.8572C21.3956 17.52 21.4998 17.1364 21.5001 16.7456C21.5004 16.3549 21.3969 15.9711 21.2 15.6335ZM19.8997 17.1063C19.8282 17.2282 19.7256 17.3289 19.6024 17.3981C19.4792 17.4673 19.3398 17.5025 19.1985 17.5001H2.80159C2.66029 17.5025 2.52088 17.4673 2.39765 17.3981C2.27442 17.3289 2.17181 17.2282 2.10034 17.1063C2.0356 16.9967 2.00145 16.8717 2.00145 16.7444C2.00145 16.6171 2.0356 16.4922 2.10034 16.3826L10.2988 2.14475C10.3717 2.02341 10.4748 1.92301 10.598 1.8533C10.7212 1.7836 10.8603 1.74696 11.0019 1.74696C11.1435 1.74696 11.2826 1.7836 11.4058 1.8533C11.529 1.92301 11.6321 2.02341 11.705 2.14475L19.9035 16.3826C19.9676 16.4925 20.0011 16.6176 20.0005 16.7449C19.9998 16.8722 19.965 16.997 19.8997 17.1063ZM10.25 11.5001V7.75006C10.25 7.55115 10.329 7.36038 10.4697 7.21973C10.6104 7.07908 10.8011 7.00006 11 7.00006C11.1989 7.00006 11.3897 7.07908 11.5304 7.21973C11.671 7.36038 11.75 7.55115 11.75 7.75006V11.5001C11.75 11.699 11.671 11.8897 11.5304 12.0304C11.3897 12.171 11.1989 12.2501 11 12.2501C10.8011 12.2501 10.6104 12.171 10.4697 12.0304C10.329 11.8897 10.25 11.699 10.25 11.5001ZM12.125 14.8751C12.125 15.0976 12.059 15.3151 11.9354 15.5001C11.8118 15.6851 11.6361 15.8293 11.4305 15.9144C11.225 15.9996 10.9988 16.0219 10.7806 15.9784C10.5623 15.935 10.3619 15.8279 10.2045 15.6706C10.0472 15.5132 9.94005 15.3128 9.89665 15.0945C9.85324 14.8763 9.87552 14.6501 9.96066 14.4445C10.0458 14.239 10.19 14.0633 10.375 13.9397C10.56 13.816 10.7775 13.7501 11 13.7501C11.2984 13.7501 11.5845 13.8686 11.7955 14.0796C12.0065 14.2905 12.125 14.5767 12.125 14.8751Z" fill="black"/>
                                </svg>
                            </div>
                            <span className='os-text'>
                               To use this image in your video, download the image and upload it into the video editor above.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
