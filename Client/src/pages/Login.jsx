import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaUser, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import useAuthStore from '@/store/authStore';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const onSubmit = async (data) => {
    const sanitizedData = {
      username: sanitizeInput(data.username),
      password: sanitizeInput(data.password)
    };

    await login(sanitizedData);
    if (!error) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-3xl min-h-[600px] md:min-h-[400px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 m-2 rounded-md shadow-md">
        <div className="flex flex-col items-center justify-center p-6 bg-primary rounded-md text-white">
          <img src={logo} alt="logo" className="h-[150px] lg:h-[180px]" />
          <h1 className="text-3xl font-extrabold mb-2">Namaste</h1>
          <p className="text-lg font-semibold text-gray-100 text-center">
            Please log in to continue.
          </p>
        </div>

        <CardContent className="flex-1">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-6">Sign in to your account</CardTitle>
          </CardHeader>

          {/* Form */}
          <form className="grid gap-8 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center shadow-md rounded-md px-2 bg-background">
                <FaUser className="text-gray-400 mr-2" />
                <Input
                  id="username"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                  type="text"
                  placeholder="Enter your username"
                  className="flex-1 border-none font-semibold"
                />
              </div>
              {errors.username && <span className="text-red-500">{errors.username.message}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center shadow-md rounded-md px-2 bg-background">
                <FaLock className="text-gray-400 mr-2" />
                <Input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="flex-1 border-none font-semibold"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none text-gray-600"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <Button
              type="submit"
              className="mx-auto w-1/2 hover:bg-primary text-lg font-semibold disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
