import {
  AddRounded,
  CategoryRounded,
  DeleteForeverRounded,
  Favorite,
  GetAppRounded,
  InstallDesktopRounded,
  InstallMobileRounded,
  IosShareRounded,
  Logout,
  PhoneIphoneRounded,
  PhonelinkRounded,
  SettingsRounded,
  TaskAltRounded,
  StarRounded,
  LightModeRounded,
  AccessTimeFilledRounded,
} from "@mui/icons-material";
import { Divider, MenuItem, Tooltip, keyframes } from "@mui/material";
import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";

import {
  UserAvatar,
  reduceMotion,
  ring,
} from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import {
  getProfilePictureFromDB,
  shortRelativeTime,
  showToast,
  systemInfo,
  timeAgo,
} from "../utils";

import { User } from "../types/user";

interface SidebarContentProps {
  onClose?: () => void;
  openSettings: () => void;
  openLogout: () => void;
  user: User;
  installPWA: () => void;
  supportsPWA: boolean;
  isAppInstalled: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  onClose,
  openSettings,
  openLogout,
  user,
  installPWA,
  supportsPWA,
  isAppInstalled,
}) => {
  const { name, profilePicture, tasks, settings } = user;
  const n = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadProfilePicture = async () => {
      const picture = await getProfilePictureFromDB(profilePicture);
      setAvatarSrc(picture);
    };
    loadProfilePicture();
  }, [profilePicture]);

  const handleLinkClick = (path: string) => {
    n(path);
    if (onClose) onClose();
  };

  const isActive = (path: string, filter?: string | null) => {
      if (filter) {
          return location.pathname === path && filterParam === filter;
      }
      if (filter === null) {
          return location.pathname === path && !filterParam;
      }
      return location.pathname === path;
  }

  return (
    <>
      <LogoContainer
        translate="no"
        onClick={() => handleLinkClick("/")}
      >
        <Logo src="/logo192.png" alt="logo" />
        <LogoText>
          <span>Todo</span> App
          <span>.</span>
        </LogoText>
      </LogoContainer>

      {/* Smart Views */}
      <MenuLink onClick={() => handleLinkClick("/?filter=today")}>
        <StyledMenuItem selected={isActive("/", "today")} aria-current={isActive("/", "today") ? "page" : undefined}>
          <LightModeRounded /> &nbsp; My Day
        </StyledMenuItem>
      </MenuLink>

      <MenuLink onClick={() => handleLinkClick("/?filter=important")}>
         <StyledMenuItem selected={isActive("/", "important")} aria-current={isActive("/", "important") ? "page" : undefined}>
          <StarRounded /> &nbsp; Important
        </StyledMenuItem>
      </MenuLink>

      <MenuLink onClick={() => handleLinkClick("/")}>
        <StyledMenuItem selected={isActive("/", null)} aria-current={isActive("/", null) ? "page" : undefined}>
          <TaskAltRounded /> &nbsp; All Tasks
          {tasks.filter((task: any) => !task.done).length > 0 && (
            <Tooltip title={`${tasks.filter((task: any) => !task.done).length} tasks to do`}>
              <MenuLabel>
                {tasks.filter((task: any) => !task.done).length > 99
                  ? "99+"
                  : tasks.filter((task: any) => !task.done).length}
              </MenuLabel>
            </Tooltip>
          )}
        </StyledMenuItem>
      </MenuLink>

      <StyledDivider />

      <MenuLink onClick={() => handleLinkClick("/add")}>
        <StyledMenuItem selected={isActive("/add")} aria-current={isActive("/add") ? "page" : undefined}>
          <AddRounded /> &nbsp; Add Task
        </StyledMenuItem>
      </MenuLink>

      {settings.enableCategories !== undefined && settings.enableCategories && (
        <MenuLink onClick={() => handleLinkClick("/categories")}>
          <StyledMenuItem selected={isActive("/categories")} aria-current={isActive("/categories") ? "page" : undefined}>
            <CategoryRounded /> &nbsp; Categories
          </StyledMenuItem>
        </MenuLink>
      )}

      <MenuLink onClick={() => handleLinkClick("/purge")}>
        <StyledMenuItem selected={isActive("/purge")} aria-current={isActive("/purge") ? "page" : undefined}>
          <DeleteForeverRounded /> &nbsp; Purge Tasks
        </StyledMenuItem>
      </MenuLink>

      <MenuLink onClick={() => handleLinkClick("/transfer")}>
        <StyledMenuItem selected={isActive("/transfer")} aria-current={isActive("/transfer") ? "page" : undefined}>
          <GetAppRounded /> &nbsp; Transfer
        </StyledMenuItem>
      </MenuLink>

      <MenuLink onClick={() => handleLinkClick("/sync")}>
        <StyledMenuItem selected={isActive("/sync")} aria-current={isActive("/sync") ? "page" : undefined}>
          <PhonelinkRounded /> &nbsp; Sync Devices
          {user.lastSyncedAt && (
            <Tooltip title={`Last synced ${timeAgo(new Date(user.lastSyncedAt))}`}>
              <MenuLabel>
                <span>
                  <AccessTimeFilledRounded style={{ fontSize: "16px" }} />
                  {shortRelativeTime(new Date(user.lastSyncedAt))}
                </span>
              </MenuLabel>
            </Tooltip>
          )}
        </StyledMenuItem>
      </MenuLink>

      <StyledDivider />

      {supportsPWA && !isAppInstalled && (
        <StyledMenuItem tabIndex={0} onClick={installPWA}>
          {systemInfo.os === "Android" ? (
            <InstallMobileRounded />
          ) : (
            <InstallDesktopRounded className="InstallDesktopRoundedIcon" />
          )}
          &nbsp; Install App
        </StyledMenuItem>
      )}

      {systemInfo.browser === "Safari" &&
        systemInfo.os === "iOS" &&
        !window.matchMedia("(display-mode: standalone)").matches && (
          <StyledMenuItem
            tabIndex={0}
            onClick={() => {
              showToast(
                <div style={{ display: "inline-block" }}>
                  To install the app on iOS Safari, click on{" "}
                  <IosShareRounded sx={{ verticalAlign: "middle", mb: "4px" }} /> and then{" "}
                  <span style={{ fontWeight: "bold" }}>Add to Home Screen</span>.
                </div>,
                { type: "blank", duration: 8000 },
              );
              if(onClose) onClose();
            }}
          >
            <PhoneIphoneRounded />
            &nbsp; Install App
          </StyledMenuItem>
        )}

      <StyledMenuItem
        tabIndex={0}
        onClick={() => {
          if(onClose) onClose();
          openLogout();
        }}
        sx={{ color: "#ff4040 !important" }}
      >
        <Logout className="LogoutIcon" /> &nbsp; Logout
      </StyledMenuItem>

      <ProfileOptionsBottom>
        <SettingsMenuItem
          tabIndex={0}
          onClick={() => {
            if(onClose) onClose();
            openSettings();
          }}
        >
          <SettingsRounded className="SettingsRoundedIcon" /> &nbsp; Settings
        </SettingsMenuItem>

        <StyledDivider />
        <MenuLink onClick={() => handleLinkClick("/user")}>
          <ProfileMenuItem translate={name ? "no" : "yes"} selected={isActive("/user")} aria-current={isActive("/user") ? "page" : undefined}>
            <UserAvatar
              src={avatarSrc || undefined}
              hasimage={profilePicture !== null}
              size="44px"
            >
              {name ? name[0].toUpperCase() : undefined}
            </UserAvatar>
            <h4 style={{ margin: 0, fontWeight: 600 }}> {name || "User"}</h4>
          </ProfileMenuItem>
        </MenuLink>

        <StyledDivider />

        <CreditsContainer translate="no">
          <span style={{ display: "flex", alignItems: "center" }}>
            Made with &nbsp;
            <Favorite sx={{ fontSize: "14px" }} />
          </span>
          <span style={{ marginLeft: "6px", marginRight: "4px" }}>by</span>
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://github.com/CodesRahul96"
          >
            CodesRahul96
          </a>
        </CreditsContainer>

      </ProfileOptionsBottom>
    </>
  );
};

