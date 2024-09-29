import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 min-h-[calc(100vh-13rem)]">{children}</div>
  );
}