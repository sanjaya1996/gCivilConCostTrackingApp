import Supervisor from "../../models/supervisor";

export const CREATE_SUPERVISOR_PROFILE = "CREATE_SUPERVISOR_PROFILE";
export const UPDATE_SUPERVISOR_PROFILE = "UPDATE_SUPERVISOR_PROFILE";
export const SET_SUPERVISOR_PROFILE = "SET_SUPERVISOR_PROFILE";

export const fetchSupervisors = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const response = await fetch(
      "https://costtracking-app.firebaseio.com/supervisors.json"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    const loadedSupervisors = [];
    for (const key in resData) {
      loadedSupervisors.push(
        new Supervisor(
          key,
          resData[key].userId,
          resData[key].fName,
          resData[key].lName,
          resData[key].email,
          resData[key].phone,
          resData[key].jobTitle,
          resData[key].profilePic
        )
      );
    }

    dispatch({
      type: SET_SUPERVISOR_PROFILE,
      supervisors: loadedSupervisors,
      user:
        loadedSupervisors.find((supervisor) => supervisor.userId === userId) ||
        {},
    });
  };
};

export const createSupervisorProfile = (
  fName,
  lName,
  email,
  phone,
  jobTitle,
  profilePic
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/supervisors.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fName,
          lName,
          email,
          phone,
          jobTitle,
          profilePic,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_SUPERVISOR_PROFILE,
      profileData: {
        id: resData.name,
        fName,
        lName,
        email,
        phone,
        jobTitle,
        profilePic,
        userId,
      },
    });
  };
};

export const updateSupervisorProfile = (
  id,
  fName,
  lName,
  email,
  phone,
  jobTitle,
  profilePic
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://costtracking-app.firebaseio.com/supervisors/${id}.json?auth=${token}`,
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
          jobTitle,
          profilePic,
        }),
      }
    );
    dispatch({
      type: UPDATE_SUPERVISOR_PROFILE,
      id,
      profileData: { fName, lName, email, phone, jobTitle, profilePic },
    });
  };
};
