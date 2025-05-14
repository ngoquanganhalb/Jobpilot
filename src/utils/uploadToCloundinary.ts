  // Functtion upload file to Cloudinary
  export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jobpilot"); // preset đã tạo trong Cloudinary
    formData.append("folder", "cv");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/davkp2wja/raw/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("Upload failed");

    return data.secure_url;
  };

  