// ... Styled Components (copied from Sidebar.tsx with minimal adjustments)

const MenuLink = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => {
  const styles: React.CSSProperties = { borderRadius: "14px", cursor: "pointer", textDecoration: "none", color: "inherit", display: "block" };
  return (
    <div onClick={onClick} style={styles}>
      {children}
    </div>
  );
};

const StyledDivider = styled(Divider)`
  margin: 8px 4px;
`;

const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => (clr || theme.primary) + "35"};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
  & span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 12px;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 12px;
  border-radius: 14px;
`;

const LogoText = styled.h2`
  & span {
    color: #7764e8;
  }
`;

const ProfileOptionsBottom = styled.div`
  margin-top: auto;
  margin-bottom: ${window.matchMedia("(display-mode: standalone)").matches &&
  /Mobi/.test(navigator.userAgent)
    ? "38px"
    : "16px"};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CreditsContainer = styled.div`
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  & span {
    backdrop-filter: none !important;
  }
`;

const LogoutAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.9) translateX(-2px);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const InstallAppAnimation = keyframes`
   0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(2px);
  }
  70% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 16px 12px;
  border-radius: 14px;
  box-shadow: none;
  font-weight: 500;
  gap: 6px;

  & svg,
  .bmc-icon {
    transition: 0.4s transform;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => (theme.darkmode ? "#fff" : "#000")};
    background: none;
  }

  &:hover {
    & svg.GitHubIcon {
      transform: rotateY(${2 * Math.PI}rad);
    }
    & svg.BugReportRoundedIcon {
      transform: rotate(45deg) scale(1.1) translateY(-10%);
    }

    & svg.InstallDesktopRoundedIcon {
      animation: ${InstallAppAnimation} 0.8s ease-in alternate;
    }

    & svg.LogoutIcon {
      animation: ${LogoutAnimation} 0.5s ease-in alternate;
    }

    & .bmc-icon {
      animation: ${ring} 2.5s ease-in alternate;
    }
  }

  &.Mui-selected {
    background-color: ${({ theme }) => theme.primary}20 !important;
    color: ${({ theme }) => theme.primary} !important;
     & svg {
      color: ${({ theme }) => theme.primary} !important;
    }
  }

  &,
  & svg,
  & .bmc-icon {
    ${({ theme }) => reduceMotion(theme, { transform: "none !important" })}
  }
`;

const SettingsMenuItem = styled(StyledMenuItem)`
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#101727")};
  color: ${ColorPalette.fontLight} !important;
  margin-top: 8px !important;
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#101727b2")};
    & svg.SettingsRoundedIcon {
      transform: rotate(180deg);
    }
  }
  &:focus-visible {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#101727")};
  }
`;

const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#d7d7d7")};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#d7d7d7b2")};
  }
`;
