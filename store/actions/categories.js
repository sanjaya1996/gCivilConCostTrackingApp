import Category from "../../models/category";

export const CREATE_PROJECTPHASE = "CREATE_PROJECTPHASE";
export const UPDATE_PROJECTPHASE = "UPDATE_PROJECTPHASE";
export const SET_PROJECTPHASES = "SET_PROJECTPHASES";
export const DELETE_PHASES_ONDLTPROJECT = "DELETE_PHASES_ONDLTPROJECT";

export const fetchProjectPhases = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/projectPhases.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      const loadedProjectPhases = [];

      for (const key in resData) {
        loadedProjectPhases.push(
          new Category(
            key,
            resData[key].projectId,
            resData[key].title,
            resData[key].startedDate,
            resData[key].estimatedDate,
            resData[key].estimatedBudget
          )
        );
      }

      dispatch({ type: SET_PROJECTPHASES, projectPhases: loadedProjectPhases });
    } catch (err) {
      throw err;
    }
  };
};

export const createProjectPhase = (
  projectId,
  title,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/projectPhases.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title,
          startedDate,
          estimatedDate,
          estimatedBudget,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_PROJECTPHASE,
      projectPhaseData: {
        id: resData.name,
        projectId,
        title,
        startedDate,
        estimatedDate,
        estimatedBudget,
      },
    });
  };
};

export const updateProjectPhase = (
  phaseId,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/projectPhases/${phaseId}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
      type: UPDATE_PROJECTPHASE,
      phaseId,
      projectPhaseData: { startedDate, estimatedDate, estimatedBudget },
    });
  };
};

export const deletePhasesOnDltProject = (phaseIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    phaseIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/projectPhases/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    });
  };
};
