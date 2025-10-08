import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { LoginWindowContext } from '../../context/LoginWindowContext';

import eyeIcon from '../../assets/eye.webp';
import eyeSlashIcon from '../../assets/eye-hide.webp';

type FormData = {
  name?: string;
  nickname: string;
  email?: string;
  password: string;
};

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const LoginWindow = () => {
  const { isLoginWindow, setIsLoginWindow } = useContext(LoginWindowContext);

  const [isLogin, setIsLogin] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const userId = Math.random().toString(36).substring(2, 9);

    try {
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register';

      const res = await axios.post(
        `${serverUrl}${endpoint}`,
        { ...data, userId },
        { withCredentials: true },
      );

      if (res.data.user.id) {
        setIsLoginWindow(false);
      }
      reset();
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setServerError(error.response.data.message);
    }
  };

  return (
    isLoginWindow && (
      <div className="absolute flex items-center justify-center bg-purple-900 bg-opacity-50 inset-0 z-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-[320px] sm:min-w-[500px] flex flex-col gap-4 p-8 m-auto rounded-lg bg-white shadow-lg"
        >
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-4 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-white text-gray-700 hover:border-green-300 transition duration-300 ease-in-out"
                {...register('name', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Name must contain only letters',
                  },
                  setValueAs: (value) => value.trim(),
                })}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}

              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-white text-gray-700 hover:border-green-300 transition duration-300 ease-in-out"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                  setValueAs: (value) => value.trim(),
                })}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </>
          )}
          <input
            type="text"
            placeholder="Nickname (@example)"
            className="w-full p-4 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-white text-gray-700 hover:border-green-300 transition duration-300 ease-in-out"
            {...register('nickname', {
              required: 'Nickname is required',
              pattern: {
                value: /^@[A-Za-z0-9_]{3,20}$/,
                message:
                  'Nickname must start with @ and contain 3–20 letters, numbers, or underscores',
              },
            })}
          />
          {errors.nickname && <p className="text-red-500">{errors.nickname.message}</p>}
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-4 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-white text-gray-700 hover:border-green-300 transition duration-300 ease-in-out"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <img
                src={isPasswordVisible ? eyeIcon : eyeSlashIcon}
                alt="eye icon"
                className="w-[24px] h-[24px]"
              />
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          {serverError && <p className="text-red-500">{serverError}</p>}
          <button
            type="submit"
            className="w-full p-4 border-2 border-gray-300 focus:border-[#9232d7] bg-green-400 text-gray-700 text-xl font-bold hover:bg-purple-500 hover:text-white transition duration-300 ease-in-out"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          {isLogin ? (
            <p className="text-center text-lg">
              Don't have an account?
              <span
                className="text-[#9232d7] cursor-pointer ml-2 font-semibold"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          ) : (
            <p className="text-center text-lg">
              Already have an account?
              <span
                className="text-[#9232d7] cursor-pointer ml-2 font-semibold"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          )}
        </form>
      </div>
    )
  );
};
