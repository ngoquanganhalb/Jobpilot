"use client";
import HomePageModule from "@component/modules/homepage/HomePageModule";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state: any) => state.user);
  return (
    <div>
      <HomePageModule />
      <div>
        <h1>Helo, {user.name || "bạn"}!</h1>
        <p>User ID: {user.id}</p>
      </div>
    </div>
  );
}
