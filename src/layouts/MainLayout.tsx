import { ReactNode } from "react";
import { BottomNav, ProfileSidebar, SidebarLayout } from "../components";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

import { ModernBackground } from "../components/ModernBackground";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useResponsiveDisplay();
  return (
    <SidebarLayout>
      <ModernBackground />
      {isMobile && <ProfileSidebar />}
      {children}
      {isMobile && <BottomNav />}
    </SidebarLayout>
  );
};

export default MainLayout;
