// Upload image to Cloudinary and get secure_url
export const uploadPhotoAndGetUrl = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "jobpilot"); // preset bạn đã tạo sẵn trong Cloudinary
  formData.append("folder", "avatars"); // thư mục chứa ảnh (tùy bạn đổi)

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/davkp2wja/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }
    console.log("data", data);
    return data.secure_url; // link ảnh thật
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload photo");
  }
};
