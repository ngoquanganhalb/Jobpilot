"use client";

import { useState } from "react";
import { createJobCard } from "../api/createJobCards/route";
import { toBase64 } from "@lib/convertBase64";

export default function UploadJobForm() {
  const [form, setForm] = useState({
    company: "",
    location: "",
    title: "",
    type: "",
    salary: "",
    urgent: false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!logoFile) {
      alert("Vui lòng chọn logo công ty!");
      return;
    }

    const base64Logo = await toBase64(logoFile);
    await createJobCard({ ...form, logo: base64Logo });
    alert("Tạo job thành công!");
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 border rounded">
      <h2 className="text-xl font-semibold">Tạo Job Mới</h2>

      <input
        type="text"
        name="company"
        placeholder="Tên công ty"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Địa điểm"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="text"
        name="title"
        placeholder="Vị trí tuyển dụng"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="text"
        name="type"
        placeholder="Hình thức làm việc (Full-time, Part-time...)"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="text"
        name="salary"
        placeholder="Lương"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="urgent" onChange={handleChange} />
        Gấp
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Tạo Job
      </button>
    </div>
  );
}

// const toBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = reject;
//   });
