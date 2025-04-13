// import type { NextApiRequest, NextApiResponse } from "next";
// import cloudinary from "../../services/cloudinary";

// type Data = {
//   url?: string;
//   error?: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method === "POST") {
//     const { image } = req.body as { image: string };
//     try {
//       const result = await cloudinary.uploader.upload(image, {
//         folder: "job-app-images",
//       });
//       res.status(200).json({ url: result.secure_url });
//     } catch (error: any) {
//       console.error(error);
//       res.status(500).json({ error: "Upload failed" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
