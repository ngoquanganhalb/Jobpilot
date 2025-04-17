// import * as admin from "firebase-admin";

// if (!admin.apps.length) {
  


//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     }),
//   });
// }

// export const verifyIdToken = async (token: string) => {
//   return await admin.auth().verifyIdToken(token);
// };

// src/services/firebase/firebaseAdmin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY env var");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const verifyIdToken = async (token: string) => {
  return admin.auth().verifyIdToken(token);
};
