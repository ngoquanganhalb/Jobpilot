"use client";
import { useState, useEffect } from "react";
import { Building2, Loader2 } from "lucide-react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@services/firebase/firebase";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import AvatarDropzone from "@component/ui/AvatarDropZone";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { ProfileEmployerFireBaseDto } from "@/dtos/user/profile-employer-firebase.dto";
import Spinner from "@component/ui/Spinner";
import { useEditUser } from "@hooks/user/useEditUser";
import { uploadPhotoAndGetUrl } from "@utils/uploadPhotoAndGetUrl";
type Form = ProfileEmployerFireBaseDto & {
  avatarUrl: string;
  companyName: string;
};
export default function EmployerSettings() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [userData, setUserData] = useState<Form>();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { editMutation } = useEditUser();
  useEffect(() => {
    const run = async () => {
      if (!user?.id) return;
      const ref = doc(firestore, "employer_profile", String(user.id));
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as ProfileEmployerFireBaseDto;
        const normalized: Form = {
          id: snap.id,
          avatarUrl: user.avatar ?? "",
          companyName: user.name,
          // savedJobs: data.savedJobs ?? [],
          createdAt: (data.createdAt as unknown as Date) ?? new Date(),
          companyProfile: {
            description: data.companyProfile?.description ?? "",
            website: data.companyProfile?.website ?? "",
            address: data.companyProfile?.address ?? "",
            industry: data.companyProfile?.industry ?? "",
          },
        };
        setUserData(normalized);
        setAvatarPreview(user.avatar);
      } else {
        const emptyDoc: Form = {
          id: String(user.id),
          avatarUrl: "",
          companyName: "",
          // savedJobs: [],
          createdAt: new Date(),
          companyProfile: {
            description: "",
            website: "",
            address: "",
            industry: "",
          },
        };
        await setDoc(ref, emptyDoc);
        setUserData(emptyDoc);
      }
    };
    run();
  }, [user?.id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return;
    setLoading(true);
    try {
      let avatarUrl = userData.avatarUrl ?? "";
      if (avatarFile) avatarUrl = await uploadPhotoAndGetUrl(avatarFile);
      await editMutation({
        avatar: avatarUrl,
        name: userData.companyName,
      });
      const ref = doc(firestore, "employer_profile", userData.id);

      await updateDoc(ref, {
        // avatarUrl,
        companyProfile: {
          description: userData.companyProfile?.description ?? "",
          website: userData.companyProfile?.website ?? "",
          address: userData.companyProfile?.address ?? "",
          industry: userData.companyProfile?.industry ?? "",
        },
      });

      setUserData((prev) => (prev ? { ...prev, avatarUrl } : prev));
      setAvatarFile(null);
      toast.success("Success");
    } catch (err) {
      console.error(err);
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        <AvatarDropzone
          avatarPreview={avatarPreview ?? userData.avatarUrl ?? null}
          onFileSelected={(file) => {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
          }}
          size={200}
        />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Company name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
              <Input
                value={userData.companyName ?? ""}
                onChange={(e) =>
                  setUserData((prev) =>
                    prev
                      ? {
                          ...prev,
                          companyName: e.target.value,
                        }
                      : prev
                  )
                }
                className="pl-10"
              />
            </div>
          </div>
          {/* Website */}
          <div className="space-y-1">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
              <Input
                id="website"
                value={userData.companyProfile?.website ?? ""}
                onChange={(e) =>
                  setUserData((prev) =>
                    prev
                      ? {
                          ...prev,
                          companyProfile: {
                            ...(prev.companyProfile ?? {}),
                            website: e.target.value,
                          },
                        }
                      : prev
                  )
                }
                placeholder="https://your-company.com"
                className="pl-10"
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-1">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={userData.companyProfile?.industry ?? ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev
                    ? {
                        ...prev,
                        companyProfile: {
                          ...(prev.companyProfile ?? {}),
                          industry: e.target.value,
                        },
                      }
                    : prev
                )
              }
              placeholder="E.g. Software, Fintech..."
            />
          </div>

          {/* Address */}
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={userData.companyProfile?.address ?? ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev
                    ? {
                        ...prev,
                        companyProfile: {
                          ...(prev.companyProfile ?? {}),
                          address: e.target.value,
                        },
                      }
                    : prev
                )
              }
              placeholder="City, Country / Full address"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">About us</Label>
        <Textarea
          id="description"
          value={userData.companyProfile?.description ?? ""}
          onChange={(e) =>
            setUserData((prev) =>
              prev
                ? {
                    ...prev,
                    companyProfile: {
                      ...(prev.companyProfile ?? {}),
                      description: e.target.value,
                    },
                  }
                : prev
            )
          }
          placeholder="Tell us about your company..."
          rows={4}
        />
      </div>

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
  );
}
