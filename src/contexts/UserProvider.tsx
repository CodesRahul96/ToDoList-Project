import { useEffect } from "react";
import { defaultUser } from "../constants/defaultUser";
import { useStorageState } from "../hooks/useStorageState";
import { User } from "../types/user";
import { UserContext } from "./UserContext";
import { useAuth } from "./AuthContext";

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  const { user: firebaseUser } = useAuth();

  useEffect(() => {
    if (firebaseUser) {
      setUser((prevUser) => {
        const needsNameUpdate = !prevUser.name && firebaseUser.displayName;
        const needsPictureUpdate = !prevUser.profilePicture && firebaseUser.photoURL;

        if (needsNameUpdate || needsPictureUpdate) {
          return {
            ...prevUser,
            name: needsNameUpdate ? firebaseUser.displayName : prevUser.name,
            profilePicture: needsPictureUpdate ? firebaseUser.photoURL : prevUser.profilePicture,
          };
        }
        return prevUser;
      });
    }
  }, [firebaseUser, setUser]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
