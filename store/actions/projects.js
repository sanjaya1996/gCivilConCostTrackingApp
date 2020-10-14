import Project from "../../models/project";

export const CREATE_PROJECT = " CREATE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const FINISH_PROJECT = "FINISH_PROJECT";
export const SET_PROJECTS = "SET_PROJECTS";
export const SET_HISTORYPROJECTS = "SET_HISTORYPROJECTS";
export const DELETE_HISTORYPROJECTS = "DELETE_HISTORYPROJECTS";

export const fetchProjects = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/projects.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProjects = [];

      for (const key in resData) {
        loadedProjects.push(
          new Project(
            key,
            "c2",
            resData[key].supervisorId,
            resData[key].title,
            resData[key].address,
            resData[key].startedDate,
            resData[key].estimatedDate,
            resData[key].estimatedBudget
          )
        );
      }
      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects,
        userProject:
          loadedProjects.find((project) => project.supervisorId === userId) ||
          [],
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchHistoryProjects = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await fetch(
      "https://costtracking-app.firebaseio.com/historyProjects.json"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    const loadedHistoryProjects = [];

    for (const key in resData) {
      loadedHistoryProjects.push(
        new Project(
          resData[key].finishedProject.id,
          "c2",
          resData[key].finishedProject.supervisorId,
          resData[key].finishedProject.projectTitle,
          resData[key].finishedProject.projectAddress,
          resData[key].finishedProject.startDate,
          resData[key].finishedProject.estimatedDate,
          resData[key].finishedProject.estimatedBudget
        )
      );
    }

    dispatch({
      type: SET_HISTORYPROJECTS,
      historyProjects: loadedHistoryProjects,
      userHistoryProjects: loadedHistoryProjects.filter(
        (project) => project.supervisorId === userId
      ),
    });
  };
};

export const createProject = (
  title,
  address,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/projects.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          address,
          startedDate,
          estimatedDate,
          estimatedBudget,
          supervisorId: userId,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PROJECT,
      projectData: {
        id: resData.name,
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
        supervisorId: userId,
      },
    });
  };
};

export const updateProject = (
  id,
  title,
  address,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/projects/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          address,
          startedDate,
          estimatedDate,
          estimatedBudget,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PROJECT,
      id,
      projectData: {
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
      },
    });
  };
};

export const finishProject = (finishedProject) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response1 = await fetch(
      `https://costtracking-app.firebaseio.com/historyProjects.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finishedProject,
        }),
      }
    );

    if (!response1.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response1.json();

    const response2 = await fetch(
      `https://costtracking-app.firebaseio.com/projects/${finishedProject.id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response2.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({ type: FINISH_PROJECT, finishedProject });
  };
};

export const deleteHistoryProject = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response1 = await fetch(
      "https://costtracking-app.firebaseio.com/historyProjects/.json"
    );

    if (!response1.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response1.json();
    let historyKey;
    for (const key in resData) {
      if (resData[key].finishedProject.id === id) {
        historyKey = key;
        break;
      }
    }
    const response2 = await fetch(
      `https://costtracking-app.firebaseio.com/historyProjects/${historyKey}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response2.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({ type: DELETE_HISTORYPROJECTS, id });
  };
};
