"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@services/firebase/firebase";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { UserModel } from "@types";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toBase64 } from "@lib/convertBase64";
import AvatarDropzone from "@component/ui/AvatarDropZone";

export default function CandidateSettings() {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

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

          console.log("userInfo: ", userInfo);
          //render date when refresh page
          setUserData(userInfo);
          setName(userInfo.name);
          setBio(userInfo.profile?.bio ?? "");
          setLocation(userInfo.profile?.location ?? "");
          setPhone(userInfo.profile?.phone ?? "");
          setUserName(userInfo.username);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || !userData.id) return; // userData.id là id document trong firestore

    setLoading(true);
    try {
      const userRef = doc(firestore, "users", userData.id);

      let avatarUrl = userData.avatarUrl;

      // Upload avatar nếu có
      if (avatarFile) {
        avatarUrl = await toBase64(avatarFile);
      }

      // Cập nhật Firestore
      await updateDoc(userRef, {
        name,
        avatarUrl,
        id: userData.id,
        username: userName,
        profile: {
          bio,
          location,
          phone,
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
    <div className="container mx-auto py-6  ">
      <Card className="max-w-2xl mx-auto shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Avatar */}
              <div className="md:flex-shrink-0">
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setUserName(e.target.value);
                    }}
                    placeholder="Your full name"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    type="tel"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
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
        </CardContent>
      </Card>
    </div>
  );
}
