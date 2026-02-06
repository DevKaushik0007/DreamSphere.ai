import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { 
  Sparkles, 
  Mail, 
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  CheckCircle
} from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long");

const benefits = [
  "AI-powered creative tools",
  "Mood-based personalization",
  "Private emotional journal",
  "Connect with dreamers",
];

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (mode === "signup") {
      const nameResult = nameSchema.safeParse(name);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    if (mode !== "forgot") {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error sending reset email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResetEmailSent(true);
        toast({
          title: "Reset email sent!",
          description: "Check your inbox for the password reset link.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "forgot") {
      await handleForgotPassword();
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try logging in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome to DreamSphere!",
            description: "Your account has been created successfully.",
          });
          navigate("/");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    if (mode === "forgot") {
      setMode("login");
    } else {
      setMode(mode === "login" ? "signup" : "login");
    }
    setErrors({});
    setResetEmailSent(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      <BackgroundOrbs />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-10 h-10 text-primary" />
          <span className="font-serif text-2xl font-bold text-gradient-aurora">
            DreamSphere.AI
          </span>
        </Link>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold mb-2">
                  {mode === "login" ? "Welcome Back" : mode === "signup" ? "Start Dreaming" : "Reset Password"}
                </h1>
                <p className="text-muted-foreground">
                  {mode === "login" 
                    ? "Enter your dreams, we've missed you" 
                    : mode === "signup"
                    ? "Create your free account and unlock your creativity"
                    : "Enter your email and we'll send you a reset link"
                  }
                </p>
              </div>

              {/* Benefits (signup only) */}
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Reset Email Sent Success */}
              {mode === "forgot" && resetEmailSent ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="font-serif text-xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to <span className="text-primary">{email}</span>
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setMode("login");
                      setResetEmailSent(false);
                    }}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name (signup only) */}
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Luna Dreams"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`pl-10 bg-muted/50 border-white/10 focus:border-primary/50 ${errors.name ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="dreamer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 bg-muted/50 border-white/10 focus:border-primary/50 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* Password (not for forgot mode) */}
                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        {mode === "login" && (
                          <button 
                            type="button" 
                            className="text-sm text-primary hover:underline"
                            onClick={() => setMode("forgot")}
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pl-10 pr-10 bg-muted/50 border-white/10 focus:border-primary/50 ${errors.password ? 'border-destructive' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                      {mode === "signup" && !errors.password && (
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      )}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="dream" 
                    size="lg" 
                    className="w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {mode === "login" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending reset link..."}
                      </>
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {mode === "signup" && (
                    <p className="text-xs text-muted-foreground text-center">
                      By signing up, you agree to our{" "}
                      <Link to="/terms" className="text-primary hover:underline">Terms</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                  )}
                </form>
              )}

              {!resetEmailSent && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    {mode === "login" ? "Don't have an account?" : mode === "signup" ? "Already have an account?" : "Remember your password?"}{" "}
                    <button 
                      onClick={toggleMode}
                      className="text-primary hover:underline font-medium"
                    >
                      {mode === "login" ? "Create one" : "Sign in"}
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
