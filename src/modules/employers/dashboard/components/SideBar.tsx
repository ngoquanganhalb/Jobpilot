"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@component/ui/sheet";
import Button from "@component/ui/ButtonCustom";
import ButtonSlideBar from "@component/ui/ButtonSlideBar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { JSX } from "react";

type MenuItem = {
  label: string;
  icon: JSX.Element;
  path: string;
};

type SideBarProps = {
  menuItems: MenuItem[];
  title?: string;
};

export default function SideBar({
  menuItems,
  title = "DASHBOARD",
}: SideBarProps) {
  const router = useRouter();

  const SidebarNav = () => (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200 text-lg font-semibold text-gray-700">
        {title.toUpperCase()}
      </div>
      <nav className="p-2 flex-1 overflow-auto">
        {menuItems.map((item) => (
          <ButtonSlideBar
            key={item.label}
            icon={item.icon}
            label={item.label.replace(/([A-Z])/g, " $1").trim()}
            onClick={() => router.push(item.path)}
            href={item.path}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden px-4 pt-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">☰ Menu</Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-white shadow-xl">
            <VisuallyHidden>
              <SheetTitle>{title}</SheetTitle>
            </VisuallyHidden>
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 mr-8 rounded-xl shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden mt-6  ">
        <SidebarNav />
      </div>
    </>
  );
}
