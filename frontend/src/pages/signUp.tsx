import { signupUser } from "../services/authServices";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schema/signupSchema";
import type { SignupFormData } from "../schema/signupSchema";
import { userAuthStore } from "@/store/auth/authStore";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, Mail, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

function Signup() {
    const navigate = useNavigate();
    const setUser = userAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            const result = await signupUser({ ...data, phone: Number(data.phone) });
            setUser(result.data);
            toast.success("Account created!");
            navigate("/home");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-card/30 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-xl ring-4 ring-primary/20">
                        <MessageCircle className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-2">Create Account</h1>
                    <p className="text-base text-muted-foreground">Get started in seconds</p>
                </div>

                <Card className="shadow-xl border-border">
                    <CardContent className="p-8 space-y-5">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-card-foreground font-semibold text-xs uppercase tracking-wider">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                                    {/* ← {...register("name")} is a JSX prop, NOT inside className */}
                                    <Input
                                        id="name"
                                        placeholder="Your full name"
                                        className="pl-12 h-12 bg-background/50"
                                        {...register("name")}
                                    />
                                </div>
                                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-card-foreground font-semibold text-xs uppercase tracking-wider">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Your phone number"
                                        className="pl-12 h-12 bg-background/50"
                                        {...register("phone")}
                                    />
                                </div>
                                {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-card-foreground font-semibold text-xs uppercase tracking-wider">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-12 h-12 bg-background/50"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-card-foreground font-semibold text-xs uppercase tracking-wider">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a password"
                                        className="pl-12 h-12 bg-background/50"
                                        {...register("password")}
                                    />
                                </div>
                                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold">
                                {isLoading
                                    ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Creating...</>
                                    : "Create Account"
                                }
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-border">
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Signup;