"use client";

import { usePbAuthListener } from "@/state/hooks/usePbAuthListener";
import { Sidebar } from "./navigation/Sidebar";
import { PBUserRecord } from "@/state/user";
import { Toolbar } from "./navigation/Toolbar";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Notification } from "./Notification";
import { appQueryClient } from "../query/queryclient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from "@/state/hooks/useThemeHook";

interface AppWrapperProps {
  children: React.ReactNode;
  user: PBUserRecord;
  theme?: Theme;
}

export function AppWrapper({ children, user, theme }: AppWrapperProps) {
  const [queryClient] = React.useState(() => appQueryClient);
  usePbAuthListener();
  // console.log("document.cookie  ==== ",document.cookie)
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen flex flex-col md:flex-row  items-center justify-center">
        <div className="w-full md:hidden h-14 flex items-center justify-start bg-secondary">
          <Toolbar user={user} theme={theme} />
        </div>
        <div className="md:w-[250px] hidden h-full md:flex flex-col items-center justify-center bg-secondary">
          <Sidebar user={user} theme={theme} />
        </div>
        <div className="w-full h-screen overflow-y-scroll scroll-bar">
          {children}
        </div>
        <div className="w-full fixed bottom-3 flex items-center justify-center">
          <Notification />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}