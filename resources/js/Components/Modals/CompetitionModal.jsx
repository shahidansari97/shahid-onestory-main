import CompetitionModalImg from '../../../img/CompetitionModa_img.png'
import { Link } from "@inertiajs/react";
export default function CompetitionModal({closeModal}) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white overflow-hidden flex flex-col md:flex-row gap-3 p-4">
      
      {/* Left Image */}
        <div className="md:w-1/2 w-full aspect-[4/3] overflow-hidden rounded-[2.5rem]">
            <img
                src={CompetitionModalImg}
                alt="Promo"
                className="w-full h-full object-cover"
            />
        </div>


      {/* Right Section */}
      <div className=" pt-5 md:w-1/2 w-full p-2 flex flex-col justify-center items-start text-start ">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#c398df]">
          Make Something Powerful.
        </h2>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#c398df] mt-1">
          Win Something Big.
        </h2>

        <div className="mt-3 text-black text-3xl md:text-4xl font-extrabold ">
          <p className='text-black text-3xl md:text-4xl font-extrabold '>$1000 Best Edit</p>
          <p className='text-black text-3xl md:text-4xl font-extrabold '>$1000 Best Content</p>
        </div>
        {/* Temporarily disabled */}
         {/*<Link href={route('competition-new-page.index')}>
            <button className=" text-lg md:text-xl mt-6 bg-[#c398df] hover:bg-[#c5a7ff] text-black font-extrabold px-6 py-3 rounded-full w-[230px]">
            Learn More
            </button>
        </Link>*/}
      </div>
    </div>
  );
}
