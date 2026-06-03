import React from 'react'
import '../../css/custum_homepage.css'
// import homecard1 from '../../img/home-cardimg.png'
import homecard1 from '../../img/home-cardimg.webp'
// import homecard2 from '../../img/real_stories_gratitude.gif'
import homecard2 from '../../img/real_stories_gratitude.webp'
import homecard3 from '../../img/home-cardimg3.png'
// import homecard4 from '../../img/home-cardimg4.png'
import homecard4 from '../../img/home-cardimg4.webp'
import homecard5 from '../../img/home-cardimg5.png'
import CustomVideoPlayer from '@/Components/UI/CustomVideoPlayer.jsx';
import Button from "@/Components/UI/Button.jsx";
// import GuestLayout from '@/Layouts/GuestLayout';
import homepagevideo from '../../img/custum_homepage_video.mp4';
import section_2_video from '../../img/section_2_video.mp4';
import section_2_video_for_mobile from '../../img/section_2_video_mobile.mp4';
import section_2_video_screen_shot from '../../img/section_2_video_screen_shot.png';
import section_2_video_screen_shot_mobile from '../../img/section_2_video_screen_shot_mobile.png';
import section_4_video from '../../img/section_2_video.mp4';
import big_story_mobile from '../../img/big_story_mobile.png';
import OptimizedVideoPlayer from './UI/OptimizedVideoPlayer.jsx';
import CustomFakeSectionVideoDesktop from './Video/CustomFakeSectionVideoDesktop';
const Custum_homepage = ({ linkToVideoEditor, children }) => {
    const section_3_video = 'https://dms5pg8p1t5xt.cloudfront.net/renders/static_videos/fake_video.mp4';
    const handleVideoEditor = () => {
        linkToVideoEditor();
    };

    return (
        <>
            {children}

            {/* first-section */}
            <div className=" flex items-center  container  w-full  relative" >
                <div className="  p-3 md:p-10 w-full md:w-[80%]  flex flex-col md:flex-row overflow-hidden font-inter" style={{
                    // 'background': 'linear-gradient(58.58deg, rgba(192, 153, 227, 0.5) 34.39%, rgba(245, 202, 203, 0.5) 96.91%)', 'border-radius': '24px'
                    'background': '#e8d3ed', 'border-radius': '24px'
                }}>
                    {/* Image Section */}
                    <div className=" w-full md:w-[30%]  mr-5">
                        <div className="relative md:min-h-[300px] min:h-[300px]">
                            <img
                                src={homecard1} // Replace with the actual image URL
                                alt="DeepFake Alert"
                                className="rounded-2xl w-full h-[500px] object-cover md:min-h-[500px] min:h-[500px] "
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full md:w-[65%] flex flex-col pt-2">
                        <div className='px-5'>
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                                In a World of DeepFake Dare to be
                                <br />
                                Real
                            </h2>


                            <p className="text-lg md:text-xl font-bold text-black mb-0">
                                Your story is your power. And the world needs it.
                            </p>

                            <p className="text-base md:text-lg text-[#000000] font-medium pb-3">
                                In a world of filters and staged moments, being real is a radical act.
                            </p>
                            <p className="text-base md:text-lg text-[#000000] font-medium pb-3">
                                When you tell your true story — not the perfect one — you claim your voice, your strength, your impact. You build a community that values truth over performance, connection over clout.
                            </p>
                            <p className="text-base md:text-lg text-[#000000] font-medium pb-3">
                                This isn't just posting. It's choosing to be human in a world that forgets how. Your honesty invites others to show up real too. And when we connect through truth, change begins.
                            </p>
                            <p className="text-base md:text-lg text-[#000000] font-medium pb-3">
                                So tell your story — the real one. It matters more than you think.
                            </p>
                            {/* <p className="text-base md:text-lg text-[#000000] mb-4 font-medium">
                                In a time where everything can be generated, staged, or filtered, being real is a radical act. When you tell your story not the perfect one, but the true one you’re doing more than expressing yourself. You’re creating a space where authenticity can breathe. You’re reminding yourself of your own strength, your voice, your impact. And you’re helping build a community that values truth over performance, connection over clout.
                            </p>
                            <p className="text-base md:text-lg text-[#000000]  font-medium">
                                This is more than just posting. This is about choosing to be human in a world that often forgets what that means. Your story makes space for others to show up honestly too. And when we connect through truth, that’s where the real magic starts. That’s where change begins. So go ahead: tell your story. The real one. It matters more than you think
                            </p> */}

                        </div>

                        <div className="md:mt-6 md:pt-2 pt-3">
                            <button
                                onClick={handleVideoEditor}
                                className="bg-[#369DDB] text-white px-16 py-3  md:text-xl  font-semibold rounded-full hover:bg-[#369DDB] transition">
                                Dare To Be Real?
                            </button>
                        </div>
                    </div>

                    {/* <div className=" w-full h-full mt-4 md:hidden block">
                        <video
                            src={section_3_video}
                            className=" w-full  object-cover rounded-2xl opacity-100 home_video "
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                        />
                    </div> */}

                </div>
                <CustomFakeSectionVideoDesktop src={section_3_video} />        

                {/* <video
                    src={section_3_video}
                    className="absolute top-20 right-10 object-cover rounded-2xl opacity-100 home_video md:block hidden"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                /> */}


            </div>

            <div className="os-hero addmore-css container w-full mx-auto">
                <div className=" home_titlepage" style={{ 'text-align': 'center' }}>
                    <h1>Get Paid to be Real </h1>
                    {/* <p> Just meaningful connections and a community that lifts you up.</p> */}
                </div>
                <div className="os-hero__video md:block hidden">
                    <OptimizedVideoPlayer 
                        src={section_2_video} 
                        poster={section_2_video_screen_shot} 
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        playsInline={true}
                    />
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
                <div className="container mx-auto w-full flex  md:flex-row  items-stretch md:items-start  justify-between md:gap-8">
                    {/* Left: Text Content */}
                    <div className="w-1/2  text-start md:text-left pt-5">
                        <h2 className="text-[18px] text-start md:text-5xl font-normal text-black md:mb-6 mb-5 leading-snug ">
                            Big Stories Deserve <br/> Big Recognition
                        </h2>

                        <p className="text-phone md:text-xl text-black mb-6 md:leading-relaxed text-start">
                            Each week, we reward the most shared and impactful story with cash and platform-wide spotlight.
                            It’s not about followers it’s about saying something that resonates.
                        </p>

                        {/* <h4 className="text-lg md:text-xl text-black mb-3">How it works:</h4>
                        <ul className="text-lg md:text-xl text-black space-y-3 mb-8">
                            <li className="flex items-start text-start gap-2">
                                <span className="text-[#369DDB] text-3xl leading-[1]">•</span>
                                <span className="flex-1">Create and post using our editor</span>
                            </li>
                            <li className="flex items-start text-start gap-2">
                                <span className="text-[#369DDB] text-3xl leading-[1]">•</span>
                                <span className="flex-1">More shares = better chances</span>
                            </li>
                            <li className="flex items-start text-start gap-2">
                                <span className="text-[#369DDB] text-3xl leading-[1]">•</span>
                                <span className="flex-1">Weekly winners get cash + visibility</span>
                            </li>
                        </ul> */}


                        <button
                            onClick={handleVideoEditor}
                            className="bg-[#FFDA79] create_story  transition-all duration-300 text-sm  text-black  md:text-lg font-normal  px-5 py-2 rounded-full transition">
                            Share Your Story
                        </button>
                    </div>

                    {/* Right: Giveaway Box */}
                    <div className="w-1/2  rounded-2xl pt-6 text-center  relative overflow-hidden">


                        {/* Images row */}
                        <div className="flex justify-center gap-4 bigstory_img md:block hidden">
                            <img
                                src={homecard4}
                                alt="user1"
                                className=" rounded-lg object-cover"
                            />

                        </div>

                    </div>



                </div>
            </div>




            <div className="flex items-center justify-center  pt-12">
                <div className="container relative mx-auto w-full md:flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="md:w-[70%] w-full md:text-left rounded-2xl md:py-28 pt-4 pb-28 px-5 flex justify-start items-center text-left" style={{ 'background': 'linear-gradient(58.58deg, rgba(192, 153, 227, 0.5) 34.39%, rgba(245, 202, 203, 0.5) 96.91%)' }}>

                        <div className='md:w-[75%] w-full'>
                            <h2 className="text-3xl md:text-5xl font-mormal text-black mb-6 leading-snug md:block hidden">
                                Real Stories,<br /> Real Gratitude
                            </h2>
                            <h2 className="text-xl md:text-5xl font-extrabold text-black md:mb-6 mb-3 leading-snug block md:hidden">
                                Real Stories, Real Gratitude
                            </h2>
                            {/* <p className="text-lg md:text-xl text-black mb-6 leading-relaxed">
                                When your story connects, people can send gifts, simple digital gratitude.
                                No ads, no selling out. Just real support for real stories.
                            </p> */}
                            <p className="text-lg md:text-xl text-black md:mb-6 mb-3 leading-relaxed">
                                When your story connects, viewers can send digital coins as gifts of gratitude. No ads, no selling out. Just real support for real stories.
                            </p>
                            <div className='text-start'>

                                <h4 className="text-lg md:text-xl text-black md:mb-3 mb-1">How it works:</h4>

                            </div>

                            <ul className=" md:text-xl text-black  md:mb-8 mb-5">
                                <li className="flex  text-start gap-1 ">
                                    <span className="text-[#64b8eb] text-6xl leading-[20px] ">•</span>
                                    <p className="flex-1">Share honest, inspiring content</p>
                                </li>
                                <li className="flex text-start gap-1 ">
                                    <span className="text-[#64b8eb] text-6xl leading-[20px]">•</span>
                                    {/* <span className="flex-1">Followers send gifts</span> */}
                                    <p className="flex-1">Users send gifts</p>
                                </li>
                                <li className="flex  text-start gap-1 ">
                                    <span className="text-[#64b8eb] text-6xl leading-[20px] ">•</span>
                                    {/* <span className="flex-1">Cash out when you reach the minimum amount for withdrawals</span> */}
                                    <p className="flex-1">Cash out when you reach the minimum amount</p>
                                </li>
                            </ul>


                            <button
                                onClick={handleVideoEditor}
                                className="bg-[#FFDA79] create_story  transition-all duration-300  text-black  md:text-lg font-normal px-16 py-2 rounded-full transition">
                                Edit Your Story
                            </button>
                        </div>
                    </div>


                    {/* Right: Giveaway Box  desktop */}
                    <div className="md:w-1/3   rounded-2xl pt-6 text-center  relative md:block hidden">


                        {/* Images row */}
                        <div className="flex justify-center gap-4 md:absolute top-12 right-[200px] w-full ">
                            <img
                                src={homecard2}
                                alt="user1"
                                className=" rounded-2xl  h-[500px] object-cover"
                            />

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













            {/* first-section */}
            {/* <div className="bg-[#f3f3f3]   px-4 pt-16  "> */}
            {/* <div className="px-4 pt-16  ">
                <h1 className=" font-inter font-meduim text-black mb-3 text-center md:text-[36px] text-[22px] " >
                    Get Paid to be Real
                </h1>

                <div className="container w-full flex flex-col md:flex-row  gap-8 mx-auto">


                    <div className=" pt-4 w-full md:w-1/2">




                        <div className="text-center">
                            <img src={homecard2} alt="Flower" className=" mx-auto rounded-2xl  " />

                        </div>

                    </div>


                    <div className="w-full md:w-1/2 text-center md:text-left pt-4 font-inter">


                        <h3 className="text-xl font-bold text-black mb-2">
                            Real Stories, Real Gratitude
                        </h3>

                        <p className="text-base text-black mb-4">
                            When people connect with your story, they can send you gifts as a way to say thank you. Think of it like digital
                            gratitude. Whether it’s a heartfelt post, a raw moment, or a creative expression, the more your content resonates,
                            the more support you can receive. No ads. No selling out. Just real people supporting real stories.
                        </p>

                        <h4 className="font-bold text-black mb-2 text-xl">How it works:</h4>
                        <ul className="text-base text-black space-y-2 mb-6">
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">Share content that moves, inspires, or speaks truth.</span>
                            </li>
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">Followers can gift you through the platform.</span>
                            </li>
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">You cash out once you hit the minimum balance.</span>
                            </li>
                        </ul>


                        <button
                            onClick={handleVideoEditor}
                            className="bg-[#FFDA79] create_story  transition-all duration-300  text-black  md:text-lg font-semibold px-16 py-2 rounded-full transition">
                            Create A Story
                        </button>
                    </div>
                </div>
            </div> */}




            {/* third-section */}


            {/* <div className="bg-[#f4f4f4]  flex items-center justify-center  pt-12"> */}
            {/* <div className="flex items-center justify-center  pt-12">
                <div className="container mx-auto w-full flex flex-col md:flex-row items-start justify-between gap-8">

                    <div className="md:w-1/2 text-center md:text-left pt-5">
                        <h2 className="text-xl md:text-2xl font-bold text-black mb-4">
                            Big Stories Deserve Big Recognition
                        </h2>
                        <p className="text-base text-black mb-4">
                            Every week we run a contest to find the most shared and impactful story.
                            Winners get a cash prize and major visibility across the platform. It’s not
                            about having the most followers—it’s about having something to say that sticks
                            that inspires people to share it.
                        </p>

                        <h4 className="text-base text-black mb-2">How it works:</h4>
                        <ul className="text-base text-black space-y-2 mb-6">
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">Edit your story on our editing platform and post it.</span>
                            </li>
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">The more it’s shared, the higher your chances.</span>
                            </li>
                            <li className="flex items-start text-start gap-1">
                                <span className="text-[#369DDB] text-2xl leading-[1]">•</span>
                                <span className="flex-1">Winners are announced weekly and rewarded with cash + spotlight.</span>
                            </li>
                        </ul>


                        <button
                            onClick={handleVideoEditor}
                            className="bg-[#FFDA79] create_story  transition-all duration-300  text-black  md:text-lg font-semibold px-16 py-2 rounded-full transition">
                            Create A Story
                        </button>
                    </div>


                    <div className="md:w-1/2  rounded-2xl pt-6 text-center  relative">



                        <div className="flex justify-center gap-4 ">
                            <img
                                src={homecard3}
                                alt="user1"
                                className=" rounded-lg object-cover"
                            />

                        </div>

                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Custum_homepage
