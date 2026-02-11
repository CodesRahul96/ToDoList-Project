import { Navigate, View, Views, ToolbarProps } from "react-big-calendar";
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography, useTheme, Tooltip } from "@mui/material";
import { ArrowBackIosNewRounded, ArrowForwardIosRounded, TodayRounded, GridViewRounded, ViewDayRounded, CalendarViewWeekRounded, ViewListRounded } from "@mui/icons-material";
import { CalendarEvent } from "../../types/calendar";

export const CalendarToolbar = ({ view, label, onNavigate, onView }: ToolbarProps<CalendarEvent, object>) => {
  const theme = useTheme();

  const goToBack = () => {
    onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    onNavigate(Navigate.NEXT);
  };

  const goToToday = () => {
    onNavigate(Navigate.TODAY);
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: View | null) => {
    if (newView) {
      onView(newView);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        gap: 2,
        p: 2,
        borderRadius: "24px",
        background: theme.palette.mode === "dark" 
          ? "rgba(35, 46, 88, 0.5)" // Matches custom theme background with opacity
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Previous">
          <IconButton onClick={goToBack} size="small" sx={{ 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: "12px",
              color: theme.palette.text.primary 
          }}>
            <ArrowBackIosNewRounded fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Today">
            <IconButton onClick={goToToday} size="small" sx={{ 
                border: `1px solid ${theme.palette.divider}`, 
                borderRadius: "12px",
                color: theme.palette.text.primary
            }}>
                <TodayRounded fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title="Next">
          <IconButton onClick={goToNext} size="small" sx={{ 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: "12px",
              color: theme.palette.text.primary
          }}>
            <ArrowForwardIosRounded fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Typography 
            variant="h5" 
            sx={{ 
                ml: 2, 
                fontWeight: 700, 
                textTransform: "capitalize",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", 
                // Fallback for contrast
                color: theme.palette.primary.main
            }}
        >
          {label}
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="calendar view"
        sx={{
            "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "12px !important",
                mx: 0.5,
                px: 2,
                py: 0.5,
                textTransform: "capitalize",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                "&.Mui-selected": {
                    backgroundColor: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                    "&:hover": {
                         backgroundColor: `${theme.palette.primary.main}30`,
                    }
                },
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                }
            }
        }}
      >
        <ToggleButton value={Views.MONTH} aria-label="month view">
          <GridViewRounded fontSize="small" sx={{ mr: 1 }} />
          Month
        </ToggleButton>
        <ToggleButton value={Views.WEEK} aria-label="week view">
          <CalendarViewWeekRounded fontSize="small" sx={{ mr: 1 }} />
          Week
        </ToggleButton>
        <ToggleButton value={Views.DAY} aria-label="day view">
          <ViewDayRounded fontSize="small" sx={{ mr: 1 }} />
          Day
        </ToggleButton>
         <ToggleButton value={Views.AGENDA} aria-label="agenda view">
          <ViewListRounded fontSize="small" sx={{ mr: 1 }} />
          List
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
