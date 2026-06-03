import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { EditorRedirectionProvider } from '@/Contexts/EditorRedirectionContext';
import { GlobalSoundProvider } from '@/Contexts/GlobalSoundContext';
import { MuteProvider } from '@/Contexts/MuteContext';
import VisitorDurationTracker from '@/Components/Analytics/VisitorDurationTracker';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
import { Toaster } from "react-hot-toast";

const pages = import.meta.glob('./Pages/**/*.{js,jsx,ts,tsx}');

const resolveInertiaPage = (name) => {
    const normalizedName = String(name || '').replace(/\\/g, '/').replace(/^\/+/, '');
    const directCandidates = [
        `./Pages/${normalizedName}.jsx`,
        `./Pages/${normalizedName}.js`,
        `./Pages/${normalizedName}.tsx`,
        `./Pages/${normalizedName}.ts`,
    ];

    for (const candidate of directCandidates) {
        if (pages[candidate]) {
            return pages[candidate]();
        }
    }

    const loweredRequested = `./pages/${normalizedName}`.toLowerCase();
    const fuzzyMatchKey = Object.keys(pages).find((key) => {
        const loweredKey = key.toLowerCase();
        return loweredKey === `${loweredRequested}.jsx`
            || loweredKey === `${loweredRequested}.js`
            || loweredKey === `${loweredRequested}.tsx`
            || loweredKey === `${loweredRequested}.ts`;
    });

    if (fuzzyMatchKey) {
        return pages[fuzzyMatchKey]();
    }

    if (normalizedName === 'Home/Index') {
        const homeFallbackCandidates = [
            './Pages/Home/Index_latestworking10042026.jsx',
            './Pages/Home/Index_working_code10042026.jsx',
            './Pages/Home/Index_working_10042026.jsx',
            './Pages/Home/Index_07042026_newwithnewdesign.jsx',
            './Pages/Home/Index_02042026_local_backup.jsx',
            './Pages/Home/Index_31032026.jsx',
            './Pages/Home/Index30032026.jsx',
            './Pages/Home/IndexWorking10032026.jsx',
            './Pages/Home/Index060226.jsx',
        ];

        const explicitFallback = homeFallbackCandidates.find((candidate) => pages[candidate]);
        if (explicitFallback) {
            return pages[explicitFallback]();
        }

        const fuzzyHomeFallback = Object.keys(pages).find((key) =>
            /^\.\/Pages\/Home\/Index/i.test(key)
        );
        if (fuzzyHomeFallback) {
            return pages[fuzzyHomeFallback]();
        }
    }

    const available = Object.keys(pages)
        .slice(0, 25)
        .join(', ');
    return Promise.reject(
        new Error(`Page not found: ${name}. Resolver checked 4 extensions. Sample available pages: ${available}`)
    );
};

const scheduleUTMCapture = () => {
    if (typeof window === 'undefined') return;

    const runCapture = async () => {
        try {
            const analytics = await import('@/Utils/analytics');
            const captureUTMParams = analytics?.captureUTMParams;
            if (typeof captureUTMParams !== 'function') return;
            captureUTMParams();
        } catch (_) {
            // Analytics should not block app startup.
        }
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runCapture, { timeout: 2000 });
        return;
    }

    const onFirstInteraction = () => {
        runCapture();
        window.removeEventListener('pointerdown', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
        window.removeEventListener('touchstart', onFirstInteraction);
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
};

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
    resolve: resolveInertiaPage,
    setup({ el, App, props }) {
        scheduleUTMCapture();
        const root = createRoot(el);
        const { auth } = props.initialPage.props;
        const userId = auth?.user?.id;
        root.render(
            <EditorRedirectionProvider userId={userId}>
                <GlobalSoundProvider>
                    <MuteProvider>
                        <RootComponent>
                            <VisitorDurationTracker />
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
