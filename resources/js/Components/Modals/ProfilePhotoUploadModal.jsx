import { useEffect, useRef, useState } from 'react';
import {
    saveProfilePhoto,
    uploadProfilePhoto,
} from '@/Utils/profilePhoto';
import '../../../css/profile-photo-modal.css';

export default function ProfilePhotoUploadModal({
    show,
    user,
    onClose,
    onComplete,
}) {
    const fileInputRef = useRef(null);
    const [step, setStep] = useState('prompt');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!show) {
            setStep('prompt');
            setPreviewUrl(null);
            setSelectedFile(null);
            setUploadedAvatarUrl(null);
            setIsUploading(false);
            setError('');
        }
    }, [show]);

    if (!show) {
        return null;
    }

    const handleChoosePhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please choose an image file.');
            return;
        }

        setError('');
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setStep('preview');
        event.target.value = '';
    };

    const handleSaveProfilePhoto = async () => {
        if (!selectedFile || isUploading) {
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const uploadedUrl = await uploadProfilePhoto(selectedFile, user?.avatar || '');
            const savedAvatarUrl = await saveProfilePhoto(uploadedUrl);
            setUploadedAvatarUrl(savedAvatarUrl);
            await onComplete?.(savedAvatarUrl);
        } catch (uploadError) {
            const message =
                uploadError?.response?.data?.error
                || uploadError?.response?.data?.message
                || uploadError?.message
                || 'Failed to upload profile photo. Please try again.';
            setError(message);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePostLater = () => {
        onClose?.();
    };

    const previewSource = uploadedAvatarUrl || previewUrl;

    return (
        <div className="profile-photo-modal" role="dialog" aria-modal="true" aria-labelledby="profile-photo-modal-title">
            <div className="profile-photo-modal__backdrop" onClick={handlePostLater} aria-hidden="true" />

            <div className={`profile-photo-modal__panel${step === 'prompt' ? ' profile-photo-modal__panel--prompt' : ' profile-photo-modal__panel--preview'}`}>
                <button
                    type="button"
                    className="profile-photo-modal__close"
                    onClick={handlePostLater}
                    aria-label="Close"
                >
                    ×
                </button>

                {step === 'prompt' ? (
                    <>
                        <p id="profile-photo-modal-title" className="profile-photo-modal__title profile-photo-modal__title--prompt">
                            Please post a profile photo to publish your message.
                        </p>

                        <div className="profile-photo-modal__actions profile-photo-modal__actions--prompt">
                            <button
                                type="button"
                                className="profile-photo-modal__link-btn"
                                onClick={handlePostLater}
                            >
                                Post Later
                            </button>
                            <button
                                type="button"
                                className="profile-photo-modal__primary-btn profile-photo-modal__primary-btn--compact"
                                onClick={handleChoosePhoto}
                            >
                                Upload profile photo
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p id="profile-photo-modal-title" className="profile-photo-modal__title profile-photo-modal__title--preview">
                            Preview your profile photo
                        </p>
                        <p className="profile-photo-modal__subtitle profile-photo-modal__subtitle--preview">
                            This is how your photo will appear on your profile and messages.
                        </p>

                        <div className="profile-photo-modal__preview-wrap">
                            {previewSource ? (
                                <img
                                    src={previewSource}
                                    alt="Profile preview"
                                    className="profile-photo-modal__preview"
                                />
                            ) : (
                                <div className="profile-photo-modal__preview profile-photo-modal__preview--empty" />
                            )}
                        </div>

                        {error ? (
                            <p className="profile-photo-modal__error">{error}</p>
                        ) : null}

                        <div className="profile-photo-modal__actions profile-photo-modal__actions--preview">
                            <button
                                type="button"
                                className="profile-photo-modal__primary-btn profile-photo-modal__primary-btn--save"
                                onClick={handleSaveProfilePhoto}
                                disabled={isUploading || !selectedFile}
                            >
                                {isUploading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                className="profile-photo-modal__link-btn profile-photo-modal__link-btn--preview"
                                onClick={handleChoosePhoto}
                                disabled={isUploading}
                            >
                                Choose a different photo
                            </button>
                        </div>
                    </>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-photo-modal__input"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
