import { Category, Task, Priority, Subtask } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, GlassCard, StyledInput } from "../styles";
import { AddTaskRounded, AddRounded, CloseRounded } from "@mui/icons-material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { Box, Stack, Typography, IconButton, Button } from "@mui/material";
import { ColorPicker, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useTheme } from "@emotion/react";
import { generateUUID, showToast } from "../utils";
import InputThemeProvider from "../contexts/InputThemeProvider";
import { CategorySelect } from "../components/CategorySelect";
import { useToasterStore } from "react-hot-toast";
import styled from "@emotion/styled";

const AddTaskContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  animation: fadeIn 0.5s ease-out;

  @media (max-width: 600px) {
    padding: 24px 12px;
  }
`;

const AddTask = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useStorageState<string>("", "name", "sessionStorage");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "emoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(theme.primary, "color", "sessionStorage");
  const [description, setDescription] = useStorageState<string>(
    "",
    "description",
    "sessionStorage",
  );
  const [deadline, setDeadline] = useStorageState<string>("", "deadline", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage",
  );

  const [isDeadlineFocused, setIsDeadlineFocused] = useState<boolean>(false);

  const n = useNavigate();
  const { toasts } = useToasterStore();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  useEffect(() => {
    if (name.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  }, [description.length, name.length]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  /* Time Blocks State */
  const [timeBlocks, setTimeBlocks] = useState<{ start: string; end: string; label: string }[]>([]);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockLabel, setBlockLabel] = useState("");

  /* Subtasks State */
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskName, setSubtaskName] = useState("");

  /* Priority State */
  const [priority, setPriority] = useState<Priority>("medium");

  const handleAddSubtask = () => {
    if (!subtaskName.trim()) return;
    const newSubtask: Subtask = {
        id: generateUUID(),
        name: subtaskName,
        done: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setSubtaskName("");
  };

  const handleRemoveSubtask = (id: string) => { // id is UUID which is alias for string
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleAddTimeBlock = () => {
    if (!blockStart || !blockEnd) return;
    if (new Date(blockStart) >= new Date(blockEnd)) {
        showToast("Start time must be before end time", { type: "error" });
        return;
    }
    setTimeBlocks([...timeBlocks, { start: blockStart, end: blockEnd, label: blockLabel }]);
    setBlockStart("");
    setBlockEnd("");
    setBlockLabel("");
  };

  const handleRemoveTimeBlock = (index: number) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  const handleAddTask = () => {
    if (name === "") {
      showToast("Task name is required.", {
        type: "error",
        id: "task-name-required",
        preventDuplicate: true,
        visibleToasts: toasts,
      });
      return;
    }

    if (nameError !== "" || descriptionError !== "") {
      return; // Do not add the task if the name or description exceeds the maximum length
    }

    const newTask: Task = {
      id: generateUUID(),
      done: false,
      pinned: false,
      name,
      description: description !== "" ? description : undefined,
      emoji: emoji ? emoji : undefined,
      color,
      date: new Date(),
      deadline: deadline !== "" ? new Date(deadline) : undefined,
      category: selectedCategories ? selectedCategories : [],
      timeBlocks: timeBlocks.map(b => ({
        start: new Date(b.start),
        end: new Date(b.end),
        label: b.label || undefined
      })),
      priority,
      subtasks,
    };

    setUser((prevUser) => ({
      ...prevUser,
      tasks: [...prevUser.tasks, newTask],
    }));

    n("/");

    showToast(
      <div>
        Added task - <b>{newTask.name}</b>
      </div>,
      {
        icon: <AddTaskRounded />,
      },
    );

    const itemsToRemove = ["name", "color", "description", "emoji", "deadline", "categories"];
    itemsToRemove.map((item) => sessionStorage.removeItem(item));
    setTimeBlocks([]);
    setSubtasks([]);
  };

  return (
    <>
      <TopBar title="New Task" />
      <AddTaskContainer>
        <GlassCard sx={{ p: { xs: 3, md: 4 }, maxWidth: "800px", mx: "auto" }}>
            <Box mb={4} display="flex" justifyContent="center">
                 <CustomEmojiPicker
                    emoji={emoji}
                    onEmojiChange={setEmoji}
                    name={name}
                    type="task"
                    color={color}
                  />
            </Box>

            <InputThemeProvider>
                <Stack spacing={3}>
                    {/* Main Info */}
                    <Box>
                        <StyledInput
                          label="Task Name"
                          placeholder="What needs to be done?"
                          value={name}
                          onChange={handleNameChange}
                          required
                          error={nameError !== ""}
                          helperText={nameError || `${name.length}/${TASK_NAME_MAX_LENGTH}`}
                          fullWidth
                          sx={{ mb: 3, m: 0, "& .MuiOutlinedInput-root": { width: "100%" } }}
                        />
                        <StyledInput
                          label="Description"
                          placeholder="Add some details..."
                          value={description}
                          onChange={handleDescriptionChange}
                          multiline
                          rows={4}
                          error={descriptionError !== ""}
                          helperText={descriptionError || `${description.length}/${DESCRIPTION_MAX_LENGTH}`}
                          fullWidth
                          sx={{ m: 0, "& .MuiOutlinedInput-root": { width: "100%" } }}
                        />
                    </Box>

                    {/* Metadata Row 1: Deadline & Priority */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <Box flex={1}>
                            <StyledInput
                               label="Deadline"
                               type="datetime-local"
                               value={deadline}
                               onChange={handleDeadlineChange}
                               onFocus={() => setIsDeadlineFocused(true)}
                               onBlur={() => setIsDeadlineFocused(false)}
                               hidetext={(!deadline || deadline === "") && !isDeadlineFocused}
                               sx={{ 
                                   colorScheme: theme.darkmode ? "dark" : "light", 
                                   m: 0, 
                                   "& .MuiOutlinedInput-root": { width: "100%" } 
                               }}
                               fullWidth
                               size="small"
                             />
                        </Box>
                        <Box flex={1}>
                             <Typography variant="caption" fontWeight={600} color="text.secondary" mb={1} display="block">
                                Priority
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {(["low", "medium", "high"] as Priority[]).map((p) => (
                                    <Button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        variant={priority === p ? "contained" : "outlined"}
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            textTransform: "capitalize",
                                            bgcolor: priority === p ? theme.primary : "transparent",
                                            borderColor: priority === p ? theme.primary : theme.darkmode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
                                            color: priority === p ? "#fff" : "text.primary",
                                            boxShadow: "none",
                                            "&:hover": {
                                                bgcolor: priority === p ? theme.primary : "rgba(0,0,0,0.05)",
                                                boxShadow: "none"
                                            }
                                        }}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>

                     {/* Metadata Row 2: Category & Color */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        {user.settings.enableCategories && (
                           <Box flex={1}>
                              <Typography variant="caption" fontWeight={600} color="text.secondary" mb={1} display="block">
                                Category
                            </Typography>
                              <CategorySelect
                                selectedCategories={selectedCategories}
                                onCategoryChange={setSelectedCategories}
                                width="100%"
                                fontColor={theme.text.primary}
                              />
                           </Box>
                        )}
                        <Box flex={1}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" mb={1} display="block">
                                Theme Color
                            </Typography>
                            <ColorPicker
                                color={color}
                                width="100%"
                                onColorChange={setColor}
                                fontColor={theme.text.primary}
                            />
                        </Box>
                    </Stack>
                    
                    {/* Divider */}
                    <Box sx={{ height: "1px", bgcolor: theme.darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", my: 2 }} />

                    {/* Subtasks */}
                    <Box>
                         <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={1}>
                             Subtasks
                         </Typography>
                         <Stack spacing={1} mb={2}>
                              {subtasks.map((subtask) => (
                                  <Box key={subtask.id} sx={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      justifyContent: "space-between", 
                                      p: 1.5, 
                                      bgcolor: theme.darkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", 
                                      borderRadius: "12px",
                                      border: `1px solid ${theme.darkmode ? "rgba(255,255,255,0.05)" : "transparent"}`
                                  }}>
                                      <Typography variant="body2">{subtask.name}</Typography>
                                      <IconButton onClick={() => handleRemoveSubtask(subtask.id)} size="small" color="error">
                                         <CloseRounded fontSize="small" />
                                      </IconButton>
                                  </Box>
                              ))}
                          </Stack>
                          <Stack direction="row" spacing={1}>
                              <StyledInput 
                                 placeholder="Add a subtask..."
                                 value={subtaskName}
                                 onChange={(e) => setSubtaskName(e.target.value)}
                                 size="small"
                                 fullWidth
                                 onKeyDown={(e) => { if(e.key === 'Enter') handleAddSubtask() }}
                                 sx={{ m: 0, "& .MuiOutlinedInput-root": { width: "100%" } }}
                              />
                              <IconButton onClick={handleAddSubtask} sx={{ bgcolor: theme.primary, color: "white", borderRadius: "12px", "&:hover": { bgcolor: theme.primary } }}>
                                 <AddRounded />
                              </IconButton>
                          </Stack>
                    </Box>

                    {/* Time Blocking */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={1}>
                             Time Blocking
                         </Typography>
                         <Stack spacing={1.5} mb={2}>
                            {timeBlocks.map((block, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        p: 1.5,
                                        borderRadius: "12px",
                                        bgcolor: theme.darkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                        border: `1px solid ${theme.darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" fontWeight={700} color={theme.text.primary}>
                                            {block.label || "Time Block"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                                            {new Date(block.start).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={() => handleRemoveTimeBlock(index)} size="small" color="error">
                                        <CloseRounded fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>

                         <Box sx={{ p: 1.5, border: `1px dashed ${theme.primary}60`, borderRadius: "12px", bgcolor: `${theme.primary}05` }}>
                              <Stack spacing={2}>
                                <StyledInput 
                                    label="Label"
                                    placeholder="e.g. Focus"
                                    value={blockLabel}
                                    onChange={(e) => setBlockLabel(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{ m: 0, "& .MuiOutlinedInput-root": { width: "100%" } }}
                                />
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <StyledInput 
                                        type="datetime-local"
                                        label="Start"
                                        value={blockStart}
                                        onChange={(e) => setBlockStart(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        sx={{ flex: 1, m: 0, colorScheme: theme.darkmode ? "dark" : "light", "& .MuiOutlinedInput-root": { width: "100%" } }}
                                        size="small"
                                    />
                                    <StyledInput 
                                        type="datetime-local"
                                        label="End"
                                        value={blockEnd}
                                        onChange={(e) => setBlockEnd(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        sx={{ flex: 1, m: 0, colorScheme: theme.darkmode ? "dark" : "light", "& .MuiOutlinedInput-root": { width: "100%" } }}
                                        size="small"
                                    />
                                </Stack>
                                <Button 
                                    onClick={handleAddTimeBlock}
                                    variant="text"
                                    disabled={!blockStart || !blockEnd}
                                    fullWidth
                                    sx={{ fontWeight: 700, color: theme.primary }}
                                >
                                    + Add Block
                                </Button>
                              </Stack>
                         </Box>
                    </Box>

                    {/* Create Button */}
                    <Box pt={2}>
                         <AddTaskButton
                            onClick={handleAddTask}
                            disabled={
                              name.length > TASK_NAME_MAX_LENGTH ||
                              description.length > DESCRIPTION_MAX_LENGTH ||
                              !name
                            }
                            sx={{
                              width: "100%",
                              py: 2,
                              m: 0,
                              borderRadius: "18px",
                              fontSize: "16px",
                              fontWeight: 800,
                              textTransform: "none",
                              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                              boxShadow: `0 8px 25px -6px ${color}60`,
                              "&:hover": {
                                boxShadow: `0 12px 30px -6px ${color}80`,
                                background: `linear-gradient(135deg, ${color}, ${color})`,
                              },
                            }}
                          >
                            Create Task
                          </AddTaskButton>
                    </Box>

                </Stack>
            </InputThemeProvider>
        </GlassCard>
      </AddTaskContainer>
    </>
  );
};

export default AddTask;
