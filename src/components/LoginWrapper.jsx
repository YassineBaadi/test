"use client";

import { Suspense } from "react";
import Login from "./Login";

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
