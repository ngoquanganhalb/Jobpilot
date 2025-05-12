"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@services/firebase/firebase";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { UserModel } from "@types";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toBase64 } from "@lib/convertBase64";
import AvatarDropzone from "@component/ui/AvatarDropZone";
import { MdLocationOn, MdPerson, MdPhone } from "react-icons/md";

// Validation Schemas
const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export default function ProfileSettings() {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // Profile Form
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: "",
      bio: "",
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

          // Set profile form values
          setProfileValue("name", userInfo.name);
          setProfileValue("location", userInfo.profile?.location ?? "");
          setProfileValue("phone", userInfo.profile?.phone ?? "");
          setProfileValue("bio", userInfo.profile?.bio ?? "");
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
  }, [setProfileValue]);

  const onProfileSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    if (!userData || !userData.id) return;

    setLoading(true);
    try {
      if (!userData.id) {
        throw new Error("User ID is undefined");
      }
      const userRef = doc(firestore, "users", userData.id);

      let avatarUrl = userData.avatarUrl;

      // Upload avatar if exists
      if (avatarFile) {
        avatarUrl = await toBase64(avatarFile);
      }

      // Update Firestore
      await updateDoc(userRef, {
        name: data.name,
        avatarUrl,
        id: userData.id,
        username: data.name,
        profile: {
          bio: data.bio,
          location: data.location,
          phone: data.phone,
        },
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-lg font-semibold mb-2">Basic Infomation</div>
      <form
        onSubmit={handleProfileSubmit(onProfileSubmit)}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <div className="md:flex-shrink-0">
            <Label htmlFor="location" className="font-semibold text-sm">
              Profile Picture
            </Label>
            <AvatarDropzone
              avatarPreview={avatarPreview ?? userData?.avatarUrl ?? null}
              onFileSelected={(file) => {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
              size={200}
            />
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-6">
            {/* Full Name */}
            <div className="space-y-1">
              <Label className="font-semibold text-sm" htmlFor="name">
                Full Name
              </Label>
              <Controller
                name="name"
                control={profileControl}
                render={({ field }) => (
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 pointer-events-none" />
                    <Input
                      {...field}
                      className="pl-10"
                      id="name"
                      placeholder="Your full name"
                    />
                    {profileErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label htmlFor="location" className="font-semibold text-sm">
                Location
              </Label>
              <Controller
                name="location"
                control={profileControl}
                render={({ field }) => (
                  <div className="relative">
                    <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 pointer-events-none" />
                    <Input
                      {...field}
                      id="location"
                      placeholder="City, Country"
                      className="pl-10"
                    />
                  </div>
                )}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="font-semibold text-sm">
                Phone Number
              </Label>
              <Controller
                name="phone"
                control={profileControl}
                render={({ field }) => (
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 pointer-events-none" />
                    <Input
                      {...field}
                      id="phone"
                      placeholder="Your phone number"
                      type="tel"
                      className="pl-10"
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="font-semibold text-sm">
            Bio
          </Label>
          <Controller
            name="bio"
            control={profileControl}
            render={({ field }) => (
              <Textarea
                {...field}
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <div
            className="w-full
           "
          >
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
