"use client"
import Image from "next/image"
import Link from "next/link"
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

    // Get email from URL query parameters
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

    const handleOtpSend = async(e) => {
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

    const handleVerifyOtp = async() => {
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

    const handleCompleteRegistration = async() => {
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
            <div className={`w-full lg:grid lg:grid-cols-2 ${loading ? "opacity-30" : ""}`}>
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <div className="flex justify-center items-center my-4">
                                <img
                                    src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png" 
                                    alt="DevSomeWare Logo"
                                    className="lg:h-16 lg:w-48 lg:absolute w-48 h-16"
                                />
                            </div>
                            <h1 className="text-3xl font-bold mt-16">Create Your Account</h1>
                            <p className="text-balance text-muted-foreground">
                                Complete your registration to join DevSomeWare
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {!isOtpSent && (
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        onChange={handleChange}
                                        value={email}
                                        required
                                    />
                                    <Button 
                                        type="submit" 
                                        className="w-full mt-2" 
                                        onClick={handleOtpSend}
                                    >
                                        {loading ? "Sending..." : "Send OTP"}
                                    </Button>
                                </div>
                            )}

                            {isOtpSent && !isOtpVerified && (
                                <div className="grid gap-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        name="otp"
                                        placeholder="6-digit OTP"
                                        onChange={handleChange}
                                        value={otp}
                                        maxLength={6}
                                        required
                                    />
                                    <Button 
                                        type="submit" 
                                        className="w-full mt-2" 
                                        onClick={handleVerifyOtp}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </Button>
                                </div>
                            )}

                            {isOtpVerified && (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            onChange={handleChange}
                                            value={name}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="github">GitHub Profile</Label>
                                        <Input
                                            id="github"
                                            type="text"
                                            name="github"
                                            placeholder="https://github.com/yourusername"
                                            onChange={handleChange}
                                            value={github}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                        <Input
                                            id="linkedin"
                                            type="text"
                                            name="linkedin"
                                            placeholder="https://linkedin.com/in/yourusername"
                                            onChange={handleChange}
                                            value={linkedin}
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full mt-2" 
                                        onClick={handleCompleteRegistration}
                                    >
                                        {loading ? "Creating Account..." : "Complete Registration"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden bg-muted lg:block">
                    <Image
                        src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733758106/sp4p5jakzob6dxjxvlhw.png"
                        alt="Registration Image"
                        width="1920"
                        height="1080"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}