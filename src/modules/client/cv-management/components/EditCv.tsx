import Button from "@component/ui/ButtonCustom";
import { Cv, Education, Experience } from "../../../../types/db";
import Input from "@component/ui/InputCustom";
import { uploadPhotoAndGetUrl } from "@utils/uploadPhotoAndGetUrl";
import { useEffect, useRef, useState } from "react";

type Prop = {
  formData: Cv;
  handlers: {
    handleInputChange: (key: string, value: any) => void;
    handleExperienceChange: (
      index: number,
      key: keyof Experience,
      value: any
    ) => void;
    addExperience: () => void;
    removeExperience: (index: number) => void;
    handleEducationChange: (
      index: number,
      key: keyof Education,
      value: any
    ) => void;
    addEducation: () => void;
    removeEducation: (index: number) => void;
    handleAddSkill: (skill: string) => void;
    handleRemoveSkill: (index: number) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    handleCloseModal: () => void;
  };
};

export const EditCv = ({ formData, handlers }: Prop) => {
  const {
    handleInputChange,
    addExperience,
    handleSubmit,
    handleCloseModal,
    addEducation,
    handleAddSkill,
    handleEducationChange,
    handleExperienceChange,
    handleRemoveSkill,
    removeEducation,
    removeExperience,
  } = handlers;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(
    (formData && formData.image) || null
  );
  const [uploading, setUploading] = useState(false);

  // Sync preview when parent updates formData.image
  useEffect(() => {
    setPreview(formData?.image || null);
  }, [formData?.image]);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Basic */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            File Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>

          {/* Use native input file to be safe */}
          <Input
            ref={fileInputRef }
            type="file"
            accept="image/*"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.currentTarget.files?.[0];
              if (!file) return;

              // tạo preview local
              const localUrl = URL.createObjectURL(file);
              setPreview(localUrl);

              try {
                setUploading(true);
                // await upload -> trả về string url
                const uploadedUrl = await uploadPhotoAndGetUrl(file);
                handlers.handleInputChange("image", uploadedUrl);
                setPreview(uploadedUrl);
              } catch (err) {
                console.error("Upload failed", err);
              } finally {
                setUploading(false);
                // reset input an toàn bằng ref (nếu vẫn mounted)
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                // revoke local object url để tránh leak
                try {
                  URL.revokeObjectURL(localUrl);
                } catch {}
              }
            }}
            className="mt-1 block w-full"
          />

          {/* Preview and upload status */}
          <div className="mt-2 flex items-center gap-3">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                No image
              </div>
            )}
            <div>
              {uploading ? (
                <div className="text-sm text-gray-500">Uploading...</div>
              ) : formData.image ? (
                <div className="text-sm text-green-600">Uploaded</div>
              ) : (
                <div className="text-sm text-gray-500">Not uploaded</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <Input
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <div className="flex gap-2 mt-2">
            <Input
              id="skillInput"
              className="flex-1 border rounded px-3 py-2"
            />
            <Button
              type="button"
              onClick={() => {
                const el = document.getElementById(
                  "skillInput"
                ) as HTMLInputElement | null;
                if (!el) return;
                const v = el.value.trim();
                if (!v) return;
                handleAddSkill(v);
                el.value = "";
              }}
              className="px-3 py-2 bg-green-600 hover:bg-green-800 text-white rounded"
            >
              Add
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {(formData.skills || []).map((s: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2 text-sm"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(i)}
                  className="text-red-500 text-xs"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <button
              type="button"
              onClick={addExperience}
              className="text-sm text-blue-600"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3 mt-2">
            {(formData.experience || []).map((exp: Experience, idx: number) => (
              <div key={idx} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">
                    Experience #{idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <Input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(idx, "company", e.target.value)
                  }
                />
                <Input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) =>
                    handleExperienceChange(idx, "position", e.target.value)
                  }
                />
                <input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) =>
                    handleExperienceChange(idx, "duration", e.target.value)
                  }
                />
                <textarea
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Description"
                  rows={2}
                  value={exp.description}
                  onChange={(e) =>
                    handleExperienceChange(idx, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <button
              type="button"
              onClick={addEducation}
              className="text-sm text-blue-600"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3 mt-2">
            {(formData.education || []).map((ed: Education, idx: number) => (
              <div key={idx} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">
                    Education #{idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <Input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="School"
                  value={ed.school}
                  onChange={(e) =>
                    handleEducationChange(idx, "school", e.target.value)
                  }
                />
                <Input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Degree"
                  value={ed.degree}
                  onChange={(e) =>
                    handleEducationChange(idx, "degree", e.target.value)
                  }
                />
                <Input
                  className="mt-2 block w-full border rounded px-2 py-1"
                  placeholder="Duration"
                  value={ed.duration}
                  onChange={(e) =>
                    handleEducationChange(idx, "duration", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleCloseModal}
            className="!px-4 !py-2 bg-gray-500 hover:bg-gray-700 rounded"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="!px-4 !py-2 bg-blue-600 text-white rounded"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
