import { ReactNode } from "react";
import { BottomNav, ProfileSidebar } from "../components";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <ProfileSidebar />
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {children}
        <div style={{ marginTop: "128px" }} />
      </div>
      <BottomNav />
    </>
  );
};

export default MainLayout;
