import MiniPhaseLabor from "../../models/miniPhaseLabor";

export const DELETE_MPHASE_LABOR = "DELETE_MPHASE_LABOR";
export const CREATE_MPHASE_LABOR = "CREATE_MPHASE_LABOR";
export const UPDATE_MPHASE_LABOR = "UPDATE_MPHASE_LABOR";
export const SET_LABORS = "SET_LABORS";
export const DELETE_LABORS_ONDLTMPHASE = "DELETE_LABORS_ONDLTMPHASE";

export const fetchLabors = () => {
  return async (dispatch) => {
    // any async code you want
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/labors.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedLabors = [];
      for (const key in resData) {
        loadedLabors.push(
          new MiniPhaseLabor(
            key,
            resData[key].mPhaseId,
            resData[key].projectPhaseId,
            resData[key].fName,
            resData[key].lName,
            resData[key].email,
            resData[key].phone,
            resData[key].role,
            resData[key].availability,
            resData[key].payRate,
            resData[key].amountPaid,
            resData[key].accountDetails,
            resData[key].description,
            resData[key].supervisorId
          )
        );
      }

      dispatch({ type: SET_LABORS, labors: loadedLabors });
    } catch (err) {
      //send to custom analytics server
      // if you are only throwing no need of try catch block
      throw err;
    }
  };
};

export const deleteMphaseLabor = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/labors/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_MPHASE_LABOR, laborId: id });
  };
};

export const createMphaseLabor = (
  mPhaseId,
  projectPhaseId,
  fName,
  lName,
  email,
  phone,
  role,
  payRate,
  availability,
  amountPaid,
  accountDetails,
  description
) => {
  return async (dispatch, getState) => {
    const supervisorId = getState().auth.userId;
    const token = getState().auth.token;
    // any async code you want
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/labors.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "applicaiton/json",
        },
        body: JSON.stringify({
          mPhaseId,
          projectPhaseId,
          fName,
          lName,
          email,
          phone,
          role,
          payRate,
          availability,
          amountPaid,
          accountDetails,
          description,
          supervisorId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_LABOR,
      laborData: {
        id: resData.name,
        mPhaseId,
        projectPhaseId,
        fName,
        lName,
        email,
        phone,
        role,
        payRate,
        availability,
        amountPaid,
        accountDetails,
        description,
        supervisorId,
      },
    });
  };
};

export const updateMphaseLabor = (
  id,
  fName,
  lName,
  email,
  phone,
  role,
  payRate,
  availability,
  amountPaid,
  accountDetails,
  description
) => {
  return async (dispatch, getState) => {
    const supervisorId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/labors/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "applicaiton/json",
        },
        body: JSON.stringify({
          fName,
          lName,
          email,
          phone,
          role,
          payRate,
          availability,
          amountPaid,
          accountDetails,
          description,
          supervisorId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_MPHASE_LABOR,
      lid: id,
      laborData: {
        fName,
        lName,
        email,
        phone,
        role,
        payRate,
        availability,
        amountPaid,
        accountDetails,
        description,
        supervisorId,
      },
    });
  };
};

export const deleteLaborsOnDltMphase = (laborIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    laborIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/labors/${id}.json?auth=${token}`,
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

export const deleteLaborsOnDltProject = (laborIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    laborIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/labors/${id}.json?auth=${token}`,
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
