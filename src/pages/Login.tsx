import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Google } from "@mui/icons-material";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Sign in to continue to Todo App</p>

        <button
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-blue-700 active:scale-95 text-lg"
        >
          <Google className="text-xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
