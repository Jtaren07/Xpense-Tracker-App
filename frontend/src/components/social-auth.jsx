import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCall";
import useStore from "../store";
import { Button } from "./ui/button";
import { auth } from "../libs/firebaseConfig";

export const SocialAuth = ({ isloading, setloading }) => {
    const [user] = useAuthState(auth);
    const [selectedProvider, setSelectedProvider] = useState("google");
    const setCredentials = useStore((state) => state.setCredentials);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setSelectedProvider("google");
        try {
            const res = await signInWithPopup(auth, provider);
        } catch (error) {
            console.log("Error signing in with Google", error);
        }
    };

    useEffect(() => {
        const saveUserToDb = async () => {
            try {
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    provider: selectedProvider,
                    uid: user.uid,
                };

                setloading(true);
                const { data: res } = await api.post("/auth/sign-in", userData);
                console.log(res);
                if (res?.user) {
                    toast.success(res?.message);
                    const userInfo = {
                        ...res.user,
                        token: res?.token
                    };
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    setCredentials(userInfo);

                    setTimeout(() => {
                        navigate("/overview");
                    }, 1000);
                }
            } catch (error) {
                console.error("Error saving user to database", error);
                toast.error(error?.response?.data?.message || error.message);
            } finally {
                setloading(false);
            }
        };

        if (user) {
            saveUserToDb();
        }
    }, [user?.uid]);


    return (
        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={signInWithGoogle}
                disabled={isloading}
            >
                <FcGoogle size={24} className="mr-2" />
                Sign in with Google
            </Button>
        </div>
    );
};
