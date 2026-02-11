import styled from "@emotion/styled";
import { Dialog, DialogActions, DialogContent, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { SidebarContent } from "./SidebarContent";
import { UserContext } from "../contexts/UserContext";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { CustomDialogTitle, LogoutDialog, SettingsDialog } from ".";
import { showToast, systemInfo } from "../utils";
import { DownloadDoneRounded, ThumbUpRounded } from "@mui/icons-material";
import { DialogBtn } from "../styles";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { user } = useContext(UserContext);
  const isMobile = useResponsiveDisplay();
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openInstalledDialog, setOpenInstalledDialog] = useState<boolean>(false);

  // PWA Logic duplicated from Sidebar
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: ReadonlyArray<string>;
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const detectAppInstallation = () => {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
        setIsAppInstalled(e.matches);
      });
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    detectAppInstallation();

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          if (systemInfo.os === "Windows") {
            setOpenInstalledDialog(true);
          } else {
            showToast("App installed successfully!");
          }
        }
        if (choiceResult.outcome === "dismissed") {
          showToast("Installation dismissed.", { type: "error" });
        }
      });
    }
  };

  return (
    <LayoutContainer>
      {!isMobile && (
        <SidebarContainer>
          <SidebarContent
            openSettings={() => setOpenSettings(true)}
            openLogout={() => setOpenLogoutDialog(true)}
            user={user}
            installPWA={installPWA}
            supportsPWA={supportsPWA}
            isAppInstalled={isAppInstalled}
          />
        </SidebarContainer>
      )}
      <MainContent isMobile={isMobile}>
        {children}
      </MainContent>
       <Dialog open={openInstalledDialog} onClose={() => setOpenInstalledDialog(false)}>
              <CustomDialogTitle
                title="App installed successfully!"
                subTitle="The app is now running as a PWA."
                icon={<DownloadDoneRounded />}
                onClose={() => setOpenInstalledDialog(false)}
              />
              <DialogContent>
                You can access it from your home screen, with offline support and features like shortcuts
                and badges.
              </DialogContent>
              <DialogActions>
                <DialogBtn onClick={() => setOpenInstalledDialog(false)}>
                  <ThumbUpRounded /> &nbsp; Got it
                </DialogBtn>
              </DialogActions>
            </Dialog>
            <LogoutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} />
            <SettingsDialog
              open={openSettings}
              onClose={() => setOpenSettings(false)}
              handleOpen={() => setOpenSettings(true)}
            />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled(Paper)`
  width: 300px;
  flex-shrink: 0;
  border-radius: 0;
  border-right: 1px solid ${({ theme }) => (theme.darkmode ? "#ffffff1f" : "#0000001f")};
  background: ${({ theme }) => (theme.darkmode ? "#101418" : "#f7f9fc")};
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  padding: 16px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MainContent = styled.div<{ isMobile: boolean }>`
  flex-grow: 1;
  padding: ${({ isMobile }) => isMobile ? "16px" : "24px 48px"};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 128px; /* For BottomNav or fab */
`;
