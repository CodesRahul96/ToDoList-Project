import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Google, GitHub, Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Divider, 
  CircularProgress 
} from "@mui/material";
import { showToast } from "../utils";

const Login = () => {
  const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        showToast("Please enter both email and password.", { type: "error" });
        return;
    }
    
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        showToast("Account created successfully!");
      } else {
        await signInWithEmail(email, password);
        showToast("Welcome back!");
      }
    } catch {
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800 animate-fade-in">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">
            {isSignUp ? "Sign up to start organizing your tasks" : "Sign in to continue to Todo App"}
        </p>

        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4">
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Email className="text-gray-400" />
                        </InputAdornment>
                    ),
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "transparent",
                    }
                }}
            />
            
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "transparent",
                    }
                }}
            />

            <Button 
                variant="contained" 
                size="large" 
                type="submit"
                disabled={isSubmitting || loading}
                sx={{ 
                    mt: 1, 
                    borderRadius: "12px", 
                    py: 1.5,
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "none",
                }}
            >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
        </form>

        <div className="w-full my-6 flex items-center">
            <Divider sx={{ flexGrow: 1 }} />
            <span className="px-3 text-sm text-gray-500">OR</span>
            <Divider sx={{ flexGrow: 1 }} />
        </div>

        <div className="w-full flex flex-col gap-3">
            <button
            onClick={() => signInWithGoogle()}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-transform hover:bg-gray-50 active:scale-95 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            >
            <Google className="text-xl text-blue-500" />
            Continue with Google
            </button>
            
            <button
            onClick={() => signInWithGithub()}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292e] px-6 py-3 font-semibold text-white transition-transform hover:bg-[#2f363d] active:scale-95"
            >
            <GitHub className="text-xl" />
            Continue with GitHub
            </button>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span 
                onClick={() => setIsSignUp(!isSignUp)}
                className="cursor-pointer font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
                {isSignUp ? "Sign In" : "Sign Up"}
            </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
