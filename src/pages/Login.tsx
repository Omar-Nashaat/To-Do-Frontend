import bg from '../assets/login/loginBg.png'
import { MdOutlineEmail } from "react-icons/md";
import { LuKey, LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as CryptoJS from 'crypto-js';
import axiosInstance from '../services/api/axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { IJwtCustomPayload } from '../interfaces/Auth';
import { ClipLoader } from 'react-spinners';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userToken = localStorage.getItem('token');
    const decodedToken = userToken ? jwtDecode<IJwtCustomPayload>(userToken) : null;
    const loggedIn = decodedToken?.user?.rememberMe;

    useEffect(() => {
        if (loggedIn) {
            toast.success('You are remebered', {
                duration: 2000,
                position: 'top-center',
            });
            navigate('/home');
        }
    }, [loggedIn, navigate]);

    // add validation for the form
    const validateForm = () => {
        let isValid: boolean = true;
        const newErrors: { email: string; password: string } = {
            email: '',
            password: ''
        };
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }
        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // encrypt password to secure it in the payload during sending it in the network
    const encryptPassword = (plainPassword: string) => {
        try {
            return CryptoJS.AES.encrypt(plainPassword, ENCRYPTION_KEY).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return '';
        }
    };

    // handle login process
    const handleLogin = () => {
        if (validateForm()) {
            setLoading(true);
            const encryptedPassword = encryptPassword(password);
            if (!encryptedPassword) {
                setErrors(prev => ({
                    ...prev,
                    password: 'Error encrypting password. Please try again.'
                }));
                setLoading(false);
                return;
            }
            const body = {
                email,
                password: encryptedPassword,
                rememberMe
            };
            axiosInstance.post(`/api/auth/login`, body)
                .then((res) => {
                    console.log(res.data);
                    localStorage.setItem('token', res.data.token);
                    toast.success('Logged in successfully', {
                        duration: 3000,
                        position: 'top-center',
                    });
                    setTimeout(() => {
                        navigate('/home')
                    }, 2000);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response?.data?.msg || 'Failed to login', {
                        duration: 3000,
                        position: 'top-center',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12 md:col-span-5'>
                <div className='flex flex-col w-[80%] md:w-[60%] mx-auto mt-[40px] md:mt-[200px]'>
                    <div className='mb-[30px]'>
                        <h3 className='text-[30px] font-semibold'>Log In</h3>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <MdOutlineEmail className='text-[#ADB0CD] text-[20px]' />
                                </div>
                                <input
                                    type="email"
                                    className={`bg-[#FFFFFF] border ${errors.email ? 'border-red-500' : 'border-[#E0E2E9]'} rounded-[8px] text-[#3A424A] text-[14px] rounded-lgblock w-full ps-10 p-3`}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    
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
                                    type={showPassword ? "text" : "password"}
                                    className={`bg-[#FFFFFF] border ${errors.password ? 'border-red-500' : 'border-[#E0E2E9]'} rounded-[8px] text-[#3A424A] text-[14px] rounded-lgblock w-full ps-10 p-3`}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    
                                />
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 cursor-pointer">
                                    {showPassword ? 
                                        <LuEyeOff className='text-[#ADB0CD] text-[20px]' onClick={() => setShowPassword(false)} /> 
                                        : 
                                        <LuEye className='text-[#ADB0CD] text-[20px]' onClick={() => setShowPassword(true)} />
                                    }
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                    </div>
                    <div className='flex items-center mt-5 gap-2'>
                        <input
                            type="checkbox"
                            id="remember-me"
                            className="w-4 h-4"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-me" className="text-[14px] font-normal text-[#969AB8]">Remember me</label>
                    </div>
                    <div className='mt-[24px]'>
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="bg-[#00E2AC] text-white w-full rounded-[8px] text-[15px] font-semibold py-3 hover:bg-[#00D0B9] transition-all ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <ClipLoader color="#FFFFFF" size={16} className="mr-2" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </div>
                    <div className='mt-[24px] mb-[40px] md:mb-[0px]'>
                        <p className='text-[#969AB8] text-[15px] font-normal'>Don't have an account? <Link to="/register" className='text-[#00E2AC] font-semibold'>Sign Up</Link></p>
                    </div>
                </div>
            </div>
            <div className='col-span-12 md:col-span-7 relative'>
                <img src={bg} alt="vase background image" className='w-full md:h-screen' />
                <div className='absolute top-[10%] left-[15%] w-3/4'>
                    <p className='text-[#3A424A] text-[19px] md:text-[32px] font-normal'>
                        The future belongs to those who <span className='text-[#00E2AC] font-semibold'>believe</span> in the <span className='text-[#00E2AC] font-semibold'>beauty of their dreams.</span>
                    </p>
                </div>
                <div className='absolute top-[30%] md:top-[25%] right-[15%]'>
                    <p className='text-[#3A424A] text-[15px] md:text-[22px] font-medium'>- Eleanor Roosevelt</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
