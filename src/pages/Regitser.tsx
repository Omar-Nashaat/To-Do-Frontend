import bg from '../assets/register/bg.png'
import { MdOutlineEmail } from "react-icons/md";
import { BiRename } from "react-icons/bi";
import { LuKey, LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axios';
import { useState } from 'react';
import * as CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const Regitser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  // add validation for the form
  const validateForm = () => {
    let isValid: boolean = true
    const newErrors: { name: string; email: string; password: string } = {
      name: '',
      email: '',
      password: ''
    }

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email'
      isValid = false
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // encrypt password to secure it in the payload during sending it in the network
  const encryptPassword = (plainPassword: string) => {
    try {
      return CryptoJS.AES.encrypt(plainPassword, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  // handle register process
  const register = () => {
    if (validateForm()) {
      const encryptedPassword = encryptPassword(password);
      if (!encryptedPassword) {
        setErrors(prev => ({
          ...prev,
          password: 'Error encrypting password. Please try again.'
        }));
        return;
      }
      const body = {
        name,
        email,
        password: encryptedPassword
      }
      axiosInstance.post(`/api/auth/register`, body)
        .then((res) => {
          console.log(res.data);
          toast.success('User registered successfully, redirecting to login page', {
            duration: 3000,
            position: 'top-center',
          });
          setTimeout(() => {
            navigate('/login')
          }, 2000);
        }).catch((err) => {
          console.log(err);
          toast.error(err.response?.data?.msg || 'Failed to register user', {
            duration: 3000,
            position: 'top-center',
          });
        })
    }
  }

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
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className={`bg-[#FFFFFF] border ${errors.name ? 'border-red-500' : 'border-[#E0E2E9]'} rounded-[8px] text-[#3A424A] text-[14px] rounded-lgblock w-full ps-10 p-3`}
                  placeholder="Name"
                  value={name}
                  onBlur={() => validateForm()}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <MdOutlineEmail className='text-[#ADB0CD] text-[20px]' />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className={`bg-[#FFFFFF] border ${errors.email ? 'border-red-500' : 'border-[#E0E2E9]'} rounded-[8px] text-[#3A424A] text-[14px] rounded-lgblock w-full ps-10 p-3`}
                  placeholder="Email"
                  value={email}
                  onBlur={() => validateForm()}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <LuKey className='text-[#ADB0CD] text-[20px]' />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className={`bg-[#FFFFFF] border ${errors.password ? 'border-red-500' : 'border-[#E0E2E9]'} rounded-[8px] text-[#3A424A] text-[14px] rounded-lgblock w-full ps-10 p-3`}
                  placeholder="Password"
                  value={password}
                  onBlur={() => validateForm()}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 cursor-pointer">
                  {showPassword ? 
                    <LuEyeOff onClick={() => setShowPassword(false)} className='text-[#ADB0CD] text-[20px]' /> 
                    : 
                    <LuEye onClick={() => setShowPassword(true)} className='text-[#ADB0CD] text-[20px]' />
                  }
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>
          <div className='mt-[24px]'>
            <button onClick={register} className="bg-[#00E2AC] text-white w-full rounded-[8px] text-[15px] font-semibold py-3 hover:bg-[#00D0B9] transition-all ease-in-out duration-300">Sign Up</button>
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
