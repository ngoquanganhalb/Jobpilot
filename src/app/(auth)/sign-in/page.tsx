"use client";
import SignInModule from "@modules/auth/sign-in/SignInModule";

export default function Home() {
  console.log("ENV CHECK", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  return (
    <div>
      <SignInModule />
    </div>
  );
}
