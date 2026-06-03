import '../../../css/home.css';
import '../../../css/form.css';
import '../../../css/gift.css';
import Button from "@/Components/UI/Button.jsx";
import GuestLayout from '@/Layouts/GuestLayout';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import Story from "@/Components/Story/Story.jsx";
import Modal from "@/Components/Modal.jsx";
import {useEffect, useState} from "react";
import {Head, usePage, router} from "@inertiajs/react";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import Preloader from '@/Components/Preloader';
import howToCreateAStoryvideo from '../../../img/how_to_create_a_story_edit_5.mp4';
import howToCreateAStoryvideoScreenShot from '../../../img/how_to_create_a_story_edit_5_screenshot.png';
import useIsDesktop from "@/Hooks/useIsDesktop";
import '../../../css/custum_homepage.css';
import CustomVideoPlayer from '@/Components/UI/CustomVideoPlayer.jsx';
import useUserMedia from "@/Hooks/useUserMedia";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { trackCreateStoryClick } from '@/Utils/analytics';
export default function HowToCreateStory({data}) {
    const {hero, story} = data;
    const { auth} = usePage().props;
    const user = auth.user;
    const [isMuted, setIsMuted] = useState(true);
    const [showPreloader, setShowPreloader] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const { media } = useUserMedia(auth?.user?.id);
    const editorRedirection = useEditorRedirectionContext();
    const { url } = editorRedirection;
    const [isOpeningEditor, setIsOpeningEditor] = useState(false);

    const handleToOpenVideoEditor = async (e) => {
        e?.preventDefault();
        if (isOpeningEditor) return;
        setIsOpeningEditor(true);
        const userId = auth?.user?.id || null;
        trackCreateStoryClick(userId);

        if (!userId) {
            router.visit(route('login'), { replace: true });
            return;
        }

        if (media && media.length > 0) {
            window.location.href = '/draft';
            return;
        }

        try {
            const ensuredUrl = url || (await editorRedirection.regenerate());
            if (ensuredUrl) {
                window.location.href = `${ensuredUrl}&is_draft=false`;
                return;
            }
        } finally {
            setIsOpeningEditor(false);
        }
    };
    return (
        <>
            <Head title="How to create a story"/>
            {
                showPreloader ? (
                    <Preloader onStart={handleStart}/>
                ) : (
                    <GuestLayout displayMenu={true} addContainer={false}>
                        <div className="os-container">
                            <div className="os-story__content">
                                <div className="top-title">
                                    <div className="os-hero container w-full mx-auto">
                                        <div className="top-title home_titlepage" style={{ textAlign: 'center' }}>
                                            <p> How to create a Story</p>
                                        </div>
                                        <div className="os-hero__video">
                                            <CustomVideoPlayer src={howToCreateAStoryvideo} poster={howToCreateAStoryvideoScreenShot} />
                                            {/* <video className=" w-full rounded-[24px] mx-auto" controls>
                                                <source src={howToCreateAStoryvideo} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video> */}
                                        </div>
                                    <div className='homepage2btn'>
                                            <Button
                                                onClick={handleToOpenVideoEditor}
                                                tag={'a'}
                                                fontWeight={'bold'}
                                                padding={'l'}
                                                fontSize={'m'}
                                                disabled={isOpeningEditor}
                                                className={''} style={{ fontSize: '20px',padding:'22px 32px' }}>
                                                {isOpeningEditor ? 'Creating…' : 'Create A Story'}
                                            </Button>
                                            <Button
                                                tag={'a'}
                                                href={route('about-page.index')}
                                                fontWeight={'bold'}
                                                padding={'l'}
                                                fontSize={'m'}
                                                className={''} style={{ fontSize: '20px',padding:'22px 32px' }}>About Us
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GuestLayout>
                )
            }
        </>
    );
};
