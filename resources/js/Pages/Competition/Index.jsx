

import '../../../css/competition.css';
import showDown_1 from './../../../img/showDown_1.png';
import showDown_2 from './../../../img/showDown_2.png';
import showDown_3 from './../../../img/showDown_3.jpeg';
import howIt_work1 from './../../../img/howIt_work1.jpeg';
import howIt_work2 from './../../../img/howIt_work2.png';
import howIt_work3 from './../../../img/howIt_work3.png';
import { Head, Link, usePage,router } from "@inertiajs/react";
import useUserMedia from "@/Hooks/useUserMedia";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
export default function Competition() {
  const { auth } = usePage().props;
  const { media } = useUserMedia(auth?.user?.id);
  const editorRedirection = useEditorRedirectionContext();
  const { url } = editorRedirection;
  const handleToOpenVideoEditor = async() => {
    if(auth.user){
      if(media && media.length > 0){
          window.location.href = 'https://onestoryplanet.com/draft';
      }else{
          window.location.href = `${url}&is_draft=false`;
      }
    }else{
       router.visit(route("register",{is_contestant:true}));
    }
}
  return (
      <div className='md:container md:mx-auto md:px-16  px-[10px] mt-5 mb-24'>
        <Head title="Creator Showdown"/>
        <div className="w-full flex flex-col items-center">

          {/* Top Section */}
          <div className="w-full bg-[linear-gradient(to_right,rgba(232,213,232,1)_0%,rgba(232,213,232,0.6)_50%,rgba(255,255,255,0.4)_100%)] rounded-3xl py-16  text-center shadow-md px-4">

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              OneStoryPlanet <br /> Creator Showdown
            </h1>

            <p className="md:text-4xl text-xl text-gray-900 mt-4 font-extrabold ">
              Make something unforgettable. Win $1,000. Twice.
            </p>

            <p className="text-lg text-gray-900 mt-5">
              Two creative champions. Two massive wins.
            </p>

            {/* Prize Boxes */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">

              <div className="bg-white px-10 py-6 rounded-2xl shadow-lg text-center w-[300px]">
                <h2 className="text-4xl font-extrabold">$1,000</h2>
                <p className="text-gray-900 text-extrabold mt-1 text-lg">for Best Edit</p>
              </div>

              <div className="bg-white px-10 py-6 rounded-2xl shadow-lg text-center w-[300px]">
                <h2 className="text-4xl font-extrabold">$1,000</h2>
                <p className="text-gray-900 text-extrabold mt-1 text-lg">for Best Original Content</p>
              </div>

            </div>

            {/* Images Row */}
            <div className="flex justify-center gap-6 mt-10 flex-wrap">
              <img src={showDown_1} className="rounded-xl w-64 h-48 object-cover shadow-md" alt="creator" />
              <img src={showDown_2} className="rounded-xl w-64 h-48 object-cover shadow-md" alt="editing" />
              <img src={showDown_3} className="rounded-xl w-64 h-48 object-cover shadow-md" alt="content" />
            </div>

            {/* Button */}
            {/* <Link href={!auth.user ? route("register",{is_contestant:true}) : route("competition-new-page.index")}> */}
              <button onClick={handleToOpenVideoEditor} className="mt-10 bg-[#FFD700] hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-4 rounded-full shadow-md">
                Submit Your Entry
              </button>
            {/* </Link> */}
          </div>

          {/* How It Works Section */}
          <div className="w-[100%] max-w-6xl mt-20">
            <h2 className="text-center text-4xl font-extrabold mb-10">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* Step 1 */}
              <div className="text-start bg-white  shadow rounded-b-xl">
                <img src={howIt_work1} className=" w-full h-56 object-cover" alt="" />
                <div className="mt-4  p-5">
                  <span className="bg-[#FFD700] text-black flex justify-center items-center  h-[50px] w-[50px] rounded-full font-bold text-xl">1</span>
                  <p className="mt-3 text-gray-900 text-lg ">
                    Edit your strongest piece: best edit or best content on our editing platform.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-start bg-white  shadow rounded-b-xl">
                <img src={howIt_work2} className=" w-full h-56 object-cover" alt="" />
                <div className="mt-4  p-5">
                  <span className="bg-[#FFD700] text-black flex justify-center items-center  h-[50px] w-[50px] rounded-full font-bold text-xl">2</span>
                  <p className="mt-3 text-gray-900 text-lg ">
                    Users review based on skill, originality, emotional impact.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-start bg-white  shadow rounded-b-xl">
                <img src={howIt_work3} className=" w-full h-56 object-cover" alt="" />
                <div className="mt-4 p-5 ">
                  <span className="bg-[#FFD700] text-black flex justify-center items-center  h-[50px] w-[50px] rounded-full font-bold text-xl">3</span>
                  <p className="mt-3 text-gray-900 text-lg ">
                    Two winners each take home $1,000 + spotlight.
                  </p>
                </div>
              </div>

            </div>
          </div>





    <div className="w-full flex flex-col items-center mt-20 px-4">

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Prizes
          </h2>

          {/* Prize Boxes */}
          <div className="w-full max-w-3xl space-y-6">

            {/* Item 1 */}
            <div className="flex justify-between items-center px-6 py-5 rounded-2xl
                bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)]
                shadow-sm">
              <span className="text-lg font-bold text-gray-900">- Best Edit -</span>
              <span className="text-lg font-bold text-gray-900">$1,000</span>
            </div>

            {/* Item 2 */}
            <div className="flex justify-between items-center px-6 py-5 rounded-2xl
                bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)]
                shadow-sm">
              <span className="text-lg font-bold text-gray-900">- Best Original Content -</span>
              <span className="text-lg font-bold text-gray-900">$1,000</span>
            </div>

            {/* Item 3 */}
            <div className="flex justify-between items-center px-6 py-5 rounded-2xl
                bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)]
                shadow-sm">
              <span className="text-lg font-bold text-gray-900">- Community Favorite -</span>
              <span className="text-lg font-bold text-gray-900">
                Featured on OneStoryPlanet
              </span>
            </div>

          </div>

          {/* Judging Criteria */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mt-24 mb-8">
            Judging Criteria
          </h2>

          <div className="w-full max-w-4xl px-6 py-10 rounded-2xl
                bg-[#E8D5E8]
                shadow-sm text-center">
            <p className="text-lg text-gray-800 leading-relaxed">
              Originality, craft/skill, emotional punch, overall quality.
            </p>
          </div>

        </div>


        <div className="w-full flex flex-col items-center mt-20 px-4 ">
            <h2 className="text-3xl md:text-4xl font-bold text-center md:mt-24 mt-5 mb-8 ">
            Who Can Join
          </h2>
        <div className=" bg-[#f9f4f9] w-full max-w-4xl  rounded-2xl ">



          <div className="w-full max-w-4xl px-10 py-10 rounded-2xl
              text-left">


              <p className="mb-5"> <b>18+ wordwide</b></p>

              <p><b>Submit</b></p>
            <p className="text-lg text-gray-800 leading-relaxed">
            Upload your piece on the contest page; confirm it's original.
            </p>
          </div>
        </div>
        </div>




        <div className="w-full flex flex-col items-center mt-20 px-4">

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Official Rules
      </h2>

      {/* Official Rules Boxes */}
      <div className="w-full max-w-3xl space-y-6">

        {/* Sponsor */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Sponsor:</span>
          <span className="block text-sm text-gray-600 mt-1">Blankroth Consultation / OneStoryPlanet</span>
        </div>

        {/* Entry Period */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Free to enter. Entry Period:</span>
          <span className="block text-sm text-gray-600 mt-1">12/15–12/22</span>
        </div>

        {/* Eligibility */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Eligibility:</span>
          <span className="block text-sm text-gray-600 mt-1">18+ Void where prohibited</span>
        </div>

        {/* How to Enter */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">How to Enter:</span>
          <span className="block text-sm text-gray-600 mt-1">Submit one original story/edit.</span>
        </div>

        {/* Judging */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Judging:</span>
          <span className="block text-sm text-gray-600 mt-1">Skill-based only. Users’ decisions final.</span>
        </div>

        {/* Prizes */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Prizes:</span>
          <span className="block text-sm text-gray-600 mt-1">
            - Best Edit: $1,000 ARV<br/>
            - Best Original Content: $1,000 ARV<br/>
            - Community Favorite: Feature (no cash value)
          </span>
        </div>

        {/* Rights */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Rights:</span>
          <span className="block text-sm text-gray-600 mt-1">
            You retain ownership. You grant a non-exclusive, royalty-free license for OSP to feature/promote your work.
          </span>
        </div>

        {/* Privacy */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Privacy:</span>
          <span className="block text-sm text-gray-600 mt-1">
            Used only for contest + winner contact. Marketing requires opt-in GDPR  privacy compliant.
          </span>
        </div>

        {/* Winner Notification */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Winner Notification:</span>
          <span className="block text-sm text-gray-600 mt-1">Email within 7 days. 72h to respond.</span>
        </div>

        {/* Taxes */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Taxes:</span>
          <span className="block text-sm text-gray-600 mt-1">Winner responsible.</span>
        </div>

        {/* Disclaimers */}
        <div className="px-6 py-5 rounded-2xl bg-[linear-gradient(to_right,rgba(252,231,243,1)_0%,rgba(243,232,255,1)_100%)] shadow-sm">
          <span className="text-lg font-bold text-gray-900">Disclaimers:</span>
          <span className="block text-sm text-gray-600 mt-1">
            Not liable for tech issues. Governing Law: Israel.
          </span>
        </div>

      </div>
    </div>


    <div className="w-full flex flex-col items-center mt-20 px-4">
      <div className="w-full max-w-4xl px-6 py-10 rounded-2xl
                bg-[linear-gradient(to_right,rgba(232,213,232,1)_0%,rgba(232,213,232,0.6)_100%)]
                shadow-sm text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          Ready to Showcase Your Talent?
        </h2>
        <p className="text-lg text-center text-gray-700 mb-8">
          Submit your best edit or original content now. $1,000 is waiting for you.
        </p>
        {/* <Link href={!auth.user ? route("register",{is_contestant:true}) : route("competition-new-page.index")}> */}
          <button onClick={handleToOpenVideoEditor} className="bg-[#FFD700] hover:bg-yellow-300 text-lg font-bold px-10 py-4 rounded-full shadow-md transition duration-150">
            Submit Your Entry
          </button>
        {/* </Link> */}
      </div>
    </div>



        </div>
      </div>
  );
};

