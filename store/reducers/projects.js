import { PROJECTS } from "../../data/dummy-data";
import {
  UPDATE_PROJECT,
  CREATE_PROJECT,
  FINISH_PROJECT,
  SET_PROJECTS,
  SET_HISTORYPROJECTS,
  DELETE_HISTORYPROJECTS,
} from "../actions/projects";
import Project from "../../models/project";

const initialState = {
  projects: [],
  userProject: [],
  historyProjects: [],
  userHistoryProjects: [],
};

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.projects,
        userProject: action.userProject,
      };
    case SET_HISTORYPROJECTS:
      return {
        ...state,
        historyProjects: action.historyProjects,
        userHistoryProjects: action.userHistoryProjects,
      };
    case CREATE_PROJECT:
      const newProject = new Project(
        action.projectData.id,
        "c2",
        action.projectData.supervisorId,
        action.projectData.title,
        action.projectData.address,
        action.projectData.startedDate,
        action.projectData.estimatedDate,
        action.projectData.estimatedBudget
      );
      return {
        ...state,
        projects: state.projects.concat(newProject),
        userProject: newProject,
      };

    case UPDATE_PROJECT:
      const projectIndex = state.projects.findIndex(
        (project) => project.id === action.id
      );
      const updatedUserProject = new Project(
        action.id,
        "c2",
        state.projects[projectIndex].supervisorId,
        action.projectData.title,
        action.projectData.address,
        action.projectData.startedDate,
        action.projectData.estimatedDate,
        action.projectData.estimatedBudget
      );
      const updatedProjects = [...state.projects];
      updatedProjects[projectIndex] = updatedUserProject;
      return {
        ...state,
        projects: updatedProjects,
        userProject: updatedUserProject,
      };
    case FINISH_PROJECT:
      const finishedProject = state.userProject;
      return {
        projects: state.projects.filter(
          (project) => project.id != finishedProject.id
        ),
        userProject: [],
        historyProjects: state.historyProjects.concat(finishedProject),
        userHistoryProjects: state.userHistoryProjects.concat(finishedProject),
      };
    case DELETE_HISTORYPROJECTS:
      return {
        ...state,
        historyProjects: state.historyProjects.filter(
          (project) => project.id != action.id
        ),
        userHistoryProjects: state.userHistoryProjects.filter(
          (project) => project.id != action.id
        ),
      };
    default:
      return { ...state };
  }
};

export default projectsReducer;
