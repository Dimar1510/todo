import { format } from "date-fns";
import { createProject, createTask, projectList } from "./functions";

export const getMockData = () => {
  const today = new Date();
  createTask(
    "Look around",
    format(new Date(), "yyyy-LL-dd"),
    false,
    "first time here?",
  );
  createTask(
    "Create a project",
    format(new Date(), "yyyy-LL-dd"),
    false,
    "create a project and begin to track tasks or create a new task on a default page",
  );
  createProject("Work", "#982cf1");
  createTask("Learn JavaScript", "", true, "need to keep grinding");
  createTask(
    "Rethink your life choices",
    format(new Date(), "yyyy-LL-dd"),
    false,
    "this one might take a while",
  );
  createProject("Gym", "#ff564a");
  createTask(
    "Leg day",
    format(today.setDate(today.getDate() + 1), "yyyy-LL-dd"),
    true,
    "",
  );
  createTask(
    "Chest day",
    format(today.setDate(today.getDate() + 2), "yyyy-LL-dd"),
    false,
    "",
  );
  createTask(
    "Back day",
    format(today.setDate(today.getDate() + 3), "yyyy-LL-dd"),
    false,
    "",
  );
  createTask(
    "Arms day",
    format(today.setDate(today.getDate() + 4), "yyyy-LL-dd"),
    true,
    "",
  );
  projectList.current = projectList.projects[0];
};
