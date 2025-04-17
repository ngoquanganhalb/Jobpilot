import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AccountType, FormData } from "@component/types/types";

export const createUser = async (formData: FormData, accountType: AccountType) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    formData.email,
    formData.password
  );

  const user = userCredential.user;

  // Save user info to Firestore
  await setDoc(doc(db, "users", user.uid), {
    name: formData.fullName,
    username: formData.username,
    isAdmin: false,
    accountType: accountType,
    email: formData.email,
    password: formData.password, //don't save passwordd tô firebase , should encrypt
  });

  return user;
};
