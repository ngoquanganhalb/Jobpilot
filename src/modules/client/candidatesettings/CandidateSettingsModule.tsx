"use client";
import { useState } from "react";
import AccountSettings from "./components/AccountSettings";
import ProfileSettings from "./components/ProfileSettings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import MyCV from "./components/MyCV";

export default function CandidateSettingsMoudule() {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-5xl mx-auto shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="text-xl px-6 mt-2">Setting</div>
        <CardHeader className="">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "profile" | "account")
            }
            className="w-full border-b"
          >
            <TabsList className="flex gap-3 bg-transparent under ">
              <TabsTrigger
                value="profile"
                className={`flex items-center gap-2 py-2 text-sm font-medium relative cursor-pointer ${
                  activeTab === "profile"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <RiAccountCircleFill
                  className={`w-10 h-10 ${
                    activeTab === "profile" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Profile Settings
                {activeTab === "profile" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="account"
                className={`flex items-center gap-2 py-2 text-sm font-medium relative cursor-pointer ${
                  activeTab === "account"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <IoSettingsOutline
                  className={` ${
                    activeTab === "account" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Account Setting
                {activeTab === "account" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {activeTab === "profile" && (
            <>
              <ProfileSettings />
              <div className="mt-5">
                <MyCV />
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              <AccountSettings />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
