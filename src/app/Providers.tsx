"use client";

import { ReactNode, useState, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchPermission from "./FetchPermission";
import { PermissionProvider } from "@/permission/PermissionContext";
import { AuthGateway } from "@/core/auth-gateway";

function SessionRestorer() {
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        await AuthGateway.getSession();

        if (mounted) {
          console.log("Session restored");
        }
      } catch (error: any) {
        if (mounted) {
          // Only log if not auth disabled
          if (!error.message?.includes("Auth disabled")) {
            console.warn("Failed to restore session");
          }
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PermissionProvider>
          <SessionRestorer />
          <FetchPermission />
          {children}
        </PermissionProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
