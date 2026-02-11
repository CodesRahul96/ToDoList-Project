import { createContext, useContext } from "react";
import type { User } from "../types/user";
import { defaultUser } from "../constants/defaultUser";

interface UserProps {
  user: User; // User data
  setUser: React.Dispatch<React.SetStateAction<User>>; // Function to update user data
}

export const UserContext = createContext<UserProps>({ user: defaultUser, setUser: () => {} });

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
