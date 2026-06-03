import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef, useState } from 'react';

const config = {
    license: 'QfBCwbxt8ZsYvObWD1vU4UfZwowEnnwsF4nbgT3Df2V8KwA49Wec2LRNzNoNTEeU',
    userId: 'guides-user',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.34.0/assets',
    ui: {
        elements: {
            view: 'default',
            panels: {
                settings: true,
            },
            navigation: {
                position: 'top',
                action: {
                    save: true,
                    load: true,
                    download: true,
                    export: true,
                },
            },
        },
    },
    callbacks: {
        onUpload: 'local',
        onSave: (scene) => {
            const element = document.createElement('a');
            const base64Data = btoa(unescape(encodeURIComponent(scene)));
            element.setAttribute(
                'href',
                `data:application/octet-stream;base64,${base64Data}`
            );
            element.setAttribute(
                'download',
                `cesdk-${new Date().toISOString()}.scene`
            );

            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
    },
};

export default function CreativeEditorSDKComponent() {
    const cesdk_container = useRef(null);
    const [cesdk, setCesdk] = useState(null);

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

                await instance.createVideoScene();

                setCesdk(instance);
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
        <div
            ref={cesdk_container}
            style={{ width: '100vw', height: '100vh' }}
            className={'os-profile__video-editor'}
        ></div>
    );
}
