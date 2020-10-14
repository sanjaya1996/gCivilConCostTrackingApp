import { MINIPHASES } from "../../data/dummy-data";
import {
  TOGGLE_SPECIAL,
  DELETE_MINIPHASE,
  CREATE_MINIPHASE,
  UPDATE_MINIPHASE,
  SET_MINIPHASES,
  SET_SPECIALMPHASES,
} from "../actions/miniPhases";
import MiniPhase from "../../models/miniPhase";

const initialState = {
  miniPhases: MINIPHASES,
  specialMiniPhases: [],
};

const miniPhasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MINIPHASES:
      return {
        ...state,
        miniPhases: action.miniPhases,
      };
    case SET_SPECIALMPHASES:
      return {
        ...state,
        specialMiniPhases: action.specialMiniPhases,
      };
    case TOGGLE_SPECIAL:
      const existingIndex = state.specialMiniPhases.findIndex(
        (phase) => phase.id === action.miniPhaseId
      );
      if (existingIndex >= 0) {
        const updatedSpecialPhases = [...state.specialMiniPhases];
        updatedSpecialPhases.splice(existingIndex, 1);
        return { ...state, specialMiniPhases: updatedSpecialPhases };
      } else {
        const miniPhase = state.miniPhases.find(
          (miniPhase) => miniPhase.id === action.miniPhaseId
        );
        return {
          ...state,
          specialMiniPhases: state.specialMiniPhases.concat(miniPhase),
        };
      }

    case DELETE_MINIPHASE:
      return {
        ...state,
        miniPhases: state.miniPhases.filter(
          (phase) => phase.id !== action.mPhaseId
        ),
        specialMiniPhases: state.specialMiniPhases.filter(
          (phase) => phase.id !== action.mPhaseId
        ),
      };

    case CREATE_MINIPHASE:
      const newMiniPhase = new MiniPhase(
        action.miniPhaseData.id,
        action.miniPhaseData.phaseId,
        action.miniPhaseData.title,
        action.miniPhaseData.status,
        action.miniPhaseData.description
      );
      return {
        ...state,
        miniPhases: state.miniPhases.concat(newMiniPhase),
      };
    case UPDATE_MINIPHASE:
      const miniPhaseIndex = state.miniPhases.findIndex(
        (mPhase) => mPhase.id === action.mpId
      );
      const updatedMinPhase = new MiniPhase(
        action.mpId,
        state.miniPhases[miniPhaseIndex].phaseId, // go to state, go to miniPhase slice, find id equal to miniPhaseIndex and get the phaseId
        action.miniPhaseData.title,
        action.miniPhaseData.status,
        action.miniPhaseData.description
      );

      const updatedProjectMiniPhases = [...state.miniPhases];
      updatedProjectMiniPhases[miniPhaseIndex] = updatedMinPhase;
      return {
        ...state,
        miniPhases: updatedProjectMiniPhases,
      };
    default:
      return state;
  }
};

export default miniPhasesReducer;
