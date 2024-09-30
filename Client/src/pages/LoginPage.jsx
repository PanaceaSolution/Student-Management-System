import React from 'react';
import {useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import card components
import { Input } from "@/components/ui/input"; // Import Input component
import { Label } from "@/components/ui/label"; // Import Label component
// import { Link } from 'react-router-dom'; // Import Link component from react-router-dom


const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data); // Handle form submission
        alert("login success");
      };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" onSubmit={handleSubmit(onSubmit)}> {/* Centering container */}
      <Card className="max-w-sm w-full mx-4"> {/* Centered Card with full width */}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            School Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="Ad_Uniquename">Username</Label>
            <Input
                                id="username"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 4,
                                        message: 'Username must be at least 4 characters',
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: 'Username cannot exceed 15 characters',
                                    },
                                    pattern: {
                                        value: /^Ad_[a-zA-Z0-9_]+$/, // Username must start with "Ad_" followed by letters, numbers, or underscores
                                        message: 'Username must start with "Ad_" and can contain letters, numbers, and underscores',
                                    },
                                })}
                                type="text"
                                placeholder="Enter your username"
                                required
                            />
                            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
            
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link> */}
              </div>
              <Input id="password"
             {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Password cannot exceed 20 characters',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain at least one letter and one number',
                },
              })}
             
               type="password"
                required />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            {/* <Link to="#" className="underline">
              Sign up
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
