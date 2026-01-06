import { auth } from "@lib/firebase.client";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = () => {
  return signInWithPopup(auth, facebookProvider);
};
