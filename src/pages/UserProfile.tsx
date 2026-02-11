import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  AddAPhotoRounded,
  CloudDoneRounded,
  CloudOffRounded,
  Delete,
  GitHub,
  Google,
  LinkRounded,
  Logout,
  SaveRounded,
  Settings,
  TodayRounded,
  UploadRounded,
} from "@mui/icons-material";
import { PFP_MAX_SIZE, PROFILE_PICTURE_MAX_LENGTH, USER_NAME_MAX_LENGTH } from "../constants";
import { CustomDialogTitle, LogoutDialog, TopBar } from "../components";
import { DialogBtn, GlassCard, UserAvatar, VisuallyHiddenInput } from "../styles";
import { UserContext } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { timeAgo, showToast } from "../utils";
import {
  initDB,
  saveProfilePictureInDB,
  deleteProfilePictureFromDB,
  validateImageFile,
  fileToBase64,
  getProfilePictureFromDB,
  optimizeProfilePicture,
  ALLOWED_PFP_TYPES,
} from "../utils/profilePictureStorage";
import { ColorPalette } from "../theme/themeConfig";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { user: firebaseUser, signInWithGoogle, signInWithGithub } = useAuth();
  const { name, profilePicture, createdAt } = user;
  const [userName, setUserName] = useState<string>("");
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");
  const [openChangeImage, setOpenChangeImage] = useState<boolean>(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [showBrokenPfpAlert, setShowBrokenPfpAlert] = useState(false);

  useEffect(() => {
    document.title = `Todo App - User ${name ? `(${name})` : ""}`;
  }, [name]);

  useEffect(() => {
    const loadAvatar = async () => {
      const src = await getProfilePictureFromDB(profilePicture);
      setAvatarSrc(src);
    };

    loadAvatar();
  }, [profilePicture]);

  useEffect(() => {
    setShowBrokenPfpAlert(false);

    const timer = setTimeout(() => {
      setShowBrokenPfpAlert(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [avatarSrc, profilePicture]);

  useEffect(() => {
    initDB().catch((error) => {
      console.error("Error initializing IndexedDB:", error);
    });
  }, []);

  const handleSaveName = () => {
    if (userName.length <= USER_NAME_MAX_LENGTH && userName !== name) {
      setUser({ ...user, name: userName });
      showToast("Updated user name");
      setUserName("");
    }
  };

  const handleOpenImageDialog = () => {
    setOpenChangeImage(true);
  };
  const handleCloseImageDialog = () => {
    setOpenChangeImage(false);
    setProfilePictureURL("");
  };

  const handleSaveImageLink = () => {
    if (
      profilePictureURL.length <= PROFILE_PICTURE_MAX_LENGTH &&
      profilePictureURL.startsWith("https://")
    ) {
      if (user.profilePicture && user.profilePicture.startsWith("LOCAL_FILE_")) {
        handleDeleteImage(() => {
          setUser((prevUser) => ({
            ...prevUser,
            profilePicture: profilePictureURL,
          }));
          setProfilePictureURL("");
          handleCloseImageDialog();
          showToast("Profile picture updated with link.");
        });
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: profilePictureURL,
        }));
        setProfilePictureURL("");
        handleCloseImageDialog();
        showToast("Profile picture updated with link.");
      }
    } else {
      showToast("Invalid profile picture URL.", { type: "error" });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      showToast(error, { type: "error" });
      return;
    }

    try {
      const originalSize = file.size;
      const croppedBlob = await optimizeProfilePicture(file);
      const croppedFile = new File([croppedBlob], file.name, { type: croppedBlob.type });

      const base64 = await fileToBase64(croppedFile);
      const newId = await saveProfilePictureInDB(base64);

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: newId,
      }));

      handleCloseImageDialog();

      const formatBytes = (bytes: number): string => {
        const units = ["byte", "kilobyte", "megabyte"] as const;
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / 1024 ** i;

        return new Intl.NumberFormat(navigator.language, {
          style: "unit",
          unit: units[i],
          maximumFractionDigits: 1,
        }).format(value);
      };

      const base64Size = new TextEncoder().encode(base64).length;
      const compressionPercent = Number(((1 - base64Size / originalSize) * 100).toFixed(1));

      showToast(
        compressionPercent > 10 ? (
          <>
            <strong>Profile picture uploaded.</strong>
            <br />
            Compressed from <b style={{ whiteSpace: "nowrap" }}>
              {formatBytes(originalSize)}
            </b> to <b style={{ whiteSpace: "nowrap" }}>{formatBytes(base64Size)}</b> (
            {compressionPercent}% smaller)
          </>
        ) : (
          "Profile picture uploaded."
        ),
        { duration: 7000 },
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Failed to upload profile picture.", { type: "error" });
    }
  };

  const handleDeleteImage = async (callback?: () => void) => {
    try {
      await deleteProfilePictureFromDB();
      setUser((prevUser) => ({ ...prevUser, profilePicture: null }));
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      showToast("Failed to delete profile picture.", { type: "error" });
    } finally {
      callback?.();
    }
  };

  return (
    <>
      <TopBar title="User Profile" />
      <ProfileWrapper>
        <UserProfileCard glow={user.settings.enableGlow}>
          <Tooltip title="App Settings">
            <IconButton
              onClick={() => (window.location.hash = "#settings")}
              aria-label="Settings"
              size="large"
              sx={{
                position: "absolute",
                top: "24px",
                right: "24px",
              }}
            >
              <Settings fontSize="large" />
            </IconButton>
          </Tooltip>
          
          <UserHeader>
            <Tooltip title={profilePicture ? "Change profile picture" : "Add profile picture"}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Avatar
                    onClick={handleOpenImageDialog}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenImageDialog();
                      }
                    }}
                    sx={{
                      background: "#9c9c9c81",
                      backdropFilter: "blur(10px)",
                      cursor: "pointer",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AddAPhotoRounded sx={{ fontSize: 18 }} />
                  </Avatar>
                }
              >
                <UserAvatar
                  onClick={handleOpenImageDialog}
                  src={avatarSrc || undefined}
                  hasimage={profilePicture !== null}
                  style={{ cursor: "pointer" }}
                  size="100px"
                >
                  {name ? name[0].toUpperCase() : undefined}
                </UserAvatar>
              </Badge>
            </Tooltip>
            {showBrokenPfpAlert &&
              (!avatarSrc || !avatarSrc.startsWith("data:")) &&
              profilePicture?.startsWith("LOCAL_FILE") && (
                <BrokenPfpAlert severity="warning" variant="outlined">
                  Profile picture might be broken. You can try removing it.
                </BrokenPfpAlert>
              )}
            <UserName translate={name ? "no" : "yes"}>{name || "User"}</UserName>
            <Tooltip
              title={new Intl.DateTimeFormat(navigator.language, {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(new Date(createdAt))}
            >
              <CreatedAtDate>
                <TodayRounded fontSize="small" />
                &nbsp;Registered {timeAgo(createdAt)}
              </CreatedAtDate>
            </Tooltip>
          </UserHeader>

          <Section>
            <TextField
              fullWidth
              label={name === null ? "Add Name" : "Change Name"}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              error={userName.length > USER_NAME_MAX_LENGTH || (userName === name && name !== "")}
              helperText={
                userName.length > USER_NAME_MAX_LENGTH
                  ? `Name exceeds ${USER_NAME_MAX_LENGTH} characters`
                  : userName.length > 0 && userName !== name
                    ? `${userName.length}/${USER_NAME_MAX_LENGTH}`
                    : userName === name && name !== ""
                      ? "New username matches old one."
                      : ""
              }
              autoComplete="given-name"
              sx={{ mb: 2 }}
            />

            <SaveBtn
              fullWidth
              onClick={handleSaveName}
              disabled={userName.length > USER_NAME_MAX_LENGTH || userName === name}
              variant="contained"
            >
              Save name
            </SaveBtn>
          </Section>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, textAlign: "center" }}>
              Account & Sync
            </Typography>

            {firebaseUser ? (
              <AccountInfo>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {firebaseUser.providerData[0]?.providerId === "google.com" ? (
                    <Google color="primary" />
                  ) : firebaseUser.providerData[0]?.providerId === "github.com" ? (
                    <GitHub />
                  ) : (
                    <TodayRounded />
                  )}
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {firebaseUser.email}
                  </Typography>
                </div>
                <SyncStatus authenticated={true}>
                  <CloudDoneRounded fontSize="small" />
                  Cloud Sync Active
                </SyncStatus>
              </AccountInfo>
            ) : (
              <AccountInfo>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, textAlign: "center", lineHeight: 1.6 }}>
                  Sign in to sync your tasks across devices and back them up to the cloud.
                </Typography>
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => signInWithGoogle()}
                    startIcon={<Google />}
                    sx={{ borderRadius: "14px", textTransform: "none", fontWeight: 600, py: 1.2 }}
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => signInWithGithub()}
                    startIcon={<GitHub />}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                      bgcolor: "#24292e",
                      "&:hover": { bgcolor: "#2f363d" },
                    }}
                  >
                    Sign in with GitHub
                  </Button>
                </ButtonGroup>
                <SyncStatus authenticated={false}>
                  <CloudOffRounded fontSize="small" />
                  Local Storage Only
                </SyncStatus>
              </AccountInfo>
            )}
          </Section>

          <Button
            color="error"
            variant="outlined"
            fullWidth
            sx={{ p: "12px 20px", borderRadius: "16px", mt: 1, fontWeight: 600 }}
            onClick={() => setOpenLogoutDialog(true)}
          >
            <Logout sx={{ mr: 1 }} />
            Logout
          </Button>
        </UserProfileCard>
      </ProfileWrapper>

      <Dialog open={openChangeImage} onClose={handleCloseImageDialog} fullWidth maxWidth="xs">
        <CustomDialogTitle
          title="Profile Picture"
          subTitle="Change or delete profile picture"
          onClose={handleCloseImageDialog}
          icon={<AddAPhotoRounded />}
        />
        <DialogContent>
          <TextField
            label="Link to profile picture"
            placeholder="Enter link to profile picture..."
            sx={{ my: "12px", width: "100%" }}
            value={profilePictureURL}
            onChange={(e) => {
              setProfilePictureURL(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSaveImageLink()}
            error={profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH}
            helperText={
              profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH
                ? `URL is too long maximum ${PROFILE_PICTURE_MAX_LENGTH} characters`
                : ""
            }
            autoComplete="url"
            type="url"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkRounded />
                  </InputAdornment>
                ),
              },
            }}
          />

          <StyledDivider>
            <span style={{ opacity: 0.8 }}>or</span>
          </StyledDivider>

          <Button
            component="label"
            variant="contained"
            role={undefined}
            tabIndex={-1}
            fullWidth
            sx={{ my: "12px", borderRadius: "12px", py: 1.2 }}
          >
            <UploadRounded /> &nbsp; Upload from file
            <VisuallyHiddenInput accept="image/*" type="file" onChange={handleFileUpload} />
          </Button>

          <Typography sx={{ opacity: 0.6, textAlign: "center", fontSize: "14px" }}>
            {ALLOWED_PFP_TYPES.map((type) => type.replace("image/", "").toUpperCase()).join(", ")}{" "}
            under{" "}
            {new Intl.NumberFormat("en-US", {
              style: "unit",
              unit: "megabyte",
              maximumFractionDigits: 2,
            }).format(PFP_MAX_SIZE / (1024 * 1024))}
          </Typography>

          {profilePicture !== null && (
            <>
              <Divider sx={{ my: "16px" }} />
              <Button
                fullWidth
                onClick={() => {
                  handleDeleteImage(() => {
                    setUser((prevUser) => ({ ...prevUser, profilePicture: null }));
                    handleCloseImageDialog();
                    showToast("Profile picture removed.");
                  });
                }}
                color="error"
                variant="outlined"
                sx={{ borderRadius: "12px" }}
              >
                <Delete sx={{ mr: 1 }} /> Remove Profile Picture
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <DialogBtn onClick={handleCloseImageDialog}>Cancel</DialogBtn>
          <DialogBtn
            disabled={
              profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH ||
              !profilePictureURL.startsWith("https://")
            }
            onClick={handleSaveImageLink}
            variant="contained"
          >
            <SaveRounded sx={{ mr: 1 }} /> Save
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <LogoutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} />
    </>
  );
};

