"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

interface ThemeProviderPropsWithChildren extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderPropsWithChildren): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
