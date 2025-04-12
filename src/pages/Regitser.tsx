import bg from '../assets/register/bg.png'
import { MdOutlineEmail } from "react-icons/md";
import { BiRename } from "react-icons/bi";
import { LuKey } from "react-icons/lu";
import { Link } from 'react-router-dom';


const Regitser = () => {
  return (
    <div className="grid grid-cols-12">
      <div className='col-span-12 md:col-span-7 relative'>
        <img src={bg} alt="vase background image" className='w-full md:h-screen' />
        <div className='absolute top-[6%] md:top-[7%] left-[15%] w-3/4'>
          <p className='text-[#3A424A] text-[18px] md:text-[32px] font-normal'>The only way to <span className='text-[#00E2AC] font-semibold'>do great work</span> is to <span className=' font-semibold text-[#00E2AC]'>love what you do.</span></p>
        </div>
        <div className='absolute top-[20%] right-[12%] md:right-[15%]'>
          <p className='text-[#3A424A] text-[14px] md:text-[22px] font-medium'>- Steve Jobs</p>
        </div>
      </div>
      <div className='col-span-12 md:col-span-5'>
        <div className='flex flex-col w-[80%] md:w-[60%] mx-auto mt-[40px] md:mt-[200px]'>
          <div className='mb-[30px]'>
            <h3 className='text-[30px] font-semibold'>Sign Up</h3>
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <BiRename className='text-[#ADB0CD] text-[20px]' />
                </div>
                <input type="text" id="input-group-1" className="bg-[#FFFFFF] border border-[#E0E2E9] rounded-[8px] text-[#ADB0CD] text-[14px] rounded-lgblock w-full ps-10 p-3" placeholder="Name" />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <MdOutlineEmail className='text-[#ADB0CD] text-[20px]' />
                </div>
                <input type="text" id="input-group-1" className="bg-[#FFFFFF] border border-[#E0E2E9] rounded-[8px] text-[#ADB0CD] text-[14px] rounded-lgblock w-full ps-10 p-3" placeholder="Email" />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <LuKey className='text-[#ADB0CD] text-[20px]' />
                </div>
                <input type="text" id="input-group-1" className="bg-[#FFFFFF] border border-[#E0E2E9] rounded-[8px] text-[#ADB0CD] text-[14px] rounded-lgblock w-full ps-10 p-3" placeholder="Password" />
              </div>
            </div>
          </div>
          <div className='mt-[24px]'>
            <button className="bg-[#00E2AC] text-white w-full rounded-[8px] text-[15px] font-semibold py-3 hover:bg-[#00D0B9] transition-all ease-in-out duration-300">Sign Up</button>
          </div>
          <div className='mt-[24px] mb-[40px] md:mb-[0px]'>
            <p className='text-[#969AB8] text-[15px] font-normal'>Already have an account? <Link to="/login" className='text-[#00E2AC] font-semibold'>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regitser;
