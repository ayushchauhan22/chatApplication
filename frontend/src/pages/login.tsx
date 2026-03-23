import { loginUser } from "../services/authServices";
import { useNavigate, Link } from "react-router-dom";
import { userAuthStore } from "@/store/auth/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/loginSchema";
import type { LoginFormData } from "../schema/loginSchema";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const setUser = userAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data);
      setUser(result?.data.userResponse);
      navigate("/home");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-card/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-xl ring-4 ring-primary/20">
            <MessageCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black text-foreground mb-2">Welcome back</h1>
          <p className="text-base text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="shadow-xl border-border">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground font-semibold text-xs uppercase tracking-wider">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                  {/* ← {...register("email")} is a JSX prop, NOT inside className */}
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
                    placeholder="Enter your password"
                    className="pl-12 h-12 bg-background/50"
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold">
                {isLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Signing in...</>
                  : "Sign In"
                }
              </Button>
            </form>

            <div className="pt-4 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;