import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import withDragAndDrop, { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useUser } from "../contexts/UserContext";
import { Box, useTheme, styled } from "@mui/material";
import { TopBar } from "../components";
import { CalendarToolbar } from "../components/calendar/CalendarToolbar";
import { CalendarSidebar } from "../components/calendar/CalendarSidebar";
import { CalendarEvent } from "../types/calendar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Explicitly type the DnD HOC
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

// Styled wrapper to override RBC default styles
const CalendarWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "& .rbc-calendar": {
    fontFamily: "Poppins, sans-serif",
    color: theme.palette.text.primary,
  },
  // Hide default toolbar since we use custom one
  "& .rbc-toolbar": {
    display: "none", 
  },
  "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view": {
    border: "none",
    borderRadius: "24px",
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#fff",
    backdropFilter: "blur(12px)",
    boxShadow: theme.shadows[1],
    overflow: "hidden",
  },
  "& .rbc-header": {
    padding: "16px 0",
    fontWeight: 700,
    fontSize: "13px",
    borderBottom: `1px dashed ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  "& .rbc-date-cell": {
    padding: "12px",
    fontWeight: 600,
    fontSize: "14px",
    "& a": {
       color: theme.palette.text.secondary,
       textDecoration: "none",
       transition: "color 0.2s",
       "&:hover": {
           color: theme.palette.primary.main,
       }
    }
  },
  "& .rbc-day-bg": {
    borderLeft: `1px dashed ${theme.palette.divider}`,
  },
  "& .rbc-off-range-bg": {
    backgroundColor: "transparent",
    opacity: 0.3,
  },
  "& .rbc-event": {
    borderRadius: "8px",
    border: "none",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 10,
    }
  },
  "& .rbc-today": {
    backgroundColor: theme.palette.mode === "dark" 
      ? `${theme.palette.primary.main}08` 
      : `${theme.palette.primary.main}05`,
  },
  "& .rbc-time-content": {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "& .rbc-time-header-content": {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  "& .rbc-timeslot-group": {
    borderBottom: `1px dashed ${theme.palette.divider}`,
  },
  "& .rbc-day-slot .rbc-time-slot": {
    borderTop: `1px dashed ${theme.palette.divider}`,
  },
  // Hide scrollbars for cleaner query
  "& ::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
  },
  "& ::-webkit-scrollbar-track": {
      background: "transparent",
  },
  "& ::-webkit-scrollbar-thumb": {
      background: theme.palette.divider,
      borderRadius: "4px",
  },
}));

const CalendarView = () => {
  const { user, setUser } = useUser();
  const theme = useTheme();
  const n = useNavigate();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    const taskEvents: CalendarEvent[] = [];
    user.tasks.forEach((task) => {
      // Add main task deadline if exists
      if (task.deadline) {
        const startDate = new Date(task.deadline);
        // Ensure valid date
        if (!isNaN(startDate.getTime())) {
             taskEvents.push({
              id: `${task.id}-deadline`,
              title: task.name,
              start: startDate,
              end: new Date(startDate.getTime() + 60 * 60 * 1000), // Default 1 hour
              allDay: false,
              resource: task,
              type: "deadline",
            });
        }
      }

      // Add time blocks
      if (task.timeBlocks) {
        task.timeBlocks.forEach((block, index) => {
          const startDate = new Date(block.start);
          const endDate = new Date(block.end);
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              taskEvents.push({
                id: `${task.id}-block-${index}`,
                title: block.label || task.name,
                start: startDate,
                end: endDate,
                allDay: false,
                resource: task,
                type: "block",
                blockIndex: index,
              });
          }
        });
      }
    });
    console.log("DEBUG: All Tasks:", user.tasks);
    console.log("DEBUG: Generated Calendar Events:", taskEvents);
    return taskEvents;
  }, [user.tasks]);

  const handleEventClick = (event: CalendarEvent) => {
    if (event.resource) {
      console.log("Clicked task:", event.resource.name);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEventDrop: withDragAndDropProps['onEventDrop'] = useCallback(
    ({ event, start, end }: any) => {
      const calEvent = event as CalendarEvent;
      const task = calEvent.resource;
      if (!task) return;

      setUser((prevUser) => {
        const updatedTasks = prevUser.tasks.map((t) => {
          if (t.id !== task.id) return t;

          if (calEvent.type === "deadline") {
            return { ...t, deadline: start as Date };
          } else if (calEvent.type === "block" && t.timeBlocks && typeof calEvent.blockIndex === 'number') {
             const newBlocks = [...t.timeBlocks];
             // Ensure we have valid dates
             newBlocks[calEvent.blockIndex] = {
                 ...newBlocks[calEvent.blockIndex],
                 start: start as Date,
                 end: end as Date,
             };
             return { ...t, timeBlocks: newBlocks };
          }
          return t;
        });
        return { ...prevUser, tasks: updatedTasks };
      });
    },
    [setUser]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEventResize: withDragAndDropProps['onEventResize'] = useCallback(
    ({ event, start, end }: any) => {
      const calEvent = event as CalendarEvent;
      const task = calEvent.resource;
      if (!task) return;

       setUser((prevUser) => {
        const updatedTasks = prevUser.tasks.map((t) => {
          if (t.id !== task.id) return t;

          if (calEvent.type === "block" && t.timeBlocks && typeof calEvent.blockIndex === 'number') {
            const newBlocks = [...t.timeBlocks];
            newBlocks[calEvent.blockIndex] = {
                ...newBlocks[calEvent.blockIndex],
                start: start as Date,
                end: end as Date,
            };
            return { ...t, timeBlocks: newBlocks };
          }
           // Deadlines (default 1h) usually not resizable in this model unless we add 'duration' to task
          return t;
        });
        return { ...prevUser, tasks: updatedTasks };
      });
    },
    [setUser]
  );

  const components = useMemo(() => ({
    toolbar: (props: any) => <CalendarToolbar {...props} />,
  }), []);

  // We will use a ref to store the dragged task from the sidebar.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draggedTaskRef = useRef<any>(null);


  // We need to pass this handler down to DraggableTask through context or refined props, 
  // BUT DraggableTask is in Sidebar. 
  // Let's wrapping the sidebar task drag start.
  
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <TopBar title="Calendar" />
      <Box sx={{ flex: 1, display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
        {/* Sidebar */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
             <CalendarSidebar 
                tasks={user.tasks} 
                onAddTask={() => n("/add")}
                onDragStart={(task) => { draggedTaskRef.current = task; }}
             />
        </Box>

        {/* Calendar Area */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
            <CalendarWrapper>
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "calc(100vh - 120px)" }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                onSelectEvent={handleEventClick}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                selectable
                components={components}
                onDropFromOutside={({ start }) => {
                    const task = draggedTaskRef.current;
                    if (task) {
                        setUser((prevUser) => {
                            const updatedTasks = prevUser.tasks.map((t) => {
                                if (t.id === task.id) {
                                    return {
                                        ...t,
                                        deadline: new Date(start),
                                        // If dropped on "allDay" slot or Month view, maybe set specific time? 
                                        // keeping it simple for now.
                                    };
                                }
                                return t;
                            });
                            return { ...prevUser, tasks: updatedTasks };
                        });
                        draggedTaskRef.current = null; // Reset
                    }
                }}
                eventPropGetter={(event) => ({
                style: {
                    backgroundColor: event.resource?.color || theme.palette.primary.main,
                    color: "#fff",
                },
                })}
            />
            </CalendarWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarView;
