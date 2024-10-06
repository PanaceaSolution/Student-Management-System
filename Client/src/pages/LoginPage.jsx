import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import card components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"; // Import Input component
import { Label } from "@/components/ui/label"; // Import Label component

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
    alert("Login success");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-200"> {/* Center the card vertically and horizontally */}
      <Card className="w-full max-w-2xl mx-auto flex">
        <div className="flex flex-col items-center justify-center p-6 bg-sky-300"> {/* Left section for avatar and text */}
          <Avatar className="w-24 h-24 mb-6"> {/* Increase size of avatar */}
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold mb-2">Namaste, Everyone </h1> {/* Bold and larger text */}
          <p className="text-center"> Welcome back ! Please log in to continue.</p> {/* Text space */}
        </div>

        <CardContent className="flex-1 p-4"> {/* Right section for form */}
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            
            
          </CardHeader>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}> {/* Form structure */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
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
              </div>
              <Input
                id="password"
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
                required
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <Button type="submit" className="w-full bg-sky-300">
              Login
            </Button>
            <Button variant="outline" className="w-full mt-2">
              Login with Google
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
