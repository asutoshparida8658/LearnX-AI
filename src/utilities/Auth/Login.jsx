"use client"
import Image from "next/image"
import Link from "next/link"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ProfielSpinner from "../Spinner/ProfielSpinner"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"

export function Login() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpsent, setIsOtpsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "otp") {
            setOtp(e.target.value);
        }
    };

    const handleOtpSend = async (e) => {
        e.preventDefault();
        if (email === "") {
            toast.error("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            const data = await axios.post("/api/auth", { email: email.toLowerCase(), type: "send" });
            setLoading(false);
            if (data.data.success) {
                setIsOtpsent(true);
                toast.success(data.data.message);
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            setLoading(false);
            toast.error("Something went wrong. Please try again later!");
        }
    };

    const hanldeVerifyOtp = async () => {
        if (otp === "") {
            toast.error("Please enter OTP");
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
                toast.success(data.data.message);
                localStorage.setItem("dilmstoken", data.data.token);
                router.push("/");
            } else if (data.data.requiresRegistration) {
                toast.info("Please complete your registration");
                router.push(`/register?email=${encodeURIComponent(email)}`); // Fixed string interpolation
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            setLoading(false);
            toast.error("Something went wrong. Please try again later!");
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
                        <p className="text-gray-400 mt-2">Login to access your account</p>
                    </div>
                    <div className="space-y-6">
                        {!isOtpsent && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="m@example.com"
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
                        {isOtpsent && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="otp" className="text-gray-300">OTP (One Time Password)</Label>
                                    <InputOTP maxLength={6} onChange={(value) => { setOtp(value); }}>
                                        <InputOTPGroup className="flex justify-between mt-2">
                                            {[...Array(6)].map((_, index) => (
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
                                    onClick={hanldeVerifyOtp}
                                >
                                    {loading ? "Verifying..." : "Login"}
                                </Button>
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