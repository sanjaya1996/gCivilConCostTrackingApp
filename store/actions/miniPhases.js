import MiniPhase from "../../models/miniPhase";

export const TOGGLE_SPECIAL = "TOGGLE-SPECIAL";
export const DELETE_MINIPHASE = "DELETE_MINIPHASE";
export const CREATE_MINIPHASE = "CREATE_MINIPHASE";
export const UPDATE_MINIPHASE = "UPDATE_MINIPHASE";
export const SET_MINIPHASES = "SET_MINIPHASES";
export const SET_SPECIALMPHASES = "SET_SPECIALMPHASES";

export const fetchMiniPhases = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/miniPhases.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedMiniPhases = [];
      for (const key in resData) {
        loadedMiniPhases.push(
          new MiniPhase(
            key,
            resData[key].phaseId,
            resData[key].title,
            resData[key].status,
            resData[key].description
          )
        );
      }
      dispatch({ type: SET_MINIPHASES, miniPhases: loadedMiniPhases });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchSpecialMphases = () => {
  return async (dispatch) => {
    const response = await fetch(
      "https://costtracking-app.firebaseio.com/specialMiniPhases.json"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    const loadedSpecialsmPhases = [];
    for (const key in resData) {
      loadedSpecialsmPhases.push(
        new MiniPhase(
          resData[key].miniPhase.id,
          resData[key].miniPhase.phaseId,
          resData[key].miniPhase.title,
          resData[key].miniPhase.status,
          resData[key].miniPhase.description
        )
      );
    }
    dispatch({
      type: SET_SPECIALMPHASES,
      specialMiniPhases: loadedSpecialsmPhases,
    });
  };
};

export const toggleSpecial = (miniPhase, isSpecial) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (isSpecial) {
      const response1 = await fetch(
        "https://costtracking-app.firebaseio.com/specialMiniPhases.json"
      );
      const resData1 = await response1.json();
      let specialMphaseKey;
      for (const key in resData1) {
        if (resData1[key].miniPhase.id === miniPhase.id) {
          specialMphaseKey = key;
        }
        break;
      }
      await fetch(
        `https://costtracking-app.firebaseio.com/specialMiniPhases/${specialMphaseKey}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );
    } else {
      await fetch(
        `https://costtracking-app.firebaseio.com/specialMiniPhases.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ miniPhase }),
        }
      );
    }
    dispatch({ type: TOGGLE_SPECIAL, miniPhaseId: miniPhase.id });
  };
};

export const deleteMiniPhase = (miniPhaseId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miniPhases/${miniPhaseId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_MINIPHASE, mPhaseId: miniPhaseId });
  };
};

export const createMiniPhase = (phaseId, title, status, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miniPhases.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phaseId,
          title,
          status,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MINIPHASE,
      miniPhaseData: {
        id: resData.name,
        phaseId: phaseId,
        title: title,
        status: status,
        description: description,
      },
    });
  };
};

export const updateMiniPhase = (id, title, status, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miniPhases/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          status,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_MINIPHASE,
      mpId: id,
      miniPhaseData: {
        title: title,
        status: status,
        description: description,
      },
    });
  };
};

export const deleteMphaseOnDltProject = (mPhaseIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    mPhaseIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/miniPhases/${id}.json?auth=${token}`,
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
