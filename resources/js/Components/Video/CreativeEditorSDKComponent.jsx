import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../../css/video-player.css';

export default function CreativeEditorSDKComponent({ onVideoUpload, initialScene }) {
    const cesdk_container = useRef(null);
    const [cesdk, setCesdk] = useState(null);
    const [exportMessage, setExportMessage] = useState("Exporting video...");
    const [isExporting, setIsExporting] = useState(false);
    const onVideoUploadRef = useRef(onVideoUpload);


    useEffect(() => {
        onVideoUploadRef.current = onVideoUpload;
    }, [onVideoUpload]);

    useEffect(() => {
        if (cesdk) {
            const intervalId = setInterval(async () => {
                try {
                    const scene = await cesdk.save();
                    console.log('Scene saved every 5 min');

                    config.callbacks.onSave(scene);
                } catch (error) {
                    console.error('Failed to save scene', error);
                }
            }, 60000);

            return () => clearInterval(intervalId);
        }
    }, [cesdk]);

    const config = {
        license: import.meta.env.VITE_CESDK_LICENSE,
        userId: import.meta.env.VITE_CESDK_USER_ID,
        baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.42.0/assets',


        ui: {
            scale: 'large',
            elements: {
                view: 'default',
                panels: {
                    settings: true,
                },
                navigation: {
                    position: 'top',
                    action: {
                        load: false,
                        download: false,
                        export: true,
                        save: false,
                    },
                },
                appearance: {
                    theme: {
                        backgroundColor: '#282828',
                        accentColor: '#CBCFFF',
                        activeColor: '#BFC2E9',
                    },
                },
            },
        },
        callbacks: {
            onUpload: async (file, onProgress) => {
                try {
                    if (file.type.startsWith('video/')) {
                        const videoURL = URL.createObjectURL(file);
                        const thumbUri = await extractVideoFrame(videoURL);
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('allowed_types', 'video');

                        const response = await axios.post('/stories/upload-media', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            onUploadProgress: (progressEvent) => {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                if (onProgress) {
                                    onProgress(percentCompleted);
                                }
                            },
                        });

                        if (response.status === 200) {
                            const { fileName, url } = response.data;

                            // Save uploaded file to local storage
                            let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                            uploadedFiles.push({
                                id: fileName,
                                meta: {
                                    uri: `https://onestoryplanet.com/${url}`,
                                    thumbUri,
                                }
                            });
                            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                            
                            return Promise.resolve({
                                id: fileName,
                                meta: {
                                    uri: `https://onestoryplanet.com/${url}`,
                                    thumbUri,
                                },
                            })
                        } else {
                            return Promise.reject('Failed to upload media');
                        }
                    } else {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('allowed_types', 'image');

                        const response = await axios.post('/stories/upload-media', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            onUploadProgress: (progressEvent) => {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                if (onProgress) {
                                    onProgress(percentCompleted);
                                }
                            },
                        });

                        if (response.status === 200) {
                            const { fileName, url } = response.data;

                            // Save uploaded file to local storage
                            let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                            uploadedFiles.push({
                                id: fileName,
                                meta: {
                                    uri: `https://onestoryplanet.com/${url}`,
                                    thumbUri: `https://onestoryplanet.com/${url}`,
                                }
                            });
                            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

                            return {
                                id: fileName,
                                meta: {
                                    uri: `https://onestoryplanet.com/${url}`,
                                    thumbUri: `https://onestoryplanet.com/${url}`,
                                },
                            };
                        } else {
                            return Promise.reject('Failed to upload media');
                        }
                    }
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            onExport: async (blobs, options) => {
                setExportMessage("Exporting video...");
                setIsExporting(true);

                const videoBlob = blobs[0];
                const formData = new FormData();
                formData.append('file', videoBlob, `cesdk-${new Date().toISOString()}.mp4`);
                formData.append('allowed_types', 'video');

                try {
                    const response = await axios.post('/stories/upload-media', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (response.status === 200) {
                        const videoData = {
                            videoName: response.data.fileName,
                            videoUrl: response.data.url,
                        };
                        setExportMessage("Video exported successfully!");
                        if (onVideoUploadRef.current) {
                            onVideoUploadRef.current(videoData);
                        }

                        const targetElement = document.querySelector('.os-form--create-stories');
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    } else {
                        setExportMessage("Failed to upload video.");
                    }
                } catch (error) {
                    setExportMessage("Error uploading video.");
                }

                setTimeout(() => setIsExporting(false), 5000);

                return Promise.resolve();
            },
            onSave: async (scene) => {
                try {
                    const sceneJSON = JSON.stringify(scene, null, 2);
                    const blob = new Blob([sceneJSON], { type: 'application/json' });

                    const formData = new FormData();
                    formData.append('file', blob, `cesdk-scene-${new Date().toISOString()}.json`);
                    formData.append('allowed_types', 'json');

                    const response = await axios.post('/stories/save-draft', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            },
            onLoad: async () => {
                console.log("test onLoad");
                if (initialScene) {
                    return initialScene;
                }
            },
        },
    };


    const extractVideoFrame = (videoURL) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = videoURL;
            video.crossOrigin = 'anonymous';
            video.preload = 'metadata';
            video.muted = true;

            video.addEventListener('loadeddata', () => {
                video.currentTime = 1;
            });

            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const thumbnail = canvas.toDataURL('image/jpeg');
                resolve(thumbnail);
            });

            video.addEventListener('error', (e) => {
                reject('Failed to extract video frame');
            });
        });
    };

    useEffect(() => {
        if (!cesdk_container.current) return;
        let cleanedUp = false;
        let instance;

        CreativeEditorSDK.create(cesdk_container.current, config).then(
            async (_instance) => {

                instance = _instance;

                if (cleanedUp) {
                    instance.dispose();
                    return;
                }

                await Promise.all([
                    instance.addDefaultAssetSources(),
                    instance.addDemoAssetSources({ sceneMode: 'Video' })
                ]);

                instance.ui.setBackgroundTrackAssetLibraryEntries(['ly.img.image', 'ly.img.video']);

                const width = 1920;
                const height = 1080;
                const unit = 'Pixel';


                const storage = window.localStorage.getItem('video-scene');
                if (storage !== null) {
                    await instance.engine.scene.loadFromString(storage);
                } else if (initialScene) {
                    await instance.loadFromString(initialScene);
                } else {
                    await instance.createVideoScene({ width, height, unit });
                }

                // Add custom asset source
                const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
                instance.engine.asset.addSource({
                    id: 'emptySource',
                    findAssets: () => {
                        return Promise.resolve({
                            assets: uploadedFiles,
                            total: 0,
                            currentPage: 1,
                            nextPage: undefined,
                        });
                    },
                });

                instance.ui.addAssetLibraryEntry({
                    id: 'empty-custom-asset-source',
                    sourceIds: ['emptySource'],
                    previewLength: 3,
                    gridColumns: 3,
                    gridItemHeight: 'square',
                    previewBackgroundType: 'contain',
                    gridBackgroundType: 'contain',
                    icon: ({ theme, iconSize }) => {
                        if (theme === 'dark') {
                            if (iconSize === 'normal') {
                                return 'https://img.ly/static/cesdk/guides/icon-normal-dark.svg';
                            } else {
                                return 'https://img.ly/static/cesdk/guides/icon-large-dark.svg';
                            }
                        }

                        if (iconSize === 'normal') {
                            return 'https://img.ly/static/cesdk/guides/icon-normal-light.svg';
                        } else {
                            return 'https://img.ly/static/cesdk/guides/icon-large-light.svg';
                        }
                    },
                });

                instance.ui.addAssetLibraryEntry({
                    id: 'empty-custom-asset-source-for-replace',
                    sourceIds: ['emptySource'],
                    previewLength: 3,
                    gridColumns: 3,
                    gridItemHeight: 'square',
                });

                instance.ui.setDockOrder([
                    ...instance.ui.getDockOrder(),
                    {
                        id: 'ly.img.assetLibrary.dock',
                        key: 'empty-custom-asset-source',
                        icon: '@imgly/CustomLibrary',
                        label: 'Your library',
                        entries: ['empty-custom-asset-source'],
                    },

                ]);
                // End of custom asset source


                setCesdk(instance);

                let saveCallback = null;

                instance.engine.event.subscribe([], async () => {
                    if (saveCallback !== null) {
                        window.clearTimeout(saveCallback);
                    }
                    saveCallback = window.setTimeout(async () => {
                        const scene = await instance.engine.scene.saveToString();
                        window.localStorage.setItem('video-scene', scene);
                        saveCallback = null;
                    }, 1000);
                });
            }
        );

        const cleanup = () => {
            cleanedUp = true;
            instance?.dispose();
            setCesdk(null);
        };
        return cleanup;
    }, [cesdk_container]);

    return (
        <>
            <div
                ref={cesdk_container}
                style={{ width: '100vw', height: '95vh' }}
                className={'os-profile__video-editor'}
            ></div>
            {isExporting && (
                <div className={'os-message os-message--success os-message--video-export'}>
                    {exportMessage}
                </div>
            )}
        </>
    );
}
