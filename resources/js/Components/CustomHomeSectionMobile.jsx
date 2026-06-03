import React from 'react'
import '../../css/custum_homepage.css'
import homecard1 from '../../img/home-cardimg.webp'
import homecard2 from '../../img/real_stories_gratitude.webp'
import homecard4 from '../../img/home-cardimg4.webp'
// import homecard4 from '../../img/home-cardimg4.png'
import section_2_video_for_mobile from '../../img/section_2_video_mobile.mp4';
import section_2_video_screen_shot_mobile from '../../img/section_2_video_screen_shot_mobile.webp';
import big_story_mobile from '../../img/big_story_mobile.png';
import OptimizedVideoPlayer from './UI/OptimizedVideoPlayer.jsx';
import { Circle } from "lucide-react";
import CustomFakeSectionVideoMobile from './Video/CustomFakeSectionVideoMobile';

const CustomHomeSectionMobile = ({ linkToVideoEditor, children }) => {
    const section_3_video = 'https://dms5pg8p1t5xt.cloudfront.net/renders/static_videos/fake_video.mp4';
    const handleVideoEditor = () => {
        linkToVideoEditor();
    };
    return (
        <>
            {children}
            {/* first-section */}
            <div className=" md:flex items-center  container  w-full  relative" >
                <div className="  p-3 md:p-10 w-full md:w-[80%]  flex flex-col md:flex-row overflow-hidden font-inter" style={{
                    'background': '#e8d3ed', 'border-radius': '24px'
                }}>
                    {/* Image Section */}
                    <div className=" w-full md:w-[30%]  mr-5">
                        <div className="relative md:min-h-[300px] min:h-[300px]">
                            <img
                                src={homecard1}
                                alt="DeepFake Alert"
                                className="rounded-2xl w-full h-[500px] object-cover md:min-h-[500px] min:h-[500px] "
                            />

                        </div>
                    </div>
                    {/* Text Section */}
                    <div className="w-full md:w-[65%]  flex flex-col pt-2 justify-between px-3">
                        <div className=''>
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                                In a World of DeepFake
                                <br />
                                Dare to be Real
                            </h2>

                            <p className="text-lg md:text-xl font-bold text-black mb-1">
                                Your story is your power. And the world needs it.
                            </p>
                            <p className="text-base md:text-lg text-[#000000] font-medium mb-6">
                                In a world of filters and staged moments, being real is a radical act.
                            </p>

                            <p className="hidden md:block text-base md:text-lg text-[#000000] font-medium mb-6">
                                When you tell your true story — not the perfect one — you claim your voice, your strength, your impact. You build a community that values truth over performance, connection over clout.
                            </p>
                            <p className="text-base md:text-lg text-[#000000] font-medium mb-6">
                                This isn't just posting. It's choosing to be human in a world that forgets how. Your honesty invites others to show up real too. And when we connect through truth, change begins.</p>
                            <p className="text-base md:text-lg text-[#000000] font-medium">
                                So tell your story — the real one. It matters more than you think.
                            </p>
                        </div>
                        <div className="mt-2 md:pt-0 pb-[9rem] ">
                            <button
                                onClick={handleVideoEditor}
                                className="bg-[#369DDB] text-white px-16 py-3  md:text-xl  font-semibold rounded-full hover:bg-[#369DDB] transition">
                                Dare To Be Real?
                            </button>
                        </div>


                    </div>

                </div>
                <CustomFakeSectionVideoMobile src={section_3_video} />
                {/* <div className="w-[80%] mx-auto h-full mt-4 md:hidden block relative ">
                    <video
                        src={section_3_video}
                        className=" w-full mx-auto  object-cover rounded-2xl opacity-100 home_video  mt-[-140px] mb-3"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                    />
                </div> */}
            </div>
            <div className="os-hero addmore-css container w-full mx-auto gap-2 mt-2 md:mt-6">
                <div className=" home_titlepage" style={{ 'text-align': 'center' }}>
                    <h1 style={{ 'font-size': '20px' }}>Get Paid to be Real </h1>
                </div>
                <div className="os-hero__video block md:hidden">
                    <OptimizedVideoPlayer
                        src={section_2_video_for_mobile}
                        poster={section_2_video_screen_shot_mobile}
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        playsInline={true}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center  md:pt-12">
                <div
                    className={`container mx-auto w-full flex md:flex-row items-stretch md:items-start justify-between md:gap-8  bg-bigstory`}
                >
                    {/* Left: Text Content */}
                    <div className="w-1/2  text-start md:text-left pt-5">
                        <h2 className="text-[19px] text-start md:text-5xl font-extrabold text-black md:mb-6 mb-5 leading-snug ">
                            Big Stories Deserve <br /> Big Recognition
                        </h2>
                        <p className="text-phone md:text-xl text-black mb-6 md:leading-relaxed text-start">
                            Each week, we reward the most shared and impactful story with cash and platform-wide spotlight.
                            It’s not about followers it’s about saying something that resonates.
                        </p>
                        <button
                            onClick={handleVideoEditor}
                            className="bg-[#FFDA79] create_story  transition-all duration-300 text-sm  text-black  md:text-lg font-semibold md:px-16  px-5 py-2 rounded-full transition">
                            Share Your Story
                        </button>
                    </div>
                    {/* Right: Giveaway Box */}
                    <div className="w-1/2  rounded-2xl pt-6 text-center  relative overflow-hidden">
                        {/* Images row */}
                        {/* <div className="flex justify-center gap-4 bigstory_img md:block hidden">
                            <img
                                src={homecard4}
                                alt="user1"
                                className=" rounded-lg object-cover"
                            />
                        </div> */}
                        <div className="flex justify-center gap-4 bigstory_img ">
                            <img
                                src={homecard4}
                                alt="user1"
                                className=" rounded-lg object-cover bigstory_img2 hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center  pt-12">
                <div className="container relative mx-auto w-full md:flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="md:w-[70%] w-full md:text-left rounded-2xl md:py-28 pt-4 pb-28 px-5 flex justify-start items-center text-left" style={{ 'background': 'linear-gradient(58.58deg, rgba(192, 153, 227, 0.5) 34.39%, rgba(245, 202, 203, 0.5) 96.91%)' }}>
                        <div className='md:w-[75%] w-full'>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-6 leading-snug md:block hidden">
                                Real Stories,<br /> Real Gratitude
                            </h2>
                            <h2 className="text-xl md:text-5xl font-extrabold text-black md:mb-6 mb-3 leading-snug block md:hidden">
                                Real Stories, Real Gratitude
                            </h2>
                            <p className="text-phone md:text-xl text-black md:mb-6 mb-3 ">
                                When your story connects, viewers can send digital coins as gifts of gratitude. No ads, no selling out. Just real support for real stories.
                            </p>
                            <div className='text-start'>
                                <h4 className="text-phone md:text-xl text-black md:mb-3 mb-1">How it works:</h4>
                            </div>
                            <ul className="md:text-xl text-black md:mb-8 mb-5">
                                <li className="flex text-start gap-1 items-baseline">
                                    <Circle className="text-[#64b8eb] w-3 h-3 fill-current" />
                                    <p className="flex-1 text-phone">Share honest, inspiring content</p>
                                </li>

                                <li className="flex text-start gap-1 items-baseline">
                                    <Circle className="text-[#64b8eb] w-3 h-3 fill-current" />
                                    <p className="flex-1 text-phone">Users send gifts</p>
                                </li>

                                <li className="flex text-start gap-1 items-baseline">
                                    <Circle className="text-[#64b8eb] w-3 h-3 fill-current" />
                                    <p className="flex-1 text-phone">Cash out when you reach the minimum amount</p>
                                </li>
                            </ul>
                            <button
                                onClick={handleVideoEditor}
                                className="bg-[#FFDA79] create_story  transition-all duration-300  text-black  md:text-lg font-semibold px-16 py-2 rounded-full transition">
                                Edit Your Story
                            </button>
                        </div>
                    </div>
                    {/* Right: Giveaway Box  phone */}
                    <div className="  rounded-2xl h-[200px] text-center relative  w-[90%] mx-auto  block md:hidden">
                        {/* Images row */}
                        <div className=" flex justify-center gap-4   mt-[-80px]">
                            <img
                                src={homecard2}
                                alt="user1"
                                className=" rounded-2xl  h-[300px] object-cover "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomHomeSectionMobile;
