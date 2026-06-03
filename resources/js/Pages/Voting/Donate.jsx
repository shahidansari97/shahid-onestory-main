import './../../../css/support.css';
import './../../../css/donate.css';
import React, { useState, useEffect } from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import VideoPlayer from "@/Components/Video/VideoPlayer.jsx";

export default function Index({ data }) {
    const [donationAmount, setDonationAmount] = useState(41661);
    const [donorsCount, setDonorsCount] = useState(196);
    const [timer, setTimer] = useState({ minutes: 41, seconds: 59 });
    const [usernames, setUsernames] = useState([
        "@username1", "@username2", "@username3", "@username4"
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                const { minutes, seconds } = prevTimer;
                if (seconds > 0) {
                    return { minutes, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { minutes: minutes - 1, seconds: 59 };
                } else {
                    clearInterval(interval);
                    return { minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (value) => {
        return value.toString().padStart(2, '0');
    };

    return (
        <GuestLayout>
            <div className="os-donate">
                <div className={"os-container os-container--xl"}>
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">Your Donation for Ukrainian</div>
                        <div className="os-text">
                            The war in Ukraine has caused many challenges, and one of the biggest ones is access to critical medical supplies among Ukraine's defenders.
                        </div>
                        <div className="os-text">
                            The mission of Ukraine Aid Operations is to provide the defenders of Ukraine with protective, life-saving gear. Critical medical supplies for emergency care for those that have been injured is an integral part of that mission.
                        </div>
                    </div>
                </div>
                <div className={"os-container os-container--sm"}>
                    <div className="os-donate__content">
                        <VideoPlayer
                            src={'/video/video.mp4#t=30'}
                            type={'movie'}
                            showStoryteller={false}
                            height={500}
                        />

                        <div className="os-progress">
                            <div className="os-progress__top">
                                <div className="os-progress__top-left">
                                    <div className="os-text os-text--sm">Donate</div>
                                    <div className="os-title os-title--h4 os-title--bold">${donationAmount.toLocaleString()}</div>
                                    <div className="os-progress__bar">
                                        <div className="os-progress__bar-inner" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                                <div className="os-progress__timer">
                                    <div className="os-text os-text--sm">Hurry up to donate!</div>
                                    <div className="os-progress__timer-box">
                                        <div className="os-progress__timer-box-item">
                                            {formatTime(timer.minutes)}
                                        </div>
                                        :
                                        <div className="os-progress__timer-box-item">
                                            {formatTime(timer.seconds)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="os-progress__usernames">
                                <span className="os-text os-text--bold">Made donations: {donorsCount} people</span>
                                <div className="os-text os-text--c-grey">
                                    {usernames.map((username, index) => (
                                        <span key={index}>{username} </span>
                                    ))}
                                    <span>...</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            tag='a'
                            className="os-btn--fw-bold  os-btn--gap-16"
                            href={route('support.pay')}
                            icon={true}
                        >
                            Donate
                            <Img
                                src={'/img/icons/btn-arrow.svg'}
                                width={14}
                                height={14}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};
