"use client";

import { useEffect } from "react";

export default function DisableConsole() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.log = () => {};
      console.warn = () => {};
      // deja error si quieres:
      // console.error = () => {};
    }
  }, []);

  return null;
}
