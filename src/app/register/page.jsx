"use client"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        else if (name === "otp") setOtp(value);
        else if (name === "name") setName(value);
        else if (name === "github") setGithub(value);
        else if (name === "linkedin") setLinkedin(value);
    }

    const handleOtpSend = async (e) => {
        e.preventDefault();
        if (email === "") {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            let data = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "send"
            });
            setLoading(false);

            if (data.data.success) {
                setIsOtpSent(true);
                toast.success(data.data.message);
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () => {
        if (otp === "") {
            toast.error("Please enter OTP");
            return;
        }

        setLoading(true);
        try {
            let data = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "verify",
                otp: otp
            });

            setLoading(false);

            if (data.data.success) {
                setIsOtpVerified(true);
                toast.success("OTP verified successfully! Please complete your registration.");
            } else if (data.data.requiresRegistration) {
                setIsOtpVerified(true);
                toast.success("OTP verified successfully! Please complete your registration.");
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
        }
    }

    const handleCompleteRegistration = async () => {
        if (name === "" || github === "" || linkedin === "") {
            toast.error("Please fill all the fields");
            return;
        }

        setLoading(true);
        try {
            let data = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "verify",
                otp: otp,
                registrationData: {
                    name,
                    github,
                    linkedin
                }
            });

            setLoading(false);

            if (data.data.success) {
                toast.success(data.data.message);
                localStorage.setItem("dilmstoken", data.data.token);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                toast.error(data.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
        }
    }

    return (
        <>
            <Toaster position="top-center" expand={false} />
            <div className={`w-full h-screen flex items-center justify-center ${loading ? "opacity-30" : ""} bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100`}>
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <div className="flex justify-center items-center my-4">
                            <img
                                src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png"
                                alt="DevSomeWare Logo"
                                className="lg:h-16 lg:w-48 w-48 h-16"
                            />
                        </div>
                        <h1 className="text-3xl font-bold mt-16 text-pink-500">Create Your Account</h1>
                    </div>

                    <div className="grid gap-4">
                        {!isOtpSent && (
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-pink-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    onChange={handleChange}
                                    value={email}
                                    required
                                    className="bg-gray-800 text-pink-500 border-pink-500"
                                />
                                <Button
                                    type="submit"
                                    className="w-full mt-2 bg-pink-500 text-gray-900 hover:bg-pink-600"
                                    onClick={handleOtpSend}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </div>
                        )}

                        {isOtpSent && !isOtpVerified && (
                            <div className="grid gap-2">
                                <Label htmlFor="otp" className="text-pink-300">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    name="otp"
                                    placeholder="6-digit OTP"
                                    onChange={handleChange}
                                    value={otp}
                                    maxLength={6}
                                    required
                                    className="bg-gray-800 text-pink-500 border-pink-500"
                                />
                                <Button
                                    type="submit"
                                    className="w-full mt-2 bg-pink-500 text-gray-900 hover:bg-pink-600"
                                    onClick={handleVerifyOtp}
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </div>
                        )}

                        {isOtpVerified && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-pink-300">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                        value={name}
                                        required
                                        className="bg-gray-800 text-pink-500 border-pink-500"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full mt-2 bg-pink-500 text-gray-900 hover:bg-pink-600"
                                    onClick={handleCompleteRegistration}
                                >
                                    {loading ? "Creating Account..." : "Complete Registration"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-center text-sm text-pink-300">
                        Already have an account?{" "}
                        <a href="/login" className="underline text-pink-500 hover:text-pink-600">
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
