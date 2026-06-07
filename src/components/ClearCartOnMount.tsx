"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export function ClearCartOnMount() {
  useEffect(() => {
    useCart.getState().clear();
  }, []);
  return null;
}
