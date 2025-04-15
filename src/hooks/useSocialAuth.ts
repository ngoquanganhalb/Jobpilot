
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../redux/slices/userSlice";
import { signInWithGoogle, signInWithFacebook } from "../services/socailAuth";

export const useSocialAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      const result =
        provider === "google"
          ? await signInWithGoogle()
          : await signInWithFacebook();

      const user = result.user;
      dispatch(
        setUser({
          id: user.uid,
          name: user.displayName || "",
          isAdmin: false,
        })
      );
      toast.success(`Signed in with ${provider}!`);
      router.push("/");
    } catch (error) {
      toast.error(`${provider} sign-in failed`);
    }
  };

  return { handleSocialSignIn };
};
