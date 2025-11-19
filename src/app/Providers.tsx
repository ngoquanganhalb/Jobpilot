// Providers.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchPermission from "./FetchPermission";
const { AuthGateway } = await import("@/core/auth-gateway");

function SessionRestorer() {
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Thử lấy session hiện tại
        // Nếu token hết hạn, axios interceptor sẽ tự động refresh
        await AuthGateway.getSession();
      } catch {}
    };

    restoreSession();
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionRestorer />
        <FetchPermission />
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
