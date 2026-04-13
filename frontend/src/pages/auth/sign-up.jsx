import React, { useState, useEffect } from 'react'
import * as z from 'zod';
import useStore from '../../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../../components/ui/card';
import { SocialAuth } from '../../components/social-auth';
import { Seperator } from '../../components/ui/seperator';
import { toast } from 'sonner';
import Input from '../../components/ui/input';
import api from '../../libs/apiCall';
import { BiLoader } from 'react-icons/bi';


const RegisterSchema = z.object({
    email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
    firstName: z.string({ required_error: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters long" }),
    password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
})


const SignUp = () => { 
    const { user } = useStore((state) => state);

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(RegisterSchema)
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user && navigate('/');
    }, [user]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.post("/auth/sign-up", data);

            if (res?.status === "success") {
                toast.success(res?.message || "Account created successfully!");
                setTimeout(() => {
                    navigate("/sign-in");
                }, 2000);    
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message || "An error occurred while creating the account");
        } finally { 
            setLoading(false);
        }
        
    };

    

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
        <Card className="w-full max-w-sm bg-white dark:bg-black/20 shadow-md overflow-hidden">
            <CardHeader className="p-6 md:p-8">
                <CardTitle className="mb-8 text-center dark:text-white">
                    Create an account
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit = {handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-4 space-y-6">
                        <SocialAuth isloading={loading} setloading={setLoading} />
                        <Seperator />

                        <Input
                        disabled={loading}
                        id="firstName"
                        label="Name"
                        name="firstName"
                        type="text"
                        placeholder="Alex Smith"
                        error={errors?.firstName?.message}
                        {...register('firstName')}
                        className="dark:border-gray-700 dark:bg-transparent dark:placeholder-gray-500
                        dark:text-gray-400 dark:outline-none"
                        />

                        <Input
                        disabled={loading}
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                        className="dark:border-gray-700 dark:bg-transparent dark:placeholder-gray-500
                        dark:text-gray-400 dark:outline-none"
                        />

                        <Input
                        disabled={loading}
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Your password"
                        error={errors.password?.message}
                        {...register('password')}
                        className="dark:border-gray-700 dark:bg-transparent dark:placeholder-gray-500
                        dark:text-gray-400 dark:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-800 border-none rounded-md text-white py-2 px-4 hover:bg-violet-900 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <BiLoader className="text-2xl text-white animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                    </button>
                </form>
            </CardContent>

            <CardFooter className="justify-center gap-2">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                </p>
                <Link 
                to="/sign-in" 
                className="text-sm font-semibold text-violet-600 hover:underline">
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    </div>
  );
} ;

export default SignUp;