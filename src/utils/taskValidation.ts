import { Category, Task } from "../types/user";
import { CATEGORY_NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { isHexColor } from "./";

export const isTaskValid = (task: Task): boolean => {
  // Check if task name length is valid
  if (task.name && task.name.length > TASK_NAME_MAX_LENGTH) {
    return false;
  }

  // Check if description length is valid
  if (task.description && task.description.length > DESCRIPTION_MAX_LENGTH) {
    return false;
  }

  // Check if category names are valid
  if (
    task.category &&
    task.category.some((cat: Category) => cat.name.length > CATEGORY_NAME_MAX_LENGTH)
  ) {
    return false;
  }

  return true;
};

export const hasInvalidColors = (tasks: Task[]): boolean => {
  const isCategoryColorValid = (category: Category) =>
    category.color ? isHexColor(category.color) : true;

  return tasks.some((task) => {
    return (
      (task.color && !isHexColor(task.color)) ||
      (task.category && !task.category.every((cat) => isCategoryColorValid(cat)))
    );
  });
};
