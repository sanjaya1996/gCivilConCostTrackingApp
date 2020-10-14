import MiniPhaseMiscellaneous from "../../models/miniPhaseMiscellaneous";

export const DELETE_MPHASE_MISCELLANY = "DELETE_MPHASE_MISCELLANY";
export const CREATE_MPHASE_MISCELLANY = "CREATE_MPHASE_MISCELLANY";
export const UPDATE_MPHASE_MISCELLANY = "UPDATE_MPHASE_MISCELLANY";
export const SET_MISCELLANIES = "SET_MISCELLANIES";
export const DELETE_MISCELLANY_ONDLTMPHASE = "DELETE_MISCELLANY_ONDLTMPHASE";

export const fetchMiscellanies = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/miscellanies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedMiscellanies = [];

      for (const key in resData) {
        loadedMiscellanies.push(
          new MiniPhaseMiscellaneous(
            key,
            resData[key].mPhaseId,
            resData[key].projectPhaseId,
            resData[key].title,
            resData[key].description,
            resData[key].totalCost
          )
        );
      }
      dispatch({ type: SET_MISCELLANIES, miscellanies: loadedMiscellanies });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteMphaseMiscellany = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miscellanies/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_MPHASE_MISCELLANY, miscellanyId: id });
  };
};

export const createMphaseMiscellany = (
  mPhaseId,
  projectPhaseId,
  title,
  description,
  totalCost
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miscellanies.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mPhaseId,
          projectPhaseId,
          title,
          description,
          totalCost,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_MISCELLANY,
      miscellanyData: {
        id: resData.name,
        mPhaseId,
        projectPhaseId,
        title,
        description,
        totalCost,
      },
    });
  };
};

export const updateMphaseMiscellany = (id, title, description, totalCost) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/miscellanies/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          totalCost,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_MPHASE_MISCELLANY,
      misId: id,
      miscellanyData: {
        title,
        description,
        totalCost,
      },
    });
  };
};

export const deleteMiscellanyOnDltMphase = (miscellaniIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    miscellaniIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/miscellanies/${id}.json?auth=${token}`,
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

export const deleteMiscellanyOnDltProject = (miscellanyIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    miscellanyIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/miscellanies/${id}.json?auth=${token}`,
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
