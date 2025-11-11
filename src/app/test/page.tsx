"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { tokenManager } from "@/core/tokenManager"; // bạn đã có
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

export default function Page() {
  console.log(
    "redux",
    useSelector((state: RootState) => state)
  );
  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => signIn("google")}>Login with Google</button>
      <button onClick={() => signIn("facebook")}>Login with Facebook</button>
    </div>
  );
}
