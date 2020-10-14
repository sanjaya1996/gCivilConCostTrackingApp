import Manager from "../../models/manager";

export const CREATE_MANAGER = "CREATE_MANAGER";
export const UPDATE_MANAGER = "UPDATE_MANAGER";
export const DELETE_MANAGER = "DELETE_MANAGER";
export const SET_MANAGERS = "SET_MANAGERS";

export const fetchManagers = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await fetch(
      "https://costtracking-app.firebaseio.com/managers.json"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    const loadedManagers = [];
    for (const key in resData) {
      loadedManagers.push(
        new Manager(
          key,
          resData[key].fName,
          resData[key].lName,
          resData[key].email,
          resData[key].phone,
          resData[key].supervisorId
        )
      );
    }

    dispatch({
      type: SET_MANAGERS,
      managers:
        loadedManagers.filter((manager) => manager.supervisorId === userId) ||
        [],
    });
  };
};

export const createManager = (fName, lName, phone, email) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/managers.json?auth=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fName,
          lName,
          phone,
          email,
          supervisorId: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MANAGER,
      managerData: {
        id: resData.name,
        fName,
        lName,
        phone,
        email,
        supervisorId: userId,
      },
    });
  };
};

export const updateManager = (id, fName, lName, phone, email) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/managers/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fName,
          lName,
          phone,
          email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: UPDATE_MANAGER,
      id,
      managerData: { fName, lName, phone, email },
    });
  };
};

export const deletManager = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/managers/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    dispatch({ type: DELETE_MANAGER, id });
  };
};
