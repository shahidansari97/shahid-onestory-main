import axios from 'axios';
import { router } from '@inertiajs/react';

export const DEFAULT_AVATAR_PATHS = ['/img/avatar.png', 'img/avatar.png'];

export const stripMediaQuery = (path) => {
    if (!path || typeof path !== 'string') {
        return '';
    }
    return path.split('?')[0];
};

export const withCacheBuster = (url) => {
    if (!url || typeof url !== 'string' || url.startsWith('blob:')) {
        return url;
    }
    const base = url.split('?')[0];
    return `${base}?v=${Date.now()}`;
};

export const hasProfilePhoto = (user) => {
    const avatar = stripMediaQuery(user?.avatar || '');
    if (!avatar) {
        return false;
    }

    return !DEFAULT_AVATAR_PATHS.some((defaultPath) => {
        return avatar === defaultPath || avatar.endsWith(defaultPath);
    });
};

export const uploadProfilePhoto = async (file, currentAvatar = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowed_types', 'avatar');
    formData.append('current_path', stripMediaQuery(currentAvatar));

    const response = await axios.post(route('user.upload.file'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response?.data?.url) {
        return response.data.url;
    }

    if (response?.data?.error) {
        throw new Error(response.data.error);
    }

    throw new Error('Failed to upload profile photo.');
};

export const saveProfilePhoto = async (avatarUrl) => {
    const response = await axios.post(
        route('user.profile.update'),
        { avatar: stripMediaQuery(avatarUrl) },
        {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }
    );

    if (response?.data?.success) {
        return withCacheBuster(response.data.avatar || avatarUrl);
    }

    const validationMessage = response?.data?.errors?.avatar?.[0];
    throw new Error(validationMessage || response?.data?.message || 'Could not save profile photo.');
};

export const refreshAuthUser = () => new Promise((resolve) => {
    router.reload({
        only: ['auth'],
        preserveScroll: true,
        preserveState: true,
        onFinish: () => resolve(),
    });
});
