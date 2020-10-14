import Client from "../../models/client";

export const CREATE_CLIENT = "CREATE_CLIENT";
export const UPDATE_CLIENT = "UPDATE_CLIENT";
export const DELETE_CLIENT = "DELETE_CLIENT";
export const SET_CLIENT = "SET_CLIENT";

export const fetchClients = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/clients.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      const loadedClients = [];

      for (const key in resData) {
        loadedClients.push(
          new Client(
            key,
            resData[key].projectId,
            resData[key].fName,
            resData[key].lName,
            resData[key].email,
            resData[key].phone,
            resData[key].supervisorId
          )
        );
      }

      dispatch({
        type: SET_CLIENT,
        clients:
          loadedClients.filter((client) => client.supervisorId === userId) ||
          [],
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createClient = (projectId, fName, lName, email, phone) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/clients.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          fName,
          lName,
          email,
          phone,
          supervisorId: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    dispatch({
      type: CREATE_CLIENT,
      clientData: {
        id: resData.name,
        projectId,
        fName,
        lName,
        email,
        phone,
        supervisorId: userId,
      },
    });
  };
};

export const updateClient = (id, fName, lName, email, phone) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/clients/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fName,
          lName,
          email,
          phone,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_CLIENT,
      id,
      clientData: { fName, lName, email, phone },
    });
  };
};

export const deleteClient = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/clients/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_CLIENT, id });
  };
};
