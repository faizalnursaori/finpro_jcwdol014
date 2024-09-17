import { ReactNode } from "react";
import ProfileMenu from "@/components/ProfileMenu";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: ProfileLayoutProps) {
  return (
    <main>
      <div className="flex justify-center gap-6">
      <ProfileMenu/>
        {children}
      </div>
    </main>
  );
}
