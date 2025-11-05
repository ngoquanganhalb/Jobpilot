"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { store } from "@/redux/store";
import { doLogout } from "@/redux/slices/authSlice";
import { bindStoreHelpers } from "@/core/axios-custom.helpers";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchPermission from "./FetchPermission";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // bind helpers (dispatch / logout) một lần cho axios
  useEffect(() => {
    bindStoreHelpers({
      dispatch: store.dispatch,
      doLogoutThunk: () => doLogout(),
    });
  }, []);

  return (
    //tanstack
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <FetchPermission />
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        {/* </PersistGate> */}
      </ReduxProvider>
    </QueryClientProvider>
  );
}
