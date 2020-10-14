import {
  CREATE_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  SET_NOTES,
} from "../actions/usersNotes";
import UserNote from "../../models/userNote";

const initialState = {
  notes: [],
};

const usersNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return {
        notes: action.userNotes,
      };
    case CREATE_NOTE:
      const newNote = new UserNote(
        action.noteData.id,
        action.noteData.title,
        action.noteData.description,
        action.noteData.images,
        action.noteData.pickedDateTime,
        action.noteData.notificationId,
        action.noteData.userId
      );
      return {
        notes: state.notes.concat(newNote),
      };
    case UPDATE_NOTE:
      const noteIndex = state.notes.findIndex((note) => note.id === action.id);
      const updatedNote = new UserNote(
        action.id,
        action.noteData.title,
        action.noteData.description,
        action.noteData.images,
        action.noteData.pickedDateTime,
        action.noteData.notificationId,
        state.notes[noteIndex].userId
      );
      const updatedNotesState = [...state.notes];
      updatedNotesState[noteIndex] = updatedNote;
      return {
        notes: updatedNotesState,
      };
    case DELETE_NOTE:
      return {
        notes: state.notes.filter((note) => note.id != action.id),
      };
    default:
      return state;
  }
};

export default usersNotesReducer;
