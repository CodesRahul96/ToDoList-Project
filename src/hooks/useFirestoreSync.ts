import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserFromFirestore, saveUserToFirestore } from "../services/userService";
import { useUser } from "../contexts/UserContext";
import { debounce } from "lodash";
import { showToast } from "../utils";

export const useFirestoreSync = () => {
  const { user: authUser } = useAuth();
  const { user, setUser } = useUser();
  const isInitialLoad = useRef(true);

  // Debounced save function to prevent excessive writes
  const debouncedSave = useRef(
    debounce(async (userData, uid) => {
      await saveUserToFirestore(userData, uid);
    }, 2000)
  ).current;

  // Pull data from Firestore on login
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        try {
          const remoteUser = await getUserFromFirestore(authUser.uid);
          if (remoteUser) {
            // Merge logic could go here. For now, remote wins on initial load if it exists.
            // But we must be careful not to overwrite local data if the user just created an account
            // and has local data they want to keep.
            // Simple strategy: If remote has data, use it.
            setUser({ ...remoteUser, lastSyncedAt: new Date() });
            showToast("Data synced from cloud", { type: "success" });
          } else {
            // First time login, save local data to cloud
             await saveUserToFirestore(user, authUser.uid);
          }
        } catch (error) {
          console.error("Sync error:", error);
          showToast("Failed to sync data", { type: "error" });
        }
      }
    };

    if (authUser) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, setUser]); // user dependency removed to prevent loops

  // Push data to Firestore on change
  useEffect(() => {
    if (authUser && !isInitialLoad.current) {
      debouncedSave(user, authUser.uid);
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [user, authUser, debouncedSave]);
};