export default UserProfile;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
  width: 100%;

  @media (max-width: 600px) {
    padding: 24px 12px;
  }
`;

const UserProfileCard = styled(GlassCard, {
  shouldForwardProp: (prop) => prop !== "glow",
})<{ glow: boolean }>`
  max-width: 500px;
  align-items: center;
  position: relative;
  box-shadow: ${({ glow, theme }) => (glow ? `0 0 72px -16px ${theme.primary}bf` : "none")};
  border: 1px solid ${({ theme }) => theme.primary}40;
  
  @media (max-width: 1024px) {
    max-width: 450px;
  }
`;

const UserHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const SaveBtn = styled(Button)`
  font-weight: 600;
  padding: 12px;
  border-radius: 16px;
  text-transform: capitalize;
  font-size: 16px;
  box-shadow: none;
`;

const UserName = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

const CreatedAtDate = styled.span`
  display: flex;
  align-items: center;
  font-style: italic;
  font-weight: 400;
  opacity: 0.7;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.primary};
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
  &::before,
  &::after {
    border-color: ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)")};
  }
`;

const BrokenPfpAlert = styled(Alert)`
  margin-top: 8px;
  max-width: 100%;
  font-size: 0.75rem;
  border-radius: 12px;
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px 20px;
  background: ${({ theme }) => theme.darkmode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.darkmode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
`;

const SyncStatus = styled("div", {
  shouldForwardProp: (prop) => prop !== "authenticated",
})<{ authenticated: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ authenticated, theme }) => (authenticated ? theme.primary : ColorPalette.red)};
  letter-spacing: 0.2px;
`;
