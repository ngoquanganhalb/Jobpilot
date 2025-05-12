"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@services/firebase/firebase";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { UserModel } from "@types";
import { toast } from "react-toastify";
import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { MdEmail } from "react-icons/md";

const AccountSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If newPassword is provided, it must match confirmPassword
      if (data.newPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "New passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function AccountSettings() {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account Form
  const {
    control: accountControl,
    handleSubmit: handleAccountFormSubmit,
    setValue: setAccountValue,
    formState: { errors: accountErrors },
    watch: watchAccount,
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userDataFromFirestore = userSnap.data();
          const userInfo: UserModel = {
            id: userSnap.id,
            isAdmin: userDataFromFirestore.isAdmin,
            name: userDataFromFirestore.name || "",
            username: userDataFromFirestore.username || "",
            email: userDataFromFirestore.email || "",
            accountType: userDataFromFirestore.accountType || "candidate",
            avatarUrl: userDataFromFirestore.avatarUrl || "",
            profile: userDataFromFirestore.profile || {
              bio: "",
              location: "",
              phone: "",
              resumeUrl: "",
            },
            createdAt: userDataFromFirestore.createdAt || new Date(),
          };

          setUserData(userInfo);

          // Set account form values
          setAccountValue("email", userInfo.email);
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup
  }, [setAccountValue]);

  const onAccountSubmit = async (data: z.infer<typeof AccountSchema>) => {
    if (!userData) return;

    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email || "",
        data.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update email if changed
      if (data.email !== currentUser.email) {
        await updateEmail(currentUser, data.email);
      }

      // Update password if new password provided
      if (data.newPassword) {
        await updatePassword(currentUser, data.newPassword);
      }

      // Update email in Firestore
      if (!userData.id) {
        throw new Error("User ID is undefined");
      }
      const userRef = doc(firestore, "users", userData.id);
      await updateDoc(userRef, {
        email: data.email,
        updatedAt: new Date(),
      });

      // Reset password fields
      setAccountValue("currentPassword", "");
      setAccountValue("newPassword", "");
      setAccountValue("confirmPassword", "");

      toast.success("Account settings updated successfully!");
    } catch (error: any) {
      console.error("Error updating account settings:", error);
      toast.error(error.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-lg font-semibold mb-2"></div>
      <form
        onSubmit={handleAccountFormSubmit(onAccountSubmit)}
        className="space-y-6"
      >
        <div className="text-base font-semibold mb-2">Contact Info</div>
        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className=" text-sm">
            Email Address
          </Label>
          <Controller
            name="email"
            control={accountControl}
            render={({ field }) => (
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 pointer-events-none" />
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                />
                {accountErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {accountErrors.email.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="text-base font-semibold mb-2">Change Password</div>
        <div className="flex flex-row gap-4 ">
          {/* Current Password */}
          <div className="space-y-1 flex-1">
            <Label htmlFor="current-password" className=" text-sm">
              Current Password
            </Label>
            <Controller
              name="currentPassword"
              control={accountControl}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {accountErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {accountErrors.currentPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* New Password */}
          <div className="space-y-1 flex-1">
            <Label htmlFor="new-password" className=" text-sm">
              New Password
            </Label>
            <Controller
              name="newPassword"
              control={accountControl}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1 flex-1">
            <Label htmlFor="confirm-password" className="text-sm">
              Confirm New Password
            </Label>
            <Controller
              name="confirmPassword"
              control={accountControl}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {accountErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {accountErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
