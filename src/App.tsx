import { useCallback, useContext, useEffect, useMemo } from "react";
import { UserContext } from "./contexts/UserContext";
import { useSystemTheme } from "./hooks/useSystemTheme";
import { Themes, createCustomTheme } from "./theme/createTheme";
import { showToast } from "./utils";
import type { Category, UUID } from "./types/user";
import { isDarkMode } from "./utils/colorUtils";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { DataObjectRounded, DeleteForeverRounded } from "@mui/icons-material";
import { ThemeProvider as MuiThemeProvider, type Theme } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import { CustomToaster } from "./components/Toaster";
import { defaultUser } from "./constants/defaultUser";
import AppRouter from "./router";
import { GlobalStyles } from "./styles";
import { GlobalQuickSaveHandler } from "./components/GlobalQuickSaveHandler";

import { useFirestoreSync } from "./hooks/useFirestoreSync";

function App() {
  const { user, setUser } = useContext(UserContext);
  const systemTheme = useSystemTheme();
  
  useFirestoreSync();

  // Initialize user properties if they are undefined
  // this allows to add new properties to the user object without error
  useEffect(() => {
    // Defer non-critical migration logic to prevent blocking initial render
    const timer = setTimeout(() => {
      setUser((prevUser) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateNestedProperties = (userObject: any, defaultObject: any): any => {
          if (!userObject) return defaultObject;

          Object.keys(defaultObject).forEach((key) => {
            if (key === "categories") return;

            if (
              key === "colorList" &&
              userObject.colorList &&
              !defaultUser.colorList.every((element, index) => element === userObject.colorList[index])
            ) {
              return;
            }

            if (key === "favoriteCategories" && Array.isArray(userObject.favoriteCategories)) {
              userObject.favoriteCategories = userObject.favoriteCategories.filter((id: UUID) =>
                userObject.categories.some((cat: Category) => cat.id === id),
              );
              return;
            }

            if (key === "settings" && Array.isArray(userObject.settings)) {
              delete userObject.settings;
              showToast("Removed old settings array format.", {
                duration: 6000,
                icon: <DeleteForeverRounded />,
                disableVibrate: true,
              });
            }

            const userValue = userObject[key];
            const defaultValue = defaultObject[key];

            if (typeof defaultValue === "object" && defaultValue !== null) {
              userObject[key] = updateNestedProperties(userValue, defaultValue);
            } else if (userValue === undefined) {
              userObject[key] = defaultValue;
              showToast(
                <div>
                  Added new property to user object{" "}
                  <i translate="no">
                    {key.toString()}: {userObject[key].toString()}
                  </i>
                </div>,
                {
                  duration: 6000,
                  icon: <DataObjectRounded />,
                  disableVibrate: true,
                },
              );
            }
          });

          return userObject;
        };

        const updatedUser = updateNestedProperties({ ...prevUser }, defaultUser);
        return updatedUser;
      });
    }, 1000); // Defer by 1s to allow UI to settle

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const setBadge = async (count: number) => {
      if ("setAppBadge" in navigator) {
        try {
          await navigator.setAppBadge(count);
        } catch (error) {
          console.error("Failed to set app badge:", error);
        }
      }
    };

    const clearBadge = async () => {
      if ("clearAppBadge" in navigator) {
        try {
          await navigator.clearAppBadge();
        } catch (error) {
          console.error("Failed to clear app badge:", error);
        }
      }
    };

    const displayAppBadge = async () => {
      if (user.settings.appBadge) {
        if ((await Notification.requestPermission()) === "granted") {
          const incompleteTasksCount = user.tasks.filter((task) => !task.done).length;
          if (!isNaN(incompleteTasksCount)) {
            setBadge(incompleteTasksCount);
          }
        }
      } else {
        clearBadge();
      }
    };

    if ("setAppBadge" in navigator) {
      displayAppBadge();
    }
  }, [user.settings.appBadge, user.tasks]);

  const getMuiTheme = useCallback((): Theme => {
    if (systemTheme === "unknown") {
      return Themes[0].MuiTheme;
    }
    if (user.theme === "system") {
      // Themes[0] is Light (Modern Blue), Themes[1] is Dark (Midnight Slate)
      return systemTheme === "dark" ? Themes[1].MuiTheme : Themes[0].MuiTheme;
    }
    const selectedTheme = Themes.find((theme) => theme.name === user.theme);
    return selectedTheme ? selectedTheme.MuiTheme : Themes[0].MuiTheme;
  }, [systemTheme, user.theme]);

  const activeMuiTheme = useMemo(() => {
    const baseMuiTheme = getMuiTheme();
    const isDark = isDarkMode(user.darkmode, systemTheme, baseMuiTheme.palette.secondary.main);

    // If the mode matches the base theme, return it directly to avoid unnecessary re-renders
    if (baseMuiTheme.palette.mode === (isDark ? "dark" : "light")) {
      return baseMuiTheme;
    }

    // Otherwise, create a new theme with the overridden mode
    return createCustomTheme(
      baseMuiTheme.palette.primary.main,
      baseMuiTheme.palette.secondary.main,
      isDark ? "dark" : "light",
    );
  }, [getMuiTheme, user.darkmode, systemTheme]);

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", activeMuiTheme.palette.secondary.main);
    }
  }, [activeMuiTheme]);

  return (
    <MuiThemeProvider theme={activeMuiTheme}>
      <EmotionThemeProvider
        theme={{
          primary: activeMuiTheme.palette.primary.main,
          secondary: activeMuiTheme.palette.secondary.main,
          darkmode: activeMuiTheme.palette.mode === "dark",
          mui: activeMuiTheme,
          text: {
            primary: activeMuiTheme.palette.text.primary,
            secondary: activeMuiTheme.palette.text.secondary,
          },
          reduceMotion: user.settings.reduceMotion || "system",
        }}
      >
        <GlobalStyles />
        <CustomToaster />
        <ErrorBoundary>
          <MainLayout>
            <GlobalQuickSaveHandler>
              <AppRouter />
            </GlobalQuickSaveHandler>
          </MainLayout>
        </ErrorBoundary>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
