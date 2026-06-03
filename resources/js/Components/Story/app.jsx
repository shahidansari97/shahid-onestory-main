import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { EditorRedirectionProvider } from '@/Contexts/EditorRedirectionContext';
import { GlobalSoundProvider } from '@/Contexts/GlobalSoundContext';
import { MuteProvider } from '@/Contexts/MuteContext';
import { captureUTMParams } from '@/Utils/analytics';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
import { Toaster } from "react-hot-toast";

// HeadlessUI UA guard: some Safari/iOS environments lack userAgentData
try {
    if (typeof navigator !== 'undefined' && !('userAgentData' in navigator)) {
        Object.defineProperty(navigator, 'userAgentData', {
            value: { brands: [], platform: navigator.platform || '' },
            configurable: true,
        });
    }
} catch (_) {}
const RootComponent = ({ children }) => {
    return children;
};
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        captureUTMParams();
        const root = createRoot(el);
        const { auth } = props.initialPage.props;
        const userId = auth?.user?.id;
        console.log("userId in app",userId)
        root.render(
            <EditorRedirectionProvider userId={userId}>
                <GlobalSoundProvider>
                    <MuteProvider>
                        <RootComponent>
                            <App {...props} />
                            <Toaster position="bottom-center" />
                        </RootComponent>
                    </MuteProvider>
                </GlobalSoundProvider>
            </EditorRedirectionProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
