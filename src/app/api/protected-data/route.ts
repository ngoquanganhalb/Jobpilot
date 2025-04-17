// // pages/api/protected-data/route.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { verifyIdToken } from "../../../services/firebase/firebaseAdmin"; // 
// import { getAuth } from "firebase-admin/auth";


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const token = req.cookies.token;
//   console.log("Received token:", token); 
//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   try {
//     const decoded = await verifyIdToken(token); // Verify với Firebase Admin SDK
//     // console.log("Decoded token:", decoded);
//     const uid = decoded.uid;
  
//     // Lấy thêm user info nếu cần
//     const user = await getAuth().getUser(uid);
    

//     return res.status(200).json({
//       message: "Protected content",
//       uid,
//       email: user.email,
//     });
    
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }
// app/api/protected-data/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { verifyIdToken } from "../../../services/firebase/firebaseAdmin";

// export async function GET(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "No token provided" }, { status: 401 });
//   }

//   try {
//     const decoded = await verifyIdToken(token);
//     return NextResponse.json({
//       message: "Protected content",
//       uid: decoded.uid,
//       email: decoded.email,
//     });
//   } catch (err) {
//     console.error("Token verify error:", err);
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }
