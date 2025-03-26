"use client"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import ProfielSpinner from "@/utilities/Spinner/ProfielSpinner"

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [step, setStep] = useState(1); 
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const otpParam = params.get('otp');
        
        if (emailParam) {
            setEmail(emailParam);
            if (otpParam) {
                setOtp(otpParam);
                setStep(3); 
            }
        }

        const token = localStorage.getItem("dilmstoken");
        if (token) {
            router.push("/");
        }
    }, [router]);

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
        
        // Validate email
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            let response = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "send"
            });
            setLoading(false);

            if (response.data.success) {
                setStep(2); // Move to OTP verification step
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
            console.error(err);
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            let response = await axios.post("/api/auth", {
                email: email.toLowerCase(),
                type: "verify",
                otp: otp
            });

            setLoading(false);

            if (response.data.success) {
                // User already exists
                toast.success("You're already registered! Redirecting to dashboard...");
                localStorage.setItem("dilmstoken", response.data.token);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else if (response.data.requiresRegistration) {
                // New user, needs to complete registration
                setStep(3);
                toast.success("OTP verified successfully! Complete your profile.");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
            console.error(err);
        }
    }

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        
        // Validate input fields
        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (!github.trim() || !github.includes('github.com')) {
            toast.error("Please enter a valid GitHub profile URL");
            return;
        }
        if (!linkedin.trim() || !linkedin.includes('linkedin.com')) {
            toast.error("Please enter a valid LinkedIn profile URL");
            return;
        }

        setLoading(true);
        try {
            let response = await axios.post("/api/auth", {
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

            if (response.data.success) {
                toast.success(response.data.message || "Account created successfully!");
                localStorage.setItem("dilmstoken", response.data.token);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                toast.error(response.data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later!");
            setLoading(false);
            console.error(err);
        }
    }

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
                        <h1 className="text-4xl font-bold text-pink-500">
                            {step === 1 && "Join LearnX-AI"}
                            {step === 2 && "Verify Email"}
                            {step === 3 && "Complete Profile"}
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {step === 1 && "Create your account to start learning"}
                            {step === 2 && "Enter the code sent to your email"}
                            {step === 3 && "Tell us a bit about yourself"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {step === 1 && (
                            <form onSubmit={handleOtpSend} className="space-y-4">
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
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Verification Code"}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="otp" className="text-gray-300">Verification Code</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        name="otp"
                                        placeholder="6-digit code"
                                        onChange={handleChange}
                                        value={otp}
                                        maxLength={6}
                                        required
                                        className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        We've sent a 6-digit code to {email}
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-all duration-200"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify Code"}
                                </Button>
                                <div className="text-center">
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="text-pink-400 hover:text-pink-300 text-sm"
                                        disabled={loading}
                                    >
                                        Change email or resend code
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleCompleteRegistration} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                        value={name}
                                        required
                                        className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="github" className="text-gray-300">GitHub Profile</Label>
                                    <Input
                                        id="github"
                                        type="url"
                                        name="github"
                                        placeholder="https://github.com/yourusername"
                                        onChange={handleChange}
                                        value={github}
                                        required
                                        className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="linkedin" className="text-gray-300">LinkedIn Profile</Label>
                                    <Input
                                        id="linkedin"
                                        type="url"
                                        name="linkedin"
                                        placeholder="https://linkedin.com/in/yourusername"
                                        onChange={handleChange}
                                        value={linkedin}
                                        required
                                        className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-all duration-200"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Complete Registration"}
                                </Button>
                            </form>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            {step !== 3 ? (
                                <>
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-pink-500 hover:underline">
                                        Login
                                    </Link>
                                </>
                            ) : (
                                <>
                                    By registering, you agree to our{" "}
                                    <Link href="#" className="text-pink-500 hover:underline">
                                        Terms & Conditions
                                    </Link>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}