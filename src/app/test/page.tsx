"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { tokenManager } from "@/core/tokenManager"; // bạn đã có

export default function Page() {
  // const { data: session, status } = useSession();

  // // Khi có appAccessToken từ NextAuth, đẩy vào tokenManager để mọi request BE nhận diện được user
  // useEffect(() => {
  //   const appToken = (session as any)?.appAccessToken;
  //   if (appToken) {
  //     tokenManager.setAccessToken(appToken);
  //   } else {
  //     tokenManager.clear();
  //   }
  // }, [session]);

  // if (status === "loading") return <p>Loading...</p>;

  // if (!session) {
  //   return (
  //     <main>
  //       <button onClick={() => signIn("google")}>Sign in with Google</button>
  //       <button onClick={() => signIn("facebook")}>
  //         Sign in with Facebook
  //       </button>
  //     </main>
  //   );
  // }

  // return (
  //   <main>
  //     <p>Hi, {session.user?.name}</p>
  //     <p>Email: {session.user?.email}</p>
  //     <p>UserId (internal): {(session.user as any)?.id}</p>
  //     <p>
  //       Permissions: {((session.user as any)?.permissions || []).join(", ")}
  //     </p>
  //     <button onClick={() => signOut()}>Sign out</button>
  //   </main>
  // );
  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => signIn("google")}>Login with Google</button>
      <button onClick={() => signIn("facebook")}>Login with Facebook</button>
    </div>
  );
}
