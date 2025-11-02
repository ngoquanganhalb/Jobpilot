"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { store } from "@/redux/store";
import { doLogout } from "@/redux/slices/authSlice";
import { bindStoreHelpers } from "@/core/axios-custom.helpers";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: ReactNode }) {
  // ✅ Tạo queryClient 1 lần duy nhất trong lifecycle client
  const [queryClient] = useState(() => new QueryClient());

  // ✅ bind helpers (dispatch / logout) một lần
  useEffect(() => {
    bindStoreHelpers({
      dispatch: store.dispatch,
      doLogoutThunk: () => doLogout(),
    });
  }, []);

  return (
    <ReduxProvider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      {/* </PersistGate> */}
    </ReduxProvider>
  );
}
