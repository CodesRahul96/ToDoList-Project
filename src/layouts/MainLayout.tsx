import { ReactNode } from "react";
import { BottomNav, ProfileSidebar, SidebarLayout } from "../components";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useResponsiveDisplay();
  return (
    <SidebarLayout>
      {isMobile && <ProfileSidebar />}
      {children}
      {isMobile && <BottomNav />}
    </SidebarLayout>
  );
};

export default MainLayout;
