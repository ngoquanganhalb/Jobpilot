"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { MdEmail } from "react-icons/md";
import { useGetUserProfile } from "@hooks/business/useGetUserProfile";
import { useEditUser } from "@hooks/user/useEditUser";

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
      // validate same password
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
  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data, isLoading } = useGetUserProfile();
  const { editMutation } = useEditUser();
  const user = data?.user;
  // Acc Form
  const {
    control: accountControl,
    handleSubmit: handleAccountFormSubmit,
    // setValue: setAccountValue,
    formState: { errors: accountErrors },
    // watch: watchAccount,
    reset,
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
    if (user) {
      reset({
        email: user.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const onAccountSubmit = async (data: z.infer<typeof AccountSchema>) => {
    editMutation({ email: data.email, password: data.newPassword });
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
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
