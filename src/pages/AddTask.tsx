import { Category, Task } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, GlassCard, StyledInput } from "../styles";
import { AddTaskRounded } from "@mui/icons-material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
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
  max-width: 800px;
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
  };

  return (
    <>
      <TopBar title="New Task" />
      <AddTaskContainer>
        <GlassCard sx={{ gap: { xs: 2, sm: 3 }, p: { xs: 2.5, sm: 4 } }}>
          <CustomEmojiPicker
            emoji={emoji}
            onEmojiChange={setEmoji}
            name={name}
            type="task"
            color={color}
          />
          <InputThemeProvider>
            <StyledInput
              label="Task Name"
              placeholder="What needs to be done?"
              value={name}
              onChange={handleNameChange}
              required
              error={nameError !== ""}
              helperText={nameError || `${name.length}/${TASK_NAME_MAX_LENGTH}`}
              fullWidth
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
            />
            <StyledInput
              label="Deadline"
              type="datetime-local"
              value={deadline}
              onChange={handleDeadlineChange}
              onFocus={() => setIsDeadlineFocused(true)}
              onBlur={() => setIsDeadlineFocused(false)}
              hidetext={(!deadline || deadline === "") && !isDeadlineFocused}
              sx={{ colorScheme: theme.darkmode ? "dark" : "light" }}
              fullWidth
            />

            {user.settings.enableCategories && (
              <CategorySelect
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                width="100%"
                fontColor={theme.text.primary}
              />
            )}
          </InputThemeProvider>

          <ColorPicker
            color={color}
            width="100%"
            onColorChange={setColor}
            fontColor={theme.text.primary}
          />

          <AddTaskButton
            onClick={handleAddTask}
            disabled={
              name.length > TASK_NAME_MAX_LENGTH ||
              description.length > DESCRIPTION_MAX_LENGTH ||
              !name
            }
            sx={{
              mt: 2,
              py: { xs: 1.8, sm: 2 },
              borderRadius: "18px",
              fontSize: "16px",
              fontWeight: 800,
              textTransform: "none",
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              boxShadow: `0 8px 25px -6px ${color}60`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 30px -6px ${color}80`,
                background: `linear-gradient(135deg, ${color}, ${color})`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
                background: theme.darkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }
            }}
          >
            Create Task
          </AddTaskButton>
        </GlassCard>
      </AddTaskContainer>
    </>
  );
};

export default AddTask;
