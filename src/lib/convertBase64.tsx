export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

// import { useState } from "react";
// import {createJobCard} from "../app/api/createJobCards/route";
// export default function JobCardUploader() {
//   const [companyLogoBase64, setCompanyLogoBase64] = useState<string>("");

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         if (reader.result) {
//           setCompanyLogoBase64(reader.result as string); // Set base64 string
//         }
//       };
//     }
//   };

//   const handleSubmit = async () => {
//     if (companyLogoBase64) {
//       // Gọi hàm tạo JobCard và lưu logo base64 vào Firestore
//       const jobCardId = await createJobCard(companyLogoBase64);
//       console.log("Job card created with ID:", jobCardId);
//     } else {
//       console.log("No logo uploaded");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} />
//       <button onClick={handleSubmit}>Create Job Card</button>
//     </div>
//   );
// }

// import { useState } from "react";
// import { createJobCard } from "../app/api/createJobCards/route";

// export default function UploadJobForm() {
//   const [file, setFile] = useState<File | null>(null);

//   const handleSubmit = async () => {
//     if (!file) return alert("Vui lòng chọn logo công ty");
//     await createJobCard(file); // gửi file ảnh lên hàm xử lý
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />
//       <button onClick={handleSubmit}>Tạo Job</button>
//     </div>
//   );
// }
