"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AuthProvider from "@/components/AuthProvider";

export default function ReduxProvider({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
    </SessionProvider>
  );
}
