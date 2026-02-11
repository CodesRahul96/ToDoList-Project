import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "../types/user";

export const getUserFromFirestore = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
};

export const saveUserToFirestore = async (user: User, uid: string): Promise<void> => {
  try {
    // Determine if we should save based on last modification?
    // For now, we save the entire object.
    // In a real app, we might want to use updateDoc for partial updates
    // or properly handle merging strategies.
    await setDoc(doc(db, "users", uid), user);
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
  }
};
