import UserNote from "../../models/userNote";

export const CREATE_NOTE = "CREATE_NOT";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const DELETE_NOTE = "DELETE_NOTE";
export const SET_NOTES = "SET_NOTES";

export const fetchUserNotes = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await fetch(
      "https://costtracking-app.firebaseio.com/userNotes.json"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    const loadedUsersNotes = [];
    for (const key in resData) {
      loadedUsersNotes.push(
        new UserNote(
          key,
          resData[key].title,
          resData[key].description,
          resData[key].images,
          resData[key].pickedDateTime,
          resData[key].notificationId,
          resData[key].userId
        )
      );
    }
    dispatch({
      type: SET_NOTES,
      userNotes:
        loadedUsersNotes.filter((note) => note.userId === userId) || [],
    });
  };
};

export const createNote = (
  title,
  description,
  images,
  pickedDateTime,
  notificationId
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    const response = await fetch(
      `https://costtracking-app.firebaseio.com/userNotes.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          images,
          pickedDateTime,
          notificationId,
          userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_NOTE,
      noteData: {
        id: resData.name,
        title,
        description,
        images,
        pickedDateTime,
        notificationId,
        userId,
      },
    });
  };
};

export const updateNote = (
  id,
  title,
  description,
  images,
  pickedDateTime,
  notificationId
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/userNotes/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          images,
          pickedDateTime,
          notificationId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_NOTE,
      id,
      noteData: { title, description, images, pickedDateTime, notificationId },
    });
  };
};

export const deleteNote = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/userNotes/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_NOTE, id });
  };
};
