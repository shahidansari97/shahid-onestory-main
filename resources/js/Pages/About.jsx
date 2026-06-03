import React, { useEffect, useRef } from 'react';
import './../../css/about.css';
import './../../css/video-player.css';
import GuestLayout from '@/Layouts/GuestLayout';
import { useInView } from 'react-intersection-observer';
import Button from "@/Components/UI/Button.jsx";
import {Head} from "@inertiajs/react";

export default function About({ data }) {
    const [ref1, inView1] = useInView({ threshold: 0.5 });
    const [ref2InViewRef, inView2] = useInView({ threshold: 0.5 });
    const [ref3InViewRef, inView3] = useInView({ threshold: 0.5 });
    const [ref4InViewRef, inView4] = useInView({ threshold: 0.5 });
    const [ref5, inView5] = useInView({ threshold: 0.5 });

    const scrollToRef = useRef(null);

    const videoRefs = [useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        videoRefs.forEach((videoRef, index) => {
            if (videoRef.current) {
                if ([inView2, inView3, inView4][index]) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            }
        });
    }, [inView2, inView3, inView4]);

    const handleScrollClick = () => {
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <GuestLayout displayMenu={true} addContainer={false}>
            <Head title="About" />
            <div className="os-container os-container--lg">
                <div className="os-about">
                    <div className={`os-about__screen ${inView1 ? 'animate__animated animate__fadeIn animate__slow ' : ''}`} ref={ref1}>
                        <div className="os-title os-title--h4 os-title--bold os-title--center">
                            {data.title}
                            <div className={'os-about__scroll'} onClick={handleScrollClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9" fill="none">
                                    <path d="M14.6924 0.199443L16 1.50831L8.8734 8.63738C8.75921 8.75229 8.62342 8.84349 8.47384 8.90573C8.32426 8.96796 8.16386 9 8.00185 9C7.83984 9 7.67944 8.96796 7.52986 8.90573C7.38029 8.84349 7.24449 8.75229 7.1303 8.63738L-3.27472e-07 1.50831L1.30763 0.200678L8 6.89181L14.6924 0.199443Z" fill="black"/>
                                </svg>
                                <div className={'os-about__scroll-text'}>
                                    <div className={'os-text os-text--sm os-text--bold'}>Scroll Down</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {Object.keys(data.paragraphs).filter(key => key !== 'final_paragraph').map((key, index) => {
                        let inViewRef;
                        if (index === 0) {
                            inViewRef = ref2InViewRef;
                        } else if (index === 1) {
                            inViewRef = ref3InViewRef;
                        } else {
                            inViewRef = ref4InViewRef;
                        }

                        const inView = [inView2, inView3, inView4][index];

                        return (
                            <div
                                className="os-about__screen"
                                ref={index === 0 ? (el) => {
                                    inViewRef(el);
                                    scrollToRef.current = el; // Attach the scrolling ref here
                                } : inViewRef}
                                id={index === 2 ? 'create-story-section' : undefined}
                                key={index}
                            >
                                <div className="os-screen-inner">
                                    <div className={`os-about__screen-left-side ${inView ? 'animate__animated animate__slideInUp animate__slow ' : ''}`}>
                                        <h2 className="os-title os-title--h3 os-title--bold os-text--c-pink">{data.paragraphs[key].title}</h2>
                                        <div className="os-about__text">{data.paragraphs[key].text}</div>
                                    </div>
                                    <div className={`os-about__screen-right-side ${inView ? 'animate__animated animate__slideInDown animate__slow ' : ''}`}>
                                        <video
                                            ref={videoRefs[index]}
                                            className={'os-video__iframe os-video__iframe--400'}
                                            preload="metadata"
                                            muted
                                            playsInline
                                            autoPlay
                                            controls
                                        >
                                            <source src={data.paragraphs[key].video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className='os-about__screen' >
                        <div className={`os-about__screen-right-side ${inView5 ? 'animate__animated animate__fadeIn  animate__slow ' : ''}`} ref={ref5}>
                            <h2 className="os-title os-title--h2 os-title--bold os-title--center">
                                {data.paragraphs.final_paragraph}
                            </h2>
                            <Button
                                tag={'a'}
                                href={route('user.stories.create')}
                                className={`${inView5 ? 'animate__animated animate__fadeIn  animate__slow ' : ''}`}
                            >
                                Share your story
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
