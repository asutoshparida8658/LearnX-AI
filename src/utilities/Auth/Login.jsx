"use client"
import Image from "next/image"
import Link from "next/link"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ProfielSpinner from "../Spinner/ProfielSpinner"
import { useState, useEffect } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"

export function Login() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("dilmstoken");
        if (token) {
            router.push("/");
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [router]);

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
    };

    const handleOtpSend = async (e) => {
        e.preventDefault();
        
        // Validate email
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        setLoading(true);
        try {
            const data = await axios.post("/api/auth", { 
                email: email.toLowerCase(), 
                type: "send" 
            });
            
            setLoading(false);
            
            if (data.data.success) {
                setIsOtpSent(true);
                toast.success(data.data.message);
                
                // If this is a new user, we'll prompt them to register after OTP verification
                if (data.data.isNewUser) {
                    toast.info("You'll need to complete registration after verifying your email");
                }
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            setLoading(false);
            toast.error("Something went wrong. Please try again later!");
            console.error(err);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        
        setLoading(true);
        try {
            const data = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "verify",
                otp: otp
            });
            
            setLoading(false);

            if (data.data.success) {
                // User exists and login successful
                toast.success(data.data.message);
                localStorage.setItem("dilmstoken", data.data.token);
                
                // Small delay for toast to be visible before redirect
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else if (data.data.requiresRegistration) {
                // User doesn't exist, redirect to registration
                toast.info("Please complete your registration");
                router.push(`/register?email=${encodeURIComponent(email)}&otp=${otp}`);
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            setLoading(false);
            toast.error("Authentication failed. Please try again.");
            console.error(err);
        }
    };

    return (
        <>
            <Toaster position="top-center" expand={false} />
            {loading && (
                <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-50 z-50">
                    <ProfielSpinner />
                </div>
            )}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
                <div className={`w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-900 ${loading ? "opacity-30" : ""} transition-opacity duration-300`}>
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-pink-500">Welcome Back</h1>
                        <p className="text-gray-400 mt-2">Login to continue your learning journey</p>
                    </div>
                    <div className="space-y-6">
                        {!isOtpSent && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        onChange={handleChange}
                                        value={email}
                                        required
                                        className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-all duration-200"
                                    onClick={handleOtpSend}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </div>
                        )}
                        {isOtpSent && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="otp" className="text-gray-300">Enter the 6-digit OTP sent to your email</Label>
                                    <InputOTP 
                                        maxLength={6} 
                                        onChange={(value) => { setOtp(value); }}
                                        className="mt-2"
                                    >
                                        <InputOTPGroup className="flex justify-between gap-2">
                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="w-12 h-12 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg text-center text-2xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-all duration-200"
                                    onClick={handleVerifyOtp}
                                >
                                    {loading ? "Verifying..." : "Verify & Login"}
                                </Button>
                                <div className="text-center">
                                    <button 
                                        onClick={() => {
                                            setIsOtpSent(false);
                                            setOtp("");
                                        }}
                                        className="text-pink-400 hover:text-pink-300 text-sm"
                                    >
                                        Change email or resend OTP
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-pink-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}