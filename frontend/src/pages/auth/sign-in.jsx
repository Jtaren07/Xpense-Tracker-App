import React, { useState, useEffect } from 'react'
import * as z from 'zod';
import useStore from '../../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../../components/ui/card';
import { SocialAuth } from '../../components/social-auth';
import { Seperator } from '../../components/ui/seperator';
import Input from '../../components/ui/input';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'sonner';
import api from '../../libs/apiCall';


const LoginSchema = z.object({
    email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
    password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
})


const SignIn = () => { 
    const { user, setCredentials } = useStore((state) => state);

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(LoginSchema)
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const { data: res } = await api.post("/auth/sign-in", data);

            if (res?.status === "success") {
                toast.success(res?.message);
            
                const userInfo = { ...res?.user, token: res?.token };
                localStorage.setItem("user", JSON.stringify(userInfo));

                setCredentials(userInfo);

                setTimeout(() => {
                    navigate("/overview");
                }, 2000);  
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            console.error("Server response:", error?.response);
            toast.error(error?.response?.data?.message || error?.message || "An error occurred during sign-in.");
        } finally { 
            setLoading(false);
        }
    };

    useEffect(() => {
        user && navigate('/');
    }, [user]);
  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
        <Card className="w-full max-w-sm bg-white dark:bg-black/20 shadow-md overflow-hidden">
            <CardHeader className="p-6 md:p-8">
                <CardTitle className="mb-8 text-center dark:text-white">
                    Sign in to your account
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit = {handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-4 space-y-6">
                        <SocialAuth isloading={loading} setloading={setLoading} />
                        <Seperator />

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
                                "Sign In"
                            )}
                    </button>
                </form>
            </CardContent>

            <CardFooter className="justify-center gap-2">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                </p>
                <Link 
                to="/sign-up" 
                className="text-sm font-semibold text-violet-600 hover:underline">
                    Sign Up
                </Link>
            </CardFooter>
        </Card>
    </div>
  );
} ;

export default SignIn;