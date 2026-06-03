import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hasProfilePhoto, refreshAuthUser } from '@/Utils/profilePhoto';

export default function useProfilePhotoPublishGate(user) {
    const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
    const [savedAvatarUrl, setSavedAvatarUrl] = useState(null);
    const pendingPublishRef = useRef(null);
    const savedAvatarRef = useRef(null);

    useEffect(() => {
        if (hasProfilePhoto(user)) {
            setSavedAvatarUrl(null);
            savedAvatarRef.current = null;
        }
    }, [user?.avatar]);

    const effectiveUser = useMemo(() => {
        if (savedAvatarUrl) {
            return { ...user, avatar: savedAvatarUrl };
        }
        return user;
    }, [user, savedAvatarUrl]);

    const userHasProfilePhoto = useMemo(
        () => hasProfilePhoto(effectiveUser),
        [effectiveUser]
    );

    const displayAvatar = savedAvatarUrl || user?.avatar || null;

    const requestPublish = useCallback((publishAction) => {
        if (typeof publishAction !== 'function') {
            return;
        }

        if (hasProfilePhoto(effectiveUser)) {
            publishAction();
            return;
        }

        pendingPublishRef.current = publishAction;
        setShowProfilePhotoModal(true);
    }, [effectiveUser]);

    const closeProfilePhotoModal = useCallback(() => {
        setShowProfilePhotoModal(false);
        pendingPublishRef.current = null;
    }, []);

    const completeProfilePhotoUpload = useCallback(async (avatarUrl) => {
        if (avatarUrl) {
            savedAvatarRef.current = avatarUrl;
            setSavedAvatarUrl(avatarUrl);
        }

        pendingPublishRef.current = null;
        setShowProfilePhotoModal(false);

        try {
            await refreshAuthUser();
        } catch (error) {
            console.error('Failed to refresh profile photo in session:', error);
        }
    }, []);

    return {
        showProfilePhotoModal,
        requestPublish,
        closeProfilePhotoModal,
        completeProfilePhotoUpload,
        displayAvatar,
        userHasProfilePhoto,
        effectiveUser,
    };
}